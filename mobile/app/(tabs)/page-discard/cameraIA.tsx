import {
    View, Text, TouchableOpacity, StyleSheet,
    ActivityIndicator, Alert
} from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { useDiscard } from "@/contexts/DiscardContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MATERIAL_INFO: Record<string, { cor: string; bg: string; icone: string }> = {
    plastico:         { cor: "#2563EB", bg: "#DBEAFE", icone: "water-outline" },
    metal:            { cor: "#D97706", bg: "#FEF3C7", icone: "construct-outline" },
    papel:            { cor: "#7C3AED", bg: "#EDE9FE", icone: "document-outline" },
    vidro:            { cor: "#0891B2", bg: "#CFFAFE", icone: "wine-outline" },
    eletronico:       { cor: "#DC2626", bg: "#FEE2E2", icone: "phone-portrait-outline" },
    organico:         { cor: "#16A34A", bg: "#DCFCE7", icone: "leaf-outline" },
    perigoso:         { cor: "#EA580C", bg: "#FFEDD5", icone: "warning-outline" },
    nao_identificado: { cor: "#6B7280", bg: "#F3F4F6", icone: "help-outline" },
};

export default function CameraIA() {
    const [permission, requestPermission] = useCameraPermissions();
    const [analisando, setAnalisando] = useState(false);
    const [resultado, setResultado] = useState<null | {
        tipo_material: string;
        confianca: number;
        mensagem: string;
    }>(null);

    const cameraRef = useRef<CameraView>(null);
    const { updateData } = useDiscard();
    const router = useRouter();

    if (!permission?.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Ionicons name="camera-outline" size={60} color="#9CA3AF" />
                <Text style={styles.permissionText}>Precisamos da permissão da câmera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Permitir câmera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    async function handleCapturar() {
        if (analisando || !cameraRef.current) return;

        setAnalisando(true);
        setResultado(null);

        try {
            // Foto em base64
            const foto = await cameraRef.current.takePictureAsync({
                base64: true,
                quality: 0.6
            });

            if (!foto?.base64) {
                Alert.alert("Erro", "Não foi possível capturar a imagem.");
                return;
            }

            // AsyncStorage
            const token = await AsyncStorage.getItem("@TokenFlow:token");
            if (!token) {
                Alert.alert("Sessão expirada", "Faça login novamente.");
                router.replace("/(auth)/login/access");
                return;
            }

            const response = await fetch("https://api-c5avejvdoq-uc.a.run.app/api/ia/analisar-imagem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ imagem_base64: foto.base64 })
            });

            const texto = await response.text();
            console.log("📡 Status:", response.status);
            console.log("📡 Resposta bruta:", texto.substring(0, 300));

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${texto.substring(0, 100)}`);
            }

            const json = JSON.parse(texto);
            setResultado(json.data);

        } catch (err: any) {
            Alert.alert("Erro na análise", err.message || "Tente novamente.");
        } finally {
            setAnalisando(false);
        }
    }

    function handleConfirmar() {
        if (!resultado) return;

        // Preenche o contexto com os dados da IA antes de abrir o formulário
        updateData({
            category: mapearCategoria(resultado.tipo_material),
            itemName: labelMaterial(resultado.tipo_material),
            observations: `Identificado pela IA com ${resultado.confianca}% de confiança.`
        });

        router.push("/page-discard/manual");
    }

    function handleTentarNovamente() {
        setResultado(null);
    }

    const info = MATERIAL_INFO[resultado?.tipo_material ?? "nao_identificado"] ?? MATERIAL_INFO["nao_identificado"];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Câmera + IA</Text>
            </View>

            <Text style={styles.title}>Aponte para o item</Text>
            <Text style={styles.subTitle}>A IA identificará automaticamente o material</Text>

            <View style={styles.cameraContainer}>
                <CameraView ref={cameraRef} style={styles.camera} facing="back" />

                {!resultado && (
                    <View style={styles.overlay}>
                        <View style={styles.scanFrame} />
                        {analisando && (
                            <View style={styles.loadingBox}>
                                <ActivityIndicator size="large" color="#00A63E" />
                                <Text style={styles.loadingText}>Analisando com IA...</Text>
                            </View>
                        )}
                    </View>
                )}

                {resultado && (
                    <View style={styles.resultOverlay}>
                        <View style={[styles.resultCard, { borderColor: info.cor }]}>
                            <View style={[styles.resultIcon, { backgroundColor: info.bg }]}>
                                <Ionicons name={info.icone as any} size={32} color={info.cor} />
                            </View>
                            <Text style={[styles.resultTipo, { color: info.cor }]}>
                                {labelMaterial(resultado.tipo_material)}
                            </Text>
                            <Text style={styles.resultConfianca}>
                                {resultado.confianca}% de confiança
                            </Text>
                            <Text style={styles.resultMensagem}>{resultado.mensagem}</Text>
                        </View>
                    </View>
                )}
            </View>

            {!resultado ? (
                <TouchableOpacity
                    style={[styles.captureButton, analisando && { opacity: 0.6 }]}
                    onPress={handleCapturar}
                    disabled={analisando}
                >
                    <Ionicons name="camera" size={28} color="#fff" />
                    <Text style={styles.captureText}>
                        {analisando ? "Analisando..." : "Capturar e analisar"}
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.retryButton} onPress={handleTentarNovamente}>
                        <Ionicons name="refresh-outline" size={20} color="#374151" />
                        <Text style={styles.retryText}>Tentar novamente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmar}>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                        <Text style={styles.confirmText}>Confirmar e registrar</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                onPress={() => router.push("/page-discard/manual")}
                style={styles.manualButton}
            >
                <Text style={styles.manualText}>Preencher manualmente</Text>
            </TouchableOpacity>
        </View>
    );
}

function mapearCategoria(tipo: string): string {
    const map: Record<string, string> = {
        plastico:   "Outro",
        metal:      "Outro",
        papel:      "Outro",
        vidro:      "Outro",
        eletronico: "Eletrônico",
        organico:   "Outro",
        perigoso:   "Outro",
    };
    return map[tipo] ?? "Outro";
}

function labelMaterial(tipo: string): string {
    const labels: Record<string, string> = {
        plastico:         "Plástico",
        metal:            "Metal / Alumínio",
        papel:            "Papel / Papelão",
        vidro:            "Vidro",
        eletronico:       "Lixo Eletrônico",
        organico:         "Orgânico",
        perigoso:         "Resíduo Perigoso",
        nao_identificado: "Não Identificado",
    };
    return labels[tipo] ?? tipo;
}

const styles = StyleSheet.create({
    container:           { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
    header:              { flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 10, marginBottom: 16, marginTop: 20 },
    backButton:          { justifyContent: "center", alignItems: "center" },
    headerTitle:         { fontSize: 18, fontWeight: "bold" },
    title:               { fontSize: 24, fontWeight: "bold", marginBottom: 6, color: "#101828" },
    subTitle:            { fontSize: 15, color: "#4A5565", marginBottom: 16 },
    cameraContainer:     { height: 340, borderRadius: 20, overflow: "hidden", backgroundColor: "#020817" },
    camera:              { flex: 1 },
    overlay:             { position: "absolute", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.25)" },
    scanFrame:           { width: 200, height: 200, borderWidth: 2, borderColor: "#00A63E", borderRadius: 16, borderStyle: "dashed" },
    loadingBox:          { position: "absolute", bottom: 20, alignItems: "center", gap: 8, backgroundColor: "rgba(0,0,0,0.6)", padding: 16, borderRadius: 14 },
    loadingText:         { color: "#fff", fontSize: 14 },
    resultOverlay:       { position: "absolute", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", padding: 16 },
    resultCard:          { backgroundColor: "#fff", borderRadius: 20, padding: 20, alignItems: "center", width: "90%", borderWidth: 2 },
    resultIcon:          { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", marginBottom: 10 },
    resultTipo:          { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
    resultConfianca:     { fontSize: 14, color: "#6B7280", marginBottom: 8 },
    resultMensagem:      { fontSize: 13, color: "#374151", textAlign: "center" },
    captureButton:       { flexDirection: "row", backgroundColor: "#00A63E", padding: 16, borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 10, marginTop: 20 },
    captureText:         { color: "#fff", fontSize: 16, fontWeight: "bold" },
    actionButtons:       { flexDirection: "row", gap: 10, marginTop: 20 },
    retryButton:         { flex: 1, flexDirection: "row", gap: 6, backgroundColor: "#F3F4F6", padding: 14, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    retryText:           { color: "#374151", fontWeight: "600" },
    confirmButton:       { flex: 1, flexDirection: "row", gap: 6, backgroundColor: "#00A63E", padding: 14, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    confirmText:         { color: "#fff", fontWeight: "bold" },
    manualButton:        { marginTop: 20, alignItems: "center" },
    manualText:          { fontSize: 14, color: "#6A7282" },
    permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16, padding: 20 },
    permissionText:      { fontSize: 16, color: "#374151", textAlign: "center" },
    permissionButton:    { backgroundColor: "#00A63E", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
    permissionButtonText:{ color: "#fff", fontWeight: "600", fontSize: 16 },
});
