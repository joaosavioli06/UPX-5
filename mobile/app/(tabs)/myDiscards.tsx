import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DiscardCard from "@/components/discardCard";

export default function MyDiscards() {
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

                        <Text style={styles.headerTitle}>Meus Descarte</Text>
                        <View style={styles.side} />
                    </View>

                    <View style={styles.discardStatus}>
                        <View style={styles.totalDiscards}>
                            <Text style={styles.totalText}>3</Text> {/* Puxar quantidade do back */}
                            <Text style={styles.totalLabel}>Total</Text>
                        </View>

                        <View style={styles.pendingDiscards}>
                            <Text style={styles.pendingText}>2</Text> {/* Puxar quantidade do back */}
                            <Text style={styles.pendingLabel}>Pendentes</Text>
                        </View>

                        <View style={styles.collectedDiscards}>
                            <Text style={styles.collectedText}>1</Text> {/* Puxar quantidade do back */}
                            <Text style={styles.collectedLabel}>Coletados</Text>
                        </View>
                    </View>

                    {/* Foi criado um componente para estilização dos cards - VALORES MOCKADOS */}
                    <DiscardCard
                        title="Geladeira Brastemp Duplex"
                        description="Funcionando parcialmente, porta amassada..."
                        category="Eletrodoméstico"
                        date="10/05/2025"
                        status="Pendente"
                    />

                    <DiscardCard
                        title="Notebook Dell Inspiron"
                        description="Não liga mais. Bateria inclusa..."
                        category="Eletrônico"
                        date="08/05/2025"
                        status="Pendente"
                    />

                    <DiscardCard
                        title="Sofá de 3 lugares"
                        description="Em bom estado, apenas manchas leves..."
                        category="Móvel"
                        date="01/05/2025"
                        status="Coletado"
                    />

                    {/* Ainda não funcional, precisará de um endpoint próprio para exclusão */}
                    <TouchableOpacity style={styles.buttonDelete}>
                        <Text style={styles.buttonText}>Excluir cadastro</Text>
                    </TouchableOpacity>
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
    discardStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    totalDiscards: {
        flex: 1,
        backgroundColor: '#EEF2FF',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    pendingDiscards: {
        flex: 1,
        backgroundColor: '#FFF7ED',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    collectedDiscards: {
        flex: 1,
        backgroundColor: '#F0FDF4',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6366F1',
        marginBottom: 4,
    },
    pendingText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F97316',
        marginBottom: 4,
    },
    collectedText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#22C55E',
        marginBottom: 4,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#818CF8',
    },
    pendingLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FB923C',
    },
    collectedLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4ADE80',
    },
    buttonDelete: {
        backgroundColor: '#FEF2F2',
        padding: 15,
        borderRadius: 14,
        marginTop: "10%",
    },
    buttonText: {
        color: '#E7000B',
        textAlign: 'center',
        fontWeight: 'medium',
    },
});