import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function CameraIA() {
    const [permission, requestPermission] = useCameraPermissions();

    const router = useRouter();

    if (!permission?.granted) {
        return (
            <View style={styles.permissionContainer}>

                <Text style={styles.permissionText}>
                    Precisamos da permissão da câmera
                </Text>

                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                >
                    <Text style={styles.permissionButtonText}>
                        Permitir câmera
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.backArrow}>←</Text>
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Câmeria + IA</Text>
                            <View style={styles.side} />
                        </View>

                        <Text style={styles.title}>Aponte para o item</Text>
                        <Text style={styles.subTitle}>A IA identificará automaticamente o objeto</Text>

                        <View style={styles.cameraContainer}>
                            <CameraView
                                style={styles.camera}
                                facing="back"
                            />

                            <View style={styles.overlay}>
                                <Ionicons
                                    name="camera-outline"
                                    size={70}
                                    color="#9CA3AF"
                                />

                                <Text style={styles.cameraText}>
                                    Toque para escanear
                                </Text>
                            </View>

                        </View>

                        <TouchableOpacity
                            onPress={() => router.push('/manual')}
                            style={styles.manualButton}>
                            <Text style={styles.manualText}>
                                Preencher manualmente
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
        marginBottom: 16,
    },
    side: {
        width: 40,
        alignItems: 'center',
    },
    backArrow: {
        fontSize: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'center',
    },
    title: {
        color: '#101828',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 14,
        marginTop: 24,
    },
    subTitle: {
        fontSize: 16,
        color: '#4A5565',
    },
    cameraContainer: {
        height: 320,
        borderRadius: 20,
        overflow: 'hidden',
        marginTop: "15%",
        backgroundColor: '#020817',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    cameraText: {
        color: '#D1D5DB',
        marginTop: 12,
        fontSize: 14,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionText: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 16,
    },
    permissionButton: {
        backgroundColor: '#00A63E',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    permissionButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    manualButton: {
        marginTop: 36,
        alignItems: 'center',
        marginBottom: 30,
    },
    manualText: {
        fontSize: 14,
        color: '#6A7282',
        fontWeight: 'medium',
    },
})