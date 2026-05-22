import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Mock temporário — substituir por dados reais futuramente
const MOCK_PENDENTES = 2;
const MOCK_NOME = "Carlos Silva";

type AbaType = "todos" | "pendentes" | "aprovados" | "recusados";

export default function Sindico() {
    const router = useRouter();
    const [abaSelecionada, setAbaSelecionada] = useState<AbaType>("todos");

    const abas: { key: AbaType; label: string }[] = [
        { key: "todos", label: "Todos" },
        { key: "pendentes", label: "Pendentes" },
        { key: "aprovados", label: "Aprovados" },
        { key: "recusados", label: "Recusados" },
    ];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerLabel}>Bem-vindo(a),</Text>
                        <Text style={styles.headerName}>{MOCK_NOME}</Text>
                    </View>

                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.pendentesCard}>
                    <View>
                        <Text style={styles.pendentesLabel}>Cadastros pendentes</Text>
                        <Text style={styles.pendentesCount}>{MOCK_PENDENTES}</Text>
                    </View>

                    <View style={styles.pendentesIconContainer}>
                        <Ionicons name="time-outline" size={22} color="#FFFFFF" />
                    </View>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.abasContainer}
                contentContainerStyle={styles.abasContent}
            >
                {abas.map((aba) => (
                    <TouchableOpacity
                        key={aba.key}
                        style={[
                            styles.abaButton,
                            abaSelecionada === aba.key && styles.abaButtonActive,
                        ]}
                        onPress={() => setAbaSelecionada(aba.key)}
                    >
                        <Text
                            style={[
                                styles.abaText,
                                abaSelecionada === aba.key && styles.abaTextActive,
                            ]}
                        >
                            {aba.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            
            <View style={styles.listaContainer}>
                <Text style={styles.listaPlaceholder}>
                    Nenhum registro encontrado.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        padding: 20,
    },
    content: {
        paddingBottom: 40,
    },
    header: {
        padding: 24,
        backgroundColor: "#00A63E",
        borderRadius: 16,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    headerLabel: {
        color: "#DCFCE7",
        fontSize: 14,
        marginBottom: 4,
    },
    headerName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 10,
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: "#009130",
        justifyContent: "center",
        alignItems: "center",
    },
    pendentesCard: {
        backgroundColor: "#0eb64c",
        padding: 16,
        borderRadius: 14,
        marginTop: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 2,
    },
    pendentesLabel: {
        fontSize: 14,
        color: "#DCFCE7",
        marginBottom: 8,
    },
    pendentesCount: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    pendentesIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#f59e0b",
        justifyContent: "center",
        alignItems: "center",
    },
    abasContainer: {
        marginTop: 24,
    },
    abasContent: {
        gap: 8,
        paddingRight: 4,
    },
    abaButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    abaButtonActive: {
        backgroundColor: "#00A63E",
        borderColor: "#00A63E",
    },
    abaText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    abaTextActive: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    listaContainer: {
        marginTop: 20,
    },
    listaPlaceholder: {
        textAlign: "center",
        color: "#9CA3AF",
        fontSize: 14,
        marginTop: 40,
    },
});