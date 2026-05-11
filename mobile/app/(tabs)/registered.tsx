import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useDiscard } from "@/contexts/DiscardContext";

export default function Confirm() {
    const { data } = useDiscard();

    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.check}>✓</Text>
                </View>

                <Text style={styles.title}>Item registrado!</Text>
                <Text style={styles.subtitle}>
                    O descarte foi registrado com sucesso.
                    Em breve será processado pela equipe.
                </Text>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Detalhes do item</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Nome:</Text>
                        <Text style={styles.value}>
                            {data.itemName || '-'}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Categoria:</Text>
                        <Text style={styles.value}>
                            {data.category || '-'}
                        </Text>
                    </View>

                    <View style={styles.observationContainer}>
                        <Text style={styles.label}>Observaçōes:</Text>
                        <Text style={styles.observationText}>
                            {data.observations || '-'}
                        </Text>
                    </View>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.primaryButton}>
                        <Text style={styles.primaryText}>Ver meus descartes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.link}>Voltar ao início</Text>
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
        marginTop: '30%',
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
    observationContainer: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    observationText: {
        marginTop: 4,
        fontSize: 14,
        color: '#111827',
        lineHeight: 22,
    },
});