import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import SyndicDiscardCard from "@/components/syndicDiscardCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ColetaItem {
    id_item: string;
    nome_item: string;
    descricao?: string;
    tipo_material: string;
    status: 'pendente' | 'validado' | 'coletado' | 'recusado';
    nome_morador: string;
    unidade_morador: string;
    criado_em?: string;
}

type AbaType = "todos" | "pendente" | "coletado" | "recusado";

export default function Sindico() {
    const { signOut } = useAuth();
    const router = useRouter();

    const [allColetas, setAllColetas] = useState<ColetaItem[]>([]);
    const [filteredColetas, setFilteredColetas] = useState<ColetaItem[]>([]);
    const [abaSelecionada, setAbaSelecionada] = useState<AbaType>("todos");
    const [loading, setLoading] = useState(true);

    const abas: { key: AbaType; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "pendente", label: "Pendente" },
    { key: "coletado", label: "Coletado" }, // Mudou aqui!
    { key: "recusado", label: "Recusado" },
];

    // 📡 Busca as coletas/descartes no back-end (GET)
    async function fetchPendentes() {
    try {
        setLoading(true);
        const token = await AsyncStorage.getItem('@TokenFlow:token');
        
        // 🌟 CORREÇÃO AQUI: Mudado de 'itens' para 'admin' para bater com o index.js da API
        const response = await fetch("https://api-c5avejvdoq-uc.a.run.app/api/admin/pendentes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            setAllColetas(data);
        } else {
            console.error("❌ [Síndico] Erro ao buscar coletas pendentes:", data);
        }
    } catch (error) {
        console.error("🚨 [Síndico] Falha crítica de conexão de rede:", error);
    } finally {
        setLoading(false);
    }
}

    // ⚡ Altera o status da coleta em tempo real via PATCH
    async function handleUpdateStatus(itemId: string, novoStatus: 'coletado' | 'pendente' | 'recusado') {
        try {
            const token = await AsyncStorage.getItem('@TokenFlow:token');
            
            // 🌟 CORREÇÕES CRÍTICAS AQUI: 
            // 1. Mudado o prefixo de 'itens' para 'admin' para sincronizar com as rotas do backend.
            // 2. Mudado o método de 'PATCH' para 'PUT' para bater com o padrão do Express.
            const response = await fetch(`https://api-c5avejvdoq-uc.a.run.app/api/admin/validar/${itemId}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: novoStatus })
            });

            // Captura o texto bruto antes de tentar dar o parse para evitar o crash de HTML
            const responseText = await response.text();

            if (response.ok) {
                // Se a resposta for um JSON válido de sucesso
                const data = JSON.parse(responseText);
                Alert.alert("Sucesso", `O status do descarte foi alterado para: ${novoStatus}.`);
                fetchPendentes(); // Recarrega a lista sincronizada com o banco
            } else {
                // Interceptador caso o servidor devolva uma página HTML de erro
                console.log("==================================================");
                console.log(`❌ [BACKEND ERRO] Status Code: ${response.status}`);
                if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
                    console.log("🚨 O Servidor quebrou ou a rota não existe e retornou HTML!");
                    console.log("🔍 Prévia do erro do servidor:\n", responseText.substring(0, 300));
                    Alert.alert("Erro no Servidor", `O servidor respondeu com erro técnico (${response.status}).`);
                } else {
                    const errData = JSON.parse(responseText);
                    console.log("📌 Dados do erro:", errData);
                    Alert.alert("Erro", errData.error || "Não foi possível atualizar o status.");
                }
                console.log("==================================================");
            }
        } catch (error: any) {
            console.error("🚨 Falha de rede ao atualizar status da coleta:", error);
            Alert.alert("Erro de Conexão", "Não foi possível se comunicar com o servidor.");
        }
    }

    // Gatilho inicial do ciclo de vida
    useEffect(() => {
        fetchPendentes();
    }, []);

    // Filtragem local reativa com tratamento defensivo de strings minúsculas
    useEffect(() => {
    setFilteredColetas(
        allColetas.filter((item) => {
            const statusFormatado = item.status?.toLowerCase();
            if (abaSelecionada === "todos") return true;
            if (abaSelecionada === "pendente") return statusFormatado === "pendente";
            if (abaSelecionada === "coletado") return statusFormatado === "coletado"; // Mudou aqui!
            if (abaSelecionada === "recusado") return statusFormatado === "recusado"; // Mudou aqui!
            return true;
            })
        );
    }, [abaSelecionada, allColetas]);

    // Contador em tempo real dinâmico para o card superior verde
    const pendingCount = allColetas.filter(item => item.status?.toLowerCase() === 'pendente').length;

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
                    <TouchableOpacity onPress={handleLogout} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View>
                        <Text style={styles.headerName}>Gestão de Moradores</Text>
                    </View>
                </View>

                <View style={styles.pendentesCard}>
                    <View>
                        <Text style={styles.pendentesLabel}>Cadastros pendentes</Text>
                        <Text style={styles.pendentesCount}>{pendingCount}</Text>
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
                                abaSelecionada === aba.key && styles.abaButtonActive && styles.abaTextActive,
                            ]}
                        >
                            {aba.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.listaContainer}>
                {loading ? (
                    <View style={{ marginTop: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#00A63E" />
                        <Text style={{ marginTop: 10, color: '#6B7280' }}>Carregando dados do servidor...</Text>
                    </View>
                ) : filteredColetas.length > 0 ? (
                    filteredColetas.map((item) => (
                        <SyndicDiscardCard
                            key={item.id_item}
                            nomeMorador={`${item.nome_morador} • (${item.nome_item})`}
                            unit={item.unidade_morador}
                            date={item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : "Sem data"}
                            status={item.status === 'recusado' ? 'Recusado' : item.status === 'coletado' || item.status === 'validado' ? 'Aprovado' : 'Pendente'}
                            onApprove={() => handleUpdateStatus(item.id_item, 'coletado')}
                            onReject={() => handleUpdateStatus(item.id_item, 'recusado')}
                            onDetails={() => console.log("Detalhes:", item.id_item)}
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