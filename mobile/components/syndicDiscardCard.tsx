import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface SyndicDiscardCardProps {
    nomeMorador: string;
    unit: string;
    date: string;
    status: "Pendente" | "Aprovado" | "Recusado";
    onApprove?: () => void;
    onReject?: () => void;
    onDetails?: () => void;
}

export default function SyndicDiscardCard({ nomeMorador, unit, date, status, onApprove, onReject, onDetails }: SyndicDiscardCardProps) {
    const isPending = status === "Pendente";
    const isCollected = status === "Aprovado";
    const isRejected = status === "Recusado";

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={styles.info}>
                    <Text style={styles.title}>
                        {nomeMorador}
                    </Text>

                    <Text style={styles.description}>
                        {unit}
                    </Text>

                    <Text style={styles.date}>
                        Solicitado em {date}
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        isPending && styles.pendingBadge,
                        isCollected && styles.collectedBadge,
                        isRejected && styles.rejectedBadge
                    ]}
                >
                    <View
                        style={[
                            styles.dot,
                            isPending && styles.orangeDot,
                            isCollected && styles.greenDot,
                            isRejected && styles.redDot
                        ]}
                    />

                    <Text
                        style={[
                            styles.statusText,
                            isPending && styles.pendingText,
                            isCollected && styles.collectedText,
                            isRejected && styles.rejectedText
                        ]}>
                        {status}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {isPending || isRejected ? (
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.rejectButton]}
                        onPress={onReject}
                    >
                        <Text style={styles.rejectButtonText}>Recusar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.approveButton]}
                        onPress={onApprove}
                    >
                        <Text style={styles.approveButtonText}>Aprovar</Text>
                    </TouchableOpacity>
                </View>

            ) : (
                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={onDetails}
                >
                    <Text style={styles.detailsButtonText}>Ver detalhes</Text>
                </TouchableOpacity>
            )}
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
    date: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 999,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    pendingBadge: {
        backgroundColor: '#FEF3C7',
    },
    orangeDot: {
        backgroundColor: '#F59E0B',
    },
    pendingText: {
        color: '#B45309',
    },
    collectedBadge: {
        backgroundColor: '#DCFCE7',
    },
    greenDot: {
        backgroundColor: '#22C55E',
    },
    collectedText: {
        color: '#15803D',
    },
    rejectedBadge: {
        backgroundColor: '#FEE2E2',
    },
    redDot: {
        backgroundColor: '#EF4444',
    },
    rejectedText: {
        color: '#B91C1C',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginTop: 16,
        marginBottom: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    rejectButton: {
        backgroundColor: '#FEF2F2',
    },
    rejectButtonText: {
        color: '#DC2626',
        fontSize: 15,
        fontWeight: '600',
    },
    approveButton: {
        backgroundColor: '#16A34A',
    },
    approveButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    detailsButton: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    detailsButtonText: {
        color: '#4B5563',
        fontSize: 15,
        fontWeight: '600',
    },
});