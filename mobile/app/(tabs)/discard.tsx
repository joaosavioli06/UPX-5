import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Discard() {
    const router = useRouter();

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.backArrow}>←</Text>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Descarte</Text>
                        <View style={styles.side} />
                    </View>

                    <Text style={styles.title}>Como você quer identicar o item?</Text>
                    <Text style={styles.subTitle}>Escolha o método de registro do item descartado</Text>

                    <View style={styles.cards}>
                        <TouchableOpacity style={styles.discardCard}>
                            <View style={styles.boxGreen}>
                                <Ionicons
                                    name="camera-outline"
                                    size={35}
                                    color="#16A34A"
                                />
                            </View>

                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>
                                    Câmera + IA
                                </Text>

                                <Text style={styles.cardSubTitle}>
                                    Identificação automática com inteligência artificial
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.discardCard}>
                            <View style={styles.boxBlue}>
                                <Ionicons
                                    name="qr-code-outline"
                                    size={35}
                                    color="#2563EB"
                                />
                            </View>

                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>
                                    QR Code
                                </Text>

                                <Text style={styles.cardSubTitle}>
                                    Escanear código QR do item
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/manual')}
                            style={styles.discardCard}
                        >
                            <View style={styles.boxPurple}>
                                <Ionicons
                                    name="create-outline"
                                    size={35}
                                    color="#9333EA"
                                />
                            </View>

                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>
                                    Manual
                                </Text>

                                <Text style={styles.cardSubTitle}>
                                    Preencher informações manualmente
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.discardCard}>
                            <View style={styles.boxOrange}>
                                <Ionicons
                                    name="trash-outline"
                                    size={35}
                                    color={'#eab033'}
                                />
                            </View>

                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>
                                    Meus descartes
                                </Text>

                                <Text style={styles.cardSubTitle}>
                                    Visualize todos seus registros de descarte
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    content: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 18,
        marginBottom: 28,
    },
    side: {
        width: 40,
    },
    backArrow: {
        fontSize: 28,
        color: '#111827',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101828',
        // lineHeight: 46,
        marginBottom: 16,
    },
    subTitle: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 28,
        marginBottom: 40,
    },
    cards: {
        gap: 16,
    },
    discardCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 22,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    boxGreen: {
        width: 64,
        height: 64,
        borderRadius: 24,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    boxBlue: {
        width: 64,
        height: 64,
        borderRadius: 24,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    boxPurple: {
        width: 64,
        height: 64,
        borderRadius: 24,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    boxOrange: {
        width: 64,
        height: 64,
        borderRadius: 24,
        backgroundColor: '#fff8e8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    cardSubTitle: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 24,
    },
});