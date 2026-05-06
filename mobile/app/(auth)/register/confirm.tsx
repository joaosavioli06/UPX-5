import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // Adicionado useLocalSearchParams

export default function Confirm() {
    const router = useRouter();
    // Captura os parâmetros que enviamos através do router.push no arquivo anterior
    const params = useLocalSearchParams(); 

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.check}>✓</Text>
                </View>

                <Text style={styles.title}>Cadastro realizado!</Text>
                <Text style={styles.subtitle}>
                    Seu cadastro foi enviado para aprovação do síndico.
                    Você receberá uma notificação quando for aprovado.
                </Text>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Resumo do cadastro</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={styles.status}>Aguardando aprovação</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Unidade:</Text>
                        <Text style={styles.value}>
                            {/* Agora exibe o que veio do Backend */}
                            {params.unit || '-'} 
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Tipo:</Text>
                        <Text style={styles.value}>
                            {/* Agora exibe o que veio do Backend[cite: 4, 11] */}
                            {params.type || '-'}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Veículo:</Text>
                        <Text style={styles.value}>
                            {/* Verifica o parâmetro enviado pelo servidor[cite: 4, 11] */}
                            {params.hasVehicle === 'true' ? 'Sim' : 'Não'}
                        </Text>
                    </View>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        onPress={() => router.push('/login')}
                        style={styles.primaryButton}>
                        <Text style={styles.primaryText}>Ir para o início</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        marginTop: '25%',
    },
    iconContainer: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    check: {
        fontSize: 40,
        color: '#16A34A',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#4A5565',
        textAlign: 'center',
        marginBottom: 28,
        paddingHorizontal: 10,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: '#F3F4F6',
        borderRadius: 14,
        padding: 18,
        marginBottom: 30,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        color: '#6B7280',
    },
    value: {
        fontWeight: '500',
    },
    status: {
        color: '#D97706',
        fontWeight: 'bold',
    },
    buttons: {
        width: '100%',
        gap: 14,
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#00A63E',
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
    },
    primaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 14,
        marginTop: 15,
    },
});