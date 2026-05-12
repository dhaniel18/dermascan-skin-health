import { CameraView, type BarcodeScanningResult, type BarcodeType, useCameraPermissions } from "expo-camera";
import { Camera, ScanLine } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";

const BARCODE_TYPES: BarcodeType[] = ["ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "code93", "qr"];

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const isCheckingPermission = permission === null;
  const hasCameraPermission = permission?.granted;
  const cameraStatusText = scannedCode ? `Barcode detected: ${scannedCode}` : "Position the barcode inside the frame";

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    setScannedCode(data);
  };

  const handleScanPress = async () => {
    setCameraError(null);

    if (hasCameraPermission) {
      setScannedCode(null);
      return;
    }

    await requestPermission();
  };

  return (
    <Screen scroll={false}>
      <View className="flex-1 pb-24">
        <View className="-mx-6 -mt-4 flex-1 bg-navy px-6 pb-5 pt-8">
          <Text className="text-3xl font-extrabold text-cloud">Product Scanner</Text>
          <Text className="mt-2 text-base text-cloud/80">Scan a label or upload a photo to check ingredient compatibility.</Text>

          <View className="mt-6 flex-1 justify-center">
            <View className="w-full max-w-md self-center overflow-hidden rounded-3xl border border-cloud/20 bg-cloud/10" style={styles.cameraFrame}>
              {isCheckingPermission ? (
                <View className="flex-1 items-center justify-center px-6">
                  <ActivityIndicator color={colors.cloud} />
                  <Text className="mt-5 text-center text-sm font-semibold text-cloud/80">Checking camera permission...</Text>
                </View>
              ) : hasCameraPermission ? (
                <>
                  <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
                    onBarcodeScanned={scannedCode ? undefined : handleBarcodeScanned}
                    onMountError={({ message }) => setCameraError(message)}
                  />
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="h-40 w-40 items-center justify-center rounded-3xl border-2 border-cloud">
                      <ScanLine size={44} color={colors.cloud} />
                    </View>
                  </View>
                  <View className="absolute bottom-4 left-4 right-4 rounded-2xl bg-navy/70 px-4 py-3">
                    <Text className="text-center text-sm font-semibold text-cloud">{cameraStatusText}</Text>
                  </View>
                </>
              ) : (
                <View className="flex-1 items-center justify-center px-6">
                  <View className="h-36 w-36 items-center justify-center rounded-full border-2 border-dashed border-cloud/50">
                    <Camera size={52} color={colors.cloud} />
                  </View>
                  <Text className="mt-5 text-center text-sm font-semibold text-cloud/80">
                    Camera access is needed to scan product barcodes.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {cameraError ? <Text className="mt-3 text-center text-sm font-semibold text-cloud/80">{cameraError}</Text> : null}
        </View>

        <View className="mt-4 gap-3">
          <Button onPress={handleScanPress} disabled={isCheckingPermission}>
            {hasCameraPermission ? (scannedCode ? "Scan Again" : "Camera Active") : "Enable Camera"}
          </Button>
          <Button variant="outline">Upload Photo</Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraFrame: {
    aspectRatio: 1,
  },
  camera: {
    bottom: 0,
    height: "100%",
    left: "-18%",
    position: "absolute",
    top: 0,
    width: "136%",
  },
});
