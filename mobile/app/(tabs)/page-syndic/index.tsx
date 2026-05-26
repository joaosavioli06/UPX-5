import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import SyndicDiscardCard from "@/components/syndicDiscardCard";

// Mock temporário — substituir por dados reais futuramente
const MOCK_PENDENTES = 1;
const MOCK_DESCARTES: DiscardItem[] = [
    {
        id: 1,
        nomeMorador: "Maria Santos",
        unit: "Bloco B - Apto 202",
        date: "19/04/2026",
        status: "Pendente",
    },
    {
        id: 2,
        nomeMorador: "João da Silva",
        unit: "Bloco A - Apto 101",
        date: "18/04/2026",
        status: "Aprovado",
    },
    {
        id: 3,
        nomeMorador: "Carlos Oliveira",
        unit: "Bloco C - Apto 305",
        date: "17/04/2026",
        status: "Recusado",
    },
];

type AbaType = "todos" | "pendentes" | "aprovados" | "recusados";

type StatusType = "Pendente" | "Aprovado" | "Recusado";

interface DiscardItem {
    id: number;
    nomeMorador: string;
    unit: string;
    date: string;
    status: StatusType;
}

export default function Sindico() {
    const { signOut } = useAuth();

    const router = useRouter();
    const [abaSelecionada, setAbaSelecionada] = useState<AbaType>("todos");

    const abas: { key: AbaType; label: string }[] = [
        { key: "todos", label: "Todos" },
        { key: "pendentes", label: "Pendentes" },
        { key: "aprovados", label: "Aprovados" },
        { key: "recusados", label: "Recusados" },
    ];

    const descartesFiltrados = MOCK_DESCARTES.filter((item) => {
        if (abaSelecionada === "todos") {
            return true;
        }

        if (abaSelecionada === "pendentes") {
            return item.status === "Pendente";
        }

        if (abaSelecionada === "aprovados") {
            return item.status === "Aprovado";
        }

        if (abaSelecionada === "recusados") {
            return item.status === "Recusado";
        }
    })

    async function handleLogout() {
        await signOut();
        router.replace('/(auth)/login');
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View>
                        <Text style={styles.headerName}>Gestão de Moradores</Text>
                    </View>
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
                {descartesFiltrados.length > 0 ? (
                    descartesFiltrados.map((item) => (
                        <SyndicDiscardCard
                            key={item.id}
                            nomeMorador={item.nomeMorador}
                            unit={item.unit}
                            date={item.date}
                            status={item.status}
                            onApprove={() => console.log("Aprovado")}
                            onReject={() => console.log("Recusado")}
                            onDetails={() => console.log("Detalhes")}
                        />
                    ))
                ) : (
                    <Text style={styles.listaPlaceholder}>
                        Nenhum registro encontrado.
                    </Text>
                )}
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
        alignItems: "center",
        justifyContent: "center",
    },
    headerLabel: {
        color: "#DCFCE7",
        fontSize: 14,
        marginBottom: 4,
    },
    headerName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 10,
        textAlign: "center",
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
    backButton: {
        position: "absolute",
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});