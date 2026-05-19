// ============================================================
// DermaScan — Scan Screen
// Dual-mode camera:
//   Mode A (Barcode) — auto-detects and reads product barcodes
//   Mode B (OCR)     — captures ingredient label, Gemini reads it
// No manual typing needed.
// ============================================================
import {
  CameraView,
  type CameraView as CameraViewType,
  type BarcodeScanningResult,
  type BarcodeType,
  useCameraPermissions,
} from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import {
  Camera, ScanLine, ScanText, AlertTriangle,
  CheckCircle, Sparkles, FlipHorizontal, Zap, X,
} from "lucide-react-native";
import { useRef, useState, useCallback } from "react";
import {
  ActivityIndicator, Image, Modal, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { scanAndAnalyse, analyseFromOcrText, saveOcrScannedProduct } from "@/services/products";
import { extractIngredientsFromPhoto } from "@/services/ocr";
import { recordScan } from "@/services/scans";
import type { AnalysisResult, Product } from "@/types/domain";

const BARCODE_TYPES: BarcodeType[] = [
  "ean13","ean8","upc_a","upc_e","code128","code39","code93","qr",
];
const SEV = { High: "#C0392B", Medium: "#E67E22", Low: "#F1C40F" } as const;
const OCR_CROP = {
  x: 0.1,
  y: 0.17,
  width: 0.8,
  height: 0.66,
};

type CameraMode = "barcode" | "ocr";

type ScanState =
  | { status: "idle" }
  | { status: "capturing" }                    // taking the OCR photo
  | { status: "loading"; progress: string }
  | { status: "result"; product: Product; analysis: AnalysisResult; aiResearched: string[] }
  | { status: "notFound"; barcode: string }
  | { status: "error"; message: string };

async function cropToTextBlock(photo: { uri: string; width?: number; height?: number }) {
  if (!photo.width || !photo.height) return photo.uri;

  const crop = {
    originX: Math.round(photo.width * OCR_CROP.x),
    originY: Math.round(photo.height * OCR_CROP.y),
    width: Math.round(photo.width * OCR_CROP.width),
    height: Math.round(photo.height * OCR_CROP.height),
  };

  const result = await ImageManipulator.manipulateAsync(
    photo.uri,
    [{ crop }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );

  return result.uri;
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<ScanState>({ status: "idle" });
  const [mode, setMode] = useState<CameraMode>("barcode");
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [productNameDraft, setProductNameDraft] = useState("");
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [capturedOcrPhotoUri, setCapturedOcrPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraViewType>(null);

  const isIdle = state.status === "idle";
  const isLoading = state.status === "loading";
  const isCapturing = state.status === "capturing";

  // ── Barcode handler ───────────────────────────────────────
  const handleBarcode = useCallback(async ({ data }: BarcodeScanningResult) => {
    if (!isIdle) return;
    setState({ status: "loading", progress: "Looking up product..." });
    try {
      const result = await scanAndAnalyse(data);
      if (result) {
        await recordScan({
          productId: result.product.id,
          productName: result.product.name,
          scanMethod: "barcode",
          score: result.analysis.score,
          warnings: result.analysis.warnings,
        });
        setState({ status: "result", ...result, aiResearched: [] });
      } else {
        setState({ status: "notFound", barcode: data });
      }
    } catch (e) {
      setState({ status: "error", message: String(e) });
    }
  }, [isIdle]);

  // ── OCR photo capture ─────────────────────────────────────
  const handleProcessFrozenOcr = useCallback(async (inputProductName: string, photoUri: string) => {
    const requestedProductName = inputProductName.trim();
    if (!requestedProductName) {
      setIsNameModalVisible(true);
      return;
    }
    setState({ status: "loading", progress: "Reading ingredient label..." });

    try {
      // Send to Gemini Vision OCR
      const ocr = await extractIngredientsFromPhoto(photoUri);

      if (ocr.ingredients.length === 0) {
        setState({ status: "error", message: "No ingredient list found. Move closer to the label and try again." });
        return;
      }

      setState({ status: "loading", progress: `Found ${ocr.ingredients.length} ingredients — analysing...` });

      // Analyse the extracted ingredients (AI researches unknowns)
      const { analysis, aiResearched } = await analyseFromOcrText(
        ocr.ingredients.join(", "),
        (progress) => setState({ status: "loading", progress })
      );

      setState({ status: "loading", progress: "Saving scan..." });
      const ingredientIds = analysis.detectedIngredients.map((ingredient) => ingredient.id);
      const savedProduct = await saveOcrScannedProduct({
        name: requestedProductName,
        rawIngredientText: ocr.rawText || ocr.ingredients.join(", "),
        ingredientIds,
      });
      const productName = savedProduct?.name ?? requestedProductName;

      await recordScan({
        productId: savedProduct?.id,
        productName,
        scanMethod: "ocr",
        score: analysis.score,
        warnings: analysis.warnings,
      });

      setState({
        status: "result",
        product: {
          id: savedProduct?.id ?? "ocr",
          name: productName,
          image: savedProduct?.image,
          ingredientIds,
          rawIngredientText: ocr.rawText,
          verificationStatus: "Pending",
        },
        analysis,
        aiResearched,
      });
      setCapturedPhotoUri(null);
      setCapturedOcrPhotoUri(null);
    } catch (e: unknown) {
      setState({ status: "error", message: e instanceof Error ? e.message : String(e) });
    }
  }, []);

  const handleCaptureForOcr = useCallback(async () => {
    if (!cameraRef.current || !isIdle) return;
    setState({ status: "capturing" });

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.95,
        base64: false,
        skipProcessing: false,
      });

      if (!photo?.uri) throw new Error("Failed to capture photo.");

      const textBlockUri = await cropToTextBlock(photo);
      setCapturedPhotoUri(textBlockUri);
      setCapturedOcrPhotoUri(photo.uri);
      setProductNameDraft("");
      setState({ status: "idle" });
      setIsNameModalVisible(true);
    } catch (e: unknown) {
      setState({ status: "error", message: e instanceof Error ? e.message : String(e) });
    }
  }, [isIdle]);

  const handlePromptForProductName = () => {
    if (!isIdle) return;
    handleCaptureForOcr();
  };

  const handleSubmitProductName = () => {
    const cleanName = productNameDraft.trim();
    if (!cleanName || !capturedOcrPhotoUri) return;
    setIsNameModalVisible(false);
    handleProcessFrozenOcr(cleanName, capturedOcrPhotoUri);
  };

  const reset = () => {
    setState({ status: "idle" });
    setMode("barcode");
    setProductNameDraft("");
    setCapturedPhotoUri(null);
    setCapturedOcrPhotoUri(null);
  };

  // ── Result screen ─────────────────────────────────────────
  if (state.status === "result") {
    const { product, analysis, aiResearched } = state;
    const sc = analysis.score >= 80 ? colors.success : analysis.score >= 50 ? "#E67E22" : "#C0392B";
    return (
      <Screen>
        <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Scan Result</Text>
        <Text className="mt-1 text-base text-muted dark:text-darkMuted">
          {product.name}{product.brand ? ` · ${product.brand}` : ""}
        </Text>

        {product.image && (
          <Image
            source={{ uri: product.image }}
            className="mt-5 h-40 w-full rounded-3xl bg-peach-soft dark:bg-darkSurfaceSoft"
            resizeMode="contain"
          />
        )}

        {/* Score */}
        <View className={`${product.image ? "mt-4" : "mt-5"} items-center rounded-3xl bg-card p-6 dark:bg-darkSurface`}>
          <Text style={{ color: sc, fontSize: 56, fontWeight: "800" }}>{analysis.score}</Text>
          <Text className="mt-1 text-base font-semibold text-muted dark:text-darkMuted">Safety Score</Text>
        </View>

        {/* AI badge */}
        {aiResearched.length > 0 && (
          <View className="mt-4 flex-row items-start gap-3 rounded-2xl bg-periwinkle-soft p-4 dark:bg-darkSurfaceSoft">
            <Sparkles size={18} color={colors.navy} />
            <View className="flex-1">
              <Text className="font-bold text-navy dark:text-cloud">
                {aiResearched.length} ingredient{aiResearched.length > 1 ? "s" : ""} researched by AI
              </Text>
              <Text className="mt-1 text-xs text-muted dark:text-darkMuted">
                {aiResearched.join(", ")} — saved to database.
              </Text>
            </View>
          </View>
        )}

        {/* Warnings */}
        {analysis.warnings.length > 0 ? (
          <View className="mt-4 rounded-3xl bg-card p-5 dark:bg-darkSurface">
            <Text className="mb-3 text-lg font-bold text-navy dark:text-cloud">
              ⚠️ Warnings ({analysis.warnings.length})
            </Text>
            {analysis.warnings.map((w, i) => (
              <View
                key={i}
                className="mb-3 rounded-2xl p-4"
                style={{ backgroundColor: SEV[w.severity] + "22" }}
              >
                <View className="flex-row items-center gap-2">
                  <AlertTriangle size={16} color={SEV[w.severity]} />
                  <Text className="font-bold" style={{ color: SEV[w.severity] }}>{w.title}</Text>
                </View>
                <Text className="mt-1 text-sm text-navy dark:text-cloud">{w.message}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="mt-4 flex-row items-center gap-3 rounded-3xl bg-card p-5 dark:bg-darkSurface">
            <CheckCircle size={24} color={colors.success} />
            <Text className="font-bold text-navy dark:text-cloud">No conflicts detected ✓</Text>
          </View>
        )}

        {/* Ingredients */}
        <View className="mt-4 rounded-3xl bg-card p-5 dark:bg-darkSurface">
          <Text className="mb-2 text-base font-bold text-navy dark:text-cloud">
            Detected Ingredients ({analysis.detectedIngredients.length})
          </Text>
          <Text className="text-sm text-muted dark:text-darkMuted">
            {analysis.detectedIngredients.map((i) => i.name).join(", ")}
          </Text>
        </View>

        <Button className="mt-5" onPress={reset}>Scan Another Product</Button>
      </Screen>
    );
  }

  // ── Not found screen ──────────────────────────────────────
  if (state.status === "notFound") {
    return (
      <Screen>
        <Text className="text-3xl font-extrabold text-navy dark:text-cloud">Barcode Not Found</Text>
        <Text className="mt-2 text-sm text-muted dark:text-darkMuted">
          Barcode <Text className="font-bold">{state.barcode}</Text> is not in our database yet.
        </Text>
        <Text className="mt-4 text-sm text-muted dark:text-darkMuted">
          Switch to <Text className="font-bold">Ingredient Label</Text> mode and point your
          camera at the ingredient list — Gemini will read it automatically.
        </Text>
        <Button
          className="mt-6"
          onPress={() => { setState({ status: "idle" }); setMode("ocr"); }}
        >
          📷 Scan Ingredient Label Instead
        </Button>
        <Button variant="outline" className="mt-3" onPress={reset}>Try Barcode Again</Button>
      </Screen>
    );
  }

  // ── Camera view ───────────────────────────────────────────
  const needsPermission = !permission?.granted;

  return (
    <Screen scroll={false}>
      <View className="flex-1 pb-24">

        {/* Dark camera section */}
        <View className="-mx-6 -mt-4 flex-1 bg-navy px-6 pb-5 pt-8">

          {/* Header */}
          <Text className="text-3xl font-extrabold text-cloud">Product Scanner</Text>
          <Text className="mt-1 text-sm text-cloud/70">
            {mode === "barcode"
              ? "Point at a barcode — detected automatically"
              : "Point at the ingredient list — AI reads it for you"}
          </Text>

          {/* Mode toggle */}
          <View className="mt-4 flex-row gap-2">
            <TouchableOpacity
              onPress={() => setMode("barcode")}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3 ${
                mode === "barcode" ? "bg-maroon" : "bg-cloud/10"
              }`}
            >
              <ScanLine size={16} color={colors.cloud} />
              <Text className="text-sm font-bold text-cloud">Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode("ocr")}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3 ${
                mode === "ocr" ? "bg-maroon" : "bg-cloud/10"
              }`}
            >
              <ScanText size={16} color={colors.cloud} />
              <Text className="text-sm font-bold text-cloud">Ingredient Label</Text>
            </TouchableOpacity>
          </View>

          {/* Camera frame */}
          <View className="mt-5 flex-1 justify-center">
            <View style={styles.frame} className="w-full self-center overflow-hidden rounded-3xl border border-cloud/20 bg-black">

              {/* Loading overlay */}
              {(isLoading || isCapturing) && (
                <View style={StyleSheet.absoluteFillObject}
                  className="z-10 items-center justify-center gap-4 bg-navy/90 px-8">
                  <ActivityIndicator color={colors.cloud} size="large" />
                  <Text className="text-center text-sm font-semibold text-cloud">
                    {isCapturing ? "Capturing..." : (state as { progress: string }).progress}
                  </Text>
                </View>
              )}

              {needsPermission ? (
                <View className="flex-1 items-center justify-center px-6">
                  <View className="h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-cloud/40">
                    <Camera size={48} color={colors.cloud} />
                  </View>
                  <Text className="mt-5 text-center text-sm font-semibold text-cloud/80">
                    Camera access is needed to scan products.
                  </Text>
                </View>
              ) : (
                <>
                  {capturedPhotoUri ? (
                    <Image
                      source={{ uri: capturedPhotoUri }}
                      style={styles.cameraPreview}
                      resizeMode="cover"
                    />
                  ) : (
                    <CameraView
                      ref={cameraRef}
                      style={styles.camera}
                      facing="back"
                      barcodeScannerSettings={
                        mode === "barcode"
                          ? { barcodeTypes: BARCODE_TYPES }
                          : undefined
                      }
                      onBarcodeScanned={mode === "barcode" && isIdle ? handleBarcode : undefined}
                    />
                  )}

                  {/* Viewfinder overlay */}
                  <View style={StyleSheet.absoluteFillObject}
                    className="items-center justify-center">
                    {mode === "barcode" ? (
                      // Barcode: thin horizontal frame
                      <View style={styles.barcodeBox}
                        className="items-center justify-center rounded-2xl border-2 border-cloud">
                        <ScanLine size={40} color={colors.cloud} />
                      </View>
                    ) : (
                      // OCR: taller frame for label area
                      <View style={styles.ocrBox}
                        className="items-center justify-end rounded-3xl border-2 border-maroon pb-4">
                        {capturedPhotoUri && (
                          <View className="absolute left-3 right-3 top-3 rounded-xl bg-maroon/80 px-3 py-2">
                            <Text className="text-center text-xs font-bold text-cloud">
                              Text block captured
                            </Text>
                          </View>
                        )}
                        <View className="rounded-xl bg-navy/60 px-3 py-1">
                          <Text className="text-xs font-bold text-cloud">
                            {capturedPhotoUri ? "Review the cropped text block" : "Fit the ingredient list inside"}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </>
              )}

              {/* Error banner inside frame */}
              {state.status === "error" && (
                <View className="absolute bottom-4 left-4 right-4 rounded-2xl bg-red-900/80 px-4 py-3">
                  <Text className="text-center text-xs font-semibold text-cloud">
                    {state.message}
                  </Text>
                  <TouchableOpacity onPress={reset} className="mt-2 items-center">
                    <Text className="text-xs font-bold text-peach">Tap to try again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Bottom buttons */}
        <View className="mt-4 gap-3">
          {needsPermission ? (
            <Button onPress={requestPermission}>Enable Camera</Button>
          ) : mode === "barcode" ? (
            <View className="items-center rounded-2xl bg-card px-4 py-3 dark:bg-darkSurface">
              <View className="flex-row items-center gap-2">
                <Zap size={14} color={colors.muted} />
                <Text className="text-xs text-muted dark:text-darkMuted">
                  Barcode detected automatically — no button needed
                </Text>
              </View>
            </View>
          ) : (
            <Button
              onPress={handlePromptForProductName}
              disabled={isLoading || isCapturing}
            >
              {isCapturing ? "Capturing..." : "📷 Capture Ingredient Label"}
            </Button>
          )}

          {/* Switch mode hint */}
          {!needsPermission && (
            <TouchableOpacity
              onPress={() => setMode(mode === "barcode" ? "ocr" : "barcode")}
              className="flex-row items-center justify-center gap-2 py-2"
            >
              <FlipHorizontal size={14} color={colors.muted} />
              <Text className="text-xs text-muted dark:text-darkMuted">
                Switch to {mode === "barcode" ? "Ingredient Label" : "Barcode"} mode
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Modal
          visible={isNameModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setIsNameModalVisible(false);
            setCapturedPhotoUri(null);
            setCapturedOcrPhotoUri(null);
          }}
        >
          <View className="flex-1 justify-end bg-black/45 px-6 pb-8">
            <View className="rounded-3xl bg-card p-5 dark:bg-darkSurface">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-extrabold text-navy dark:text-cloud">Product name</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => {
                    setIsNameModalVisible(false);
                    setCapturedPhotoUri(null);
                    setCapturedOcrPhotoUri(null);
                  }}
                  className="h-9 w-9 items-center justify-center rounded-full bg-periwinkle-soft dark:bg-darkSurfaceSoft"
                >
                  <X size={18} color={colors.muted} />
                </TouchableOpacity>
              </View>
              <Text className="mt-2 text-sm text-muted dark:text-darkMuted">
                The text block is frozen. Enter the product name to start reading the ingredient label.
              </Text>
              <TextInput
                value={productNameDraft}
                onChangeText={setProductNameDraft}
                placeholder="Example: Skintific 5X Ceramide Moisturizer"
                placeholderTextColor={colors.muted}
                autoCapitalize="words"
                className="mt-4 rounded-2xl border border-border bg-cloud px-4 py-3 text-base font-semibold text-navy dark:border-darkBorder dark:bg-darkSurfaceSoft dark:text-cloud"
              />
              <Button className="mt-4" onPress={handleSubmitProductName} disabled={!productNameDraft.trim()}>
                Continue Scan
              </Button>
            </View>
          </View>
        </Modal>

      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  frame: { aspectRatio: 3 / 4 },
  camera: {
    position: "absolute",
    top: 0, bottom: 0,
    left: "-18%",
    width: "136%",
    height: "100%",
  },
  cameraPreview: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  barcodeBox: {
    width: "75%",
    height: 100,
  },
  ocrBox: {
    width: "90%",
    height: "65%",
  },
});
