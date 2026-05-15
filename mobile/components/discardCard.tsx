import { View, Text, StyleSheet } from "react-native";

interface DiscardCardProps {
    title: string;
    description: string;
    category: string;
    date: string;
    status: 'Pendente' | 'Coletado';
}

// Componente de card de descarte
// Aplicar valores vindo do back, no momento todos os valores estão mockados/fixos
export default function DiscardCard({ title, description, category, date, status }: DiscardCardProps) {

    const isCollected = status === 'Coletado';

    return (
        <View style={styles.card}>

            <View style={styles.topRow}>

                <View style={styles.info}>
                    <Text style={styles.title}>
                        {title}
                    </Text>

                    <Text
                        style={styles.description}
                        numberOfLines={1}
                    >
                        {description}
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        isCollected
                            ? styles.collectedBadge
                            : styles.pendingBadge
                    ]}
                >
                    <View
                        style={[
                            styles.dot,
                            isCollected
                                ? styles.greenDot
                                : styles.orangeDot
                        ]}
                    />

                    <Text style={styles.statusText}>
                        {status}
                    </Text>

                </View>

            </View>

            <View style={styles.footer}>

                <Text style={styles.footerText}>
                    {category} • {date}
                </Text>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
    },
    description: {
        fontSize: 15,
        color: '#6B7280',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        gap: 6,
    },
    pendingBadge: {
        backgroundColor: '#FFF7ED',
    },
    collectedBadge: {
        backgroundColor: '#F0FDF4',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 999,
    },
    orangeDot: {
        backgroundColor: '#F97316',
    },
    greenDot: {
        backgroundColor: '#22C55E',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 16,
        paddingTop: 12,
    },
    footerText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
});