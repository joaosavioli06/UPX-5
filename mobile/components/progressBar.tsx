import { View, Text, StyleSheet } from "react-native";

type Props = {
    step: number;
    total: number;
}

export default function ProgressBar({ step, total }: Props) {
    const percentage = Math.round((step / total) * 100);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.stepText}>
                    Etapa {step} de {total}
                </Text>

                <Text style={styles.percentText}>
                    {percentage}%
                </Text>
            </View>

            <View style={styles.barBackground}>
                <View
                    style={[
                        styles.barFill,
                        { width: `${percentage}%` }
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    stepText: {
        fontSize: 14,
        color: '#4A5565',
    },
    percentText: {
        fontSize: 14,
        color: '#00A63E',
    },
    barBackground: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
    },
    barFill: {
        height: 8,
        backgroundColor: '#00A63E',
        borderRadius: 10,
    },
});