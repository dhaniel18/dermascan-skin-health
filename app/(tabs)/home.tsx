import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, Modal, RefreshControl,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import {
  AlertTriangle, Bookmark, BookmarkCheck,
  CheckCircle, ChevronDown, ChevronUp, Plus, X,
} from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { getCurrentUser } from "@/services/auth";
import { getSkinProfile } from "@/services/profile";
import { getScanHistory } from "@/services/scans";
import { searchProducts, toggleSaveProduct, getSavedProducts } from "@/services/products";
import { addToRoutine, getUserRoutine } from "@/services/routine";
import { enrichAliasesFromHuggingFace } from "@/services/ingredients";
import { getIngredientById } from "@/lib/ingredientDatabase";
import type { Product, ScanHistoryItem, User, RoutineProduct } from "@/types/domain";

const SEV_COLOR = { High: "#C0392B", Medium: "#E67E22", Low: "#F1C40F" } as const;
const SEV_BG    = { High: "#fdecea", Medium: "#fff8e1", Low: "#fffde7" } as const;

const WARN_LABEL: Record<string, string> = {
  combination:      "⚠️ Dangerous Combination",
  allergen:         "🚨 Allergen Risk",
  comedogenic:      "🔴 Pore-Clogging",
  unsuitableForSkin:"⛔ Unsuitable for Your Skin",
};

function scoreColor(s?: number) {
  if (!s) return colors.muted;
  return s >= 80 ? colors.success : s >= 50 ? "#E67E22" : "#C0392B";
}
function scoreLabel(s?: number) {
  if (!s) return "—";
  return s >= 80 ? "Safe" : s >= 50 ? "Caution" : "Risky";
}

// ── Ingredient Preview (shown inside modal, collapsed by default) ──
function IngredientPreview({
  scan,
  warnings,
}: {
  scan: ScanHistoryItem;
  warnings: ScanHistoryItem["warnings"];
}) {
  const [expanded, setExpanded] = useState(false);

  const flaggedNames = new Set((warnings ?? []).flatMap((w) => w.ingredientNames ?? []));
  const comedogenicNames = new Set(
    (warnings ?? []).filter((w) => w.type === "comedogenic").flatMap((w) => w.ingredientNames ?? [])
  );
  const allergenNames = new Set(
    (warnings ?? []).filter((w) => w.type === "allergen").flatMap((w) => w.ingredientNames ?? [])
  );
  const unsuitableNames = new Set(
    (warnings ?? []).filter((w) => w.type === "unsuitableForSkin").flatMap((w) => w.ingredientNames ?? [])
  );
  const combinationPairs = (warnings ?? [])
    .filter((w) => w.type === "combination")
    .map((w) => w.ingredientNames ?? []);

  const hasFlags = flaggedNames.size > 0;

  return (
    <View style={styles.card}>
      {/* Always-visible preview — top 3 flagged ingredients */}
      <View style={styles.previewHeader}>
        <Text style={styles.sectionTitle}>Ingredient Analysis</Text>
        {hasFlags && (
          <View style={styles.flagBadge}>
            <Text style={styles.flagBadgeText}>{flaggedNames.size} flagged</Text>
          </View>
        )}
      </View>

      {/* Preview: show up to 3 flagged ingredient chips even when collapsed */}
      {hasFlags && !expanded && (
        <View style={styles.chipRow}>
          {[...flaggedNames].slice(0, 3).map((name) => (
            <View
              key={name}
              style={[
                styles.chip,
                {
                  backgroundColor: comedogenicNames.has(name)
                    ? "#fff3e0"
                    : allergenNames.has(name)
                    ? "#fdecea"
                    : "#f3e5f5",
                },
              ]}
            >
              <Text style={[
                styles.chipText,
                {
                  color: comedogenicNames.has(name)
                    ? "#E67E22"
                    : allergenNames.has(name)
                    ? "#C0392B"
                    : "#7b1fa2",
                },
              ]}>
                {comedogenicNames.has(name) ? "🔴 " : allergenNames.has(name) ? "🚨 " : "⛔ "}
                {name}
              </Text>
            </View>
          ))}
          {flaggedNames.size > 3 && (
            <Text style={styles.moreText}>+{flaggedNames.size - 3} more</Text>
          )}
        </View>
      )}

      {!hasFlags && !expanded && (
        <Text style={styles.allClearText}>✓ All detected ingredients are safe for your profile</Text>
      )}

      {/* Expanded detail */}
      {expanded && (
        <View style={styles.expandedContent}>
          {comedogenicNames.size > 0 && (
            <View style={styles.flagGroup}>
              <Text style={[styles.flagLabel, { color: "#E67E22" }]}>🔴 Comedogenic (may clog pores)</Text>
              {[...comedogenicNames].map((n) => (
                <Text key={n} style={styles.flagItem}>• {n}</Text>
              ))}
            </View>
          )}
          {allergenNames.size > 0 && (
            <View style={styles.flagGroup}>
              <Text style={[styles.flagLabel, { color: "#C0392B" }]}>🚨 Allergen Risk</Text>
              {[...allergenNames].map((n) => (
                <Text key={n} style={styles.flagItem}>• {n}</Text>
              ))}
            </View>
          )}
          {unsuitableNames.size > 0 && (
            <View style={styles.flagGroup}>
              <Text style={[styles.flagLabel, { color: "#7b1fa2" }]}>⛔ Unsuitable for Your Skin</Text>
              {[...unsuitableNames].map((n) => (
                <Text key={n} style={styles.flagItem}>• {n}</Text>
              ))}
            </View>
          )}
          {combinationPairs.map((pair, i) => (
            <View key={i} style={styles.flagGroup}>
              <Text style={[styles.flagLabel, { color: "#C0392B" }]}>⚠️ Dangerous Combination</Text>
              <Text style={styles.flagItem}>• {pair.join(" + ")}</Text>
            </View>
          ))}
          {!hasFlags && (
            <Text style={styles.allClearText}>All detected ingredients are safe for your profile.</Text>
          )}
        </View>
      )}

      {/* Toggle button */}
      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setExpanded((e) => !e)}
      >
        {expanded
          ? <ChevronUp size={14} color={colors.muted} />
          : <ChevronDown size={14} color={colors.muted} />
        }
        <Text style={styles.toggleText}>
          {expanded ? "Show less" : "View full ingredient breakdown"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Scan Detail Modal ────────────────────────────────────────
function ScanDetailModal({
  scan, visible, onClose, savedIds, routineIds, onSaveToggle, onAddToRoutine,
}: {
  scan: ScanHistoryItem | null;
  visible: boolean;
  onClose: () => void;
  savedIds: Set<string>;
  routineIds: Set<string>;
  onSaveToggle: (id: string) => Promise<void>;
  onAddToRoutine: (id: string) => void;
}) {
  if (!scan) return null;
  const sc = scoreColor(scan.score);
  const warnings = scan.warnings ?? [];
  const productId = scan.productId;
  const isSaved = productId ? savedIds.has(productId) : false;
  const inRoutine = productId ? routineIds.has(productId) : false;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.modalTitle} numberOfLines={1}>{scan.productName}</Text>
            <Text style={styles.modalSub}>
              {new Date(scan.scannedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              {" · "}{scan.scanMethod === "ocr" ? "📷 Label scan" : "🔲 Barcode"}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color={colors.navy} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
          {/* Score */}
          <View style={styles.scoreCard}>
            <Text style={[styles.scoreNum, { color: sc }]}>{scan.score ?? "—"}</Text>
            <Text style={[styles.scoreLabel, { color: sc }]}>{scoreLabel(scan.score)}</Text>
            <Text style={styles.scoreSub}>Safety Score</Text>
          </View>

          {/* Warnings */}
          {warnings.length > 0 ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>⚠️ Warnings ({warnings.length})</Text>
              <View style={{ gap: 10, marginTop: 8 }}>
                {warnings.map((w, i) => (
                  <View key={i} style={[styles.warnCard, { backgroundColor: SEV_BG[w.severity] ?? "#fff8e1" }]}>
                    <View style={styles.warnRow}>
                      <AlertTriangle size={13} color={SEV_COLOR[w.severity]} />
                      <Text style={[styles.warnType, { color: SEV_COLOR[w.severity] }]}>
                        {WARN_LABEL[w.type] ?? w.type} · {w.severity}
                      </Text>
                    </View>
                    <Text style={styles.warnTitle}>{w.title}</Text>
                    <Text style={styles.warnMsg}>{w.message}</Text>
                    {w.ingredientNames && w.ingredientNames.length > 0 && (
                      <View style={styles.chipRow}>
                        {w.ingredientNames.map((n) => (
                          <View key={n} style={[styles.chip, { backgroundColor: "rgba(255,255,255,0.6)" }]}>
                            <Text style={[styles.chipText, { color: colors.navy }]}>{n}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={[styles.card, styles.allClearCard]}>
              <CheckCircle size={20} color={colors.success} />
              <Text style={styles.allClearBold}>No warnings — all clear ✓</Text>
            </View>
          )}

          {/* Ingredient preview (with expand/collapse) */}
          <IngredientPreview scan={scan} warnings={warnings} />

          {/* Actions */}
          {productId && (
            <View style={{ gap: 12, marginTop: 4, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => onSaveToggle(productId)}
                style={[styles.actionBtn, isSaved ? styles.actionBtnSecondary : styles.actionBtnPrimary]}
              >
                {isSaved
                  ? <BookmarkCheck size={18} color={colors.navy} />
                  : <Bookmark size={18} color={colors.cloud} />
                }
                <Text style={[styles.actionBtnText, { color: isSaved ? colors.navy : colors.cloud }]}>
                  {isSaved ? "Saved ✓" : "Save Product"}
                </Text>
              </TouchableOpacity>

              {!inRoutine ? (
                <TouchableOpacity
                  onPress={() => onAddToRoutine(productId)}
                  style={[styles.actionBtn, styles.actionBtnOutline]}
                >
                  <Plus size={18} color={colors.maroon} />
                  <Text style={[styles.actionBtnText, { color: colors.maroon }]}>Add to Routine</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.actionBtn, styles.actionBtnSecondary]}>
                  <CheckCircle size={18} color={colors.success} />
                  <Text style={[styles.actionBtnText, { color: colors.navy }]}>In Your Routine ✓</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────
export default function HomeScreen() {
  const [user, setUser]             = useState<User | null>(null);
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [savedIds, setSavedIds]     = useState<Set<string>>(new Set());
  const [routineIds, setRoutineIds] = useState<Set<string>>(new Set());
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);

  const load = useCallback(async () => {
    try {
      const [u, scans, saved, routine] = await Promise.all([
        getCurrentUser(), getScanHistory(), getSavedProducts(), getUserRoutine(),
      ]);
      setUser(u);
      setRecentScans(scans.slice(0, 10));
      setSavedIds(new Set(saved.map((p) => p.id)));
      setRoutineIds(new Set(routine.map((r: RoutineProduct) => r.productId)));
      const profile = await getSkinProfile();
      const recs = await searchProducts(profile?.concerns?.[0] ?? "serum");
      setRecommended(recs.slice(0, 4));
      enrichAliasesFromHuggingFace().catch(() => {});
    } catch (e) { console.warn("[home]", e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaveToggle = async (productId: string) => {
    const isSaved = savedIds.has(productId);
    await toggleSaveProduct(productId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      isSaved ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const handleAddToRoutine = (productId: string) => {
    Alert.alert("Add to Routine", "When do you use this product?", [
      { text: "☀️ Morning", onPress: async () => {
        await addToRoutine(productId, "morning");
        setRoutineIds((prev) => new Set([...prev, productId]));
      }},
      { text: "🌙 Evening", onPress: async () => {
        await addToRoutine(productId, "evening");
        setRoutineIds((prev) => new Set([...prev, productId]));
      }},
      { text: "☀️🌙 Both", onPress: async () => {
        await addToRoutine(productId, "any");
        setRoutineIds((prev) => new Set([...prev, productId]));
      }},
      { text: "Cancel", style: "cancel" },
    ]);
  };

  if (loading) return (
    <Screen scroll={false}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.navy} />
      </View>
    </Screen>
  );

  return (
    <>
      <Screen refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
      }>
        <Text style={styles.pageTitle}>
          {user ? `Hi, ${user.name.split(" ")[0]} 👋` : "Welcome to DermaScan"}
        </Text>
        <Text style={styles.pageSub}>Your skin-safe ingredient checker.</Text>

        {/* Recent Scans */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Recent Scans</Text>
        <Text style={[styles.allClearText, { marginBottom: 12 }]}>Tap a scan to see full details</Text>

        {recentScans.length === 0 ? (
          <Text style={styles.emptyText}>No scans yet. Tap the Scan tab to get started.</Text>
        ) : (
          <View style={{ gap: 12 }}>
            {recentScans.map((scan) => {
              const sc = scoreColor(scan.score);
              const hasWarnings = (scan.warnings?.length ?? 0) > 0;
              return (
                <TouchableOpacity
                  key={scan.id}
                  onPress={() => setSelectedScan(scan)}
                  style={styles.scanRow}
                  activeOpacity={0.75}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.scanName} numberOfLines={1}>{scan.productName}</Text>
                    <Text style={styles.scanMeta}>
                      {new Date(scan.scannedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      {" · "}{scan.scanMethod === "ocr" ? "📷 Label" : "🔲 Barcode"}
                    </Text>
                    {hasWarnings && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                        <AlertTriangle size={11} color={SEV_COLOR.Medium} />
                        <Text style={styles.warnHint}>
                          {scan.warnings!.length} warning{scan.warnings!.length > 1 ? "s" : ""} — tap to view
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ alignItems: "flex-end", marginLeft: 12 }}>
                    <Text style={[styles.scoreNum, { fontSize: 22, color: sc }]}>{scan.score ?? "—"}</Text>
                    <Text style={{ color: sc, fontSize: 11, fontWeight: "700" }}>{scoreLabel(scan.score)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Recommended */}
        {recommended.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Recommended For You</Text>
            <View style={{ gap: 10, marginTop: 12 }}>
              {recommended.map((p) => (
                <View key={p.id} style={styles.recRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.scanName}>{p.name}</Text>
                    {p.brand && <Text style={styles.scanMeta}>{p.brand}</Text>}
                  </View>
                  {p.category && (
                    <View style={styles.catBadge}>
                      <Text style={styles.catBadgeText}>{p.category}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </Screen>

      <ScanDetailModal
        scan={selectedScan}
        visible={!!selectedScan}
        onClose={() => setSelectedScan(null)}
        savedIds={savedIds}
        routineIds={routineIds}
        onSaveToggle={handleSaveToggle}
        onAddToRoutine={handleAddToRoutine}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pageTitle:       { fontSize: 28, fontWeight: "800", color: colors.navy },
  pageSub:         { fontSize: 15, color: colors.muted, marginTop: 4 },
  sectionTitle:    { fontSize: 17, fontWeight: "700", color: colors.navy },
  emptyText:       { fontSize: 14, color: colors.muted },
  allClearText:    { fontSize: 13, color: colors.muted },
  allClearBold:    { fontSize: 14, fontWeight: "700", color: colors.navy },
  moreText:        { fontSize: 12, color: colors.muted, alignSelf: "center" },

  scanRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF", borderRadius: 18,
    paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: "#374375", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  scanName:  { fontSize: 15, fontWeight: "700", color: colors.navy },
  scanMeta:  { fontSize: 12, color: colors.muted, marginTop: 2 },
  warnHint:  { fontSize: 12, color: "#E67E22", fontWeight: "600" },

  recRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF", borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 12,
    shadowColor: "#374375", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  catBadge: {
    backgroundColor: colors.periwinkleSoft,
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8,
  },
  catBadgeText: { fontSize: 11, fontWeight: "700", color: colors.navy },

  // Modal
  modalRoot:   { flex: 1, backgroundColor: "#FFFCF5" },
  modalHeader: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  modalTitle:  { fontSize: 19, fontWeight: "800", color: colors.navy },
  modalSub:    { fontSize: 12, color: colors.muted, marginTop: 2 },
  closeBtn:    {
    marginLeft: 12, padding: 8,
    backgroundColor: colors.periwinkleSoft, borderRadius: 100,
  },
  modalScroll: { paddingHorizontal: 20, paddingTop: 20, gap: 14, paddingBottom: 32 },

  scoreCard: {
    alignItems: "center",
    backgroundColor: colors.periwinkleSoft,
    borderRadius: 24, paddingVertical: 24,
  },
  scoreNum:   { fontWeight: "800", lineHeight: 60 },
  scoreLabel: { fontSize: 15, fontWeight: "700", marginTop: 2 },
  scoreSub:   { fontSize: 12, color: colors.muted, marginTop: 2 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20, padding: 16,
    shadowColor: "#374375", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  allClearCard: {
    flexDirection: "row", alignItems: "center", gap: 10, padding: 16,
    backgroundColor: "#f0faf5",
  },

  warnCard:  { borderRadius: 14, padding: 12, gap: 4 },
  warnRow:   { flexDirection: "row", alignItems: "center", gap: 6 },
  warnType:  { fontSize: 11, fontWeight: "700" },
  warnTitle: { fontSize: 13, fontWeight: "700", color: colors.navy },
  warnMsg:   { fontSize: 12, color: "#444", lineHeight: 18 },

  previewHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  flagBadge: { backgroundColor: "#fdecea", borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3 },
  flagBadgeText: { fontSize: 11, fontWeight: "700", color: "#C0392B" },
  chipRow:   { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  chip:      { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 },
  chipText:  { fontSize: 12, fontWeight: "600" },

  expandedContent: { gap: 12, marginTop: 4 },
  flagGroup: { gap: 4 },
  flagLabel: { fontSize: 12, fontWeight: "700" },
  flagItem:  { fontSize: 13, color: colors.navy, marginLeft: 8 },

  toggleBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    marginTop: 12, justifyContent: "center",
  },
  toggleText: { fontSize: 12, color: colors.muted, fontWeight: "600" },

  actionBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 16, paddingVertical: 16,
  },
  actionBtnPrimary:   { backgroundColor: colors.maroon },
  actionBtnSecondary: { backgroundColor: colors.periwinkleSoft },
  actionBtnOutline:   { borderWidth: 1.5, borderColor: colors.maroon },
  actionBtnText:      { fontSize: 15, fontWeight: "700" },
});
