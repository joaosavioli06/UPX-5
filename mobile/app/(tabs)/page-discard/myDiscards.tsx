import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DiscardCard from "@/components/discardCard";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DiscardItem {
    id: string;
    nome_item?: string;
    descricao?: string;
    tipo_material?: string;
    status?: string;
    criado_em?: any;
    dateString?: string;
}

export default function MyDiscards() {
    const router = useRouter();
    const { user } = useAuth();
    
    const [allDiscards, setAllDiscards] = useState<DiscardItem[]>([]); 
    const [filteredDiscards, setFilteredDiscards] = useState<DiscardItem[]>([]); 
    const [activeFilter, setActiveFilter] = useState<'todos' | 'pendente' | 'coletado'>('todos');
    const [loading, setLoading] = useState(true);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null); // Controla qual item está selecionado para exclusão

    // Busca os descartes do usuário no back-end (GET)
    async function fetchMyDiscards() {
        console.log("\n🔍 [Meus Descartes] Iniciando carregamento do histórico...");
        console.log("👤 [Context Auth] Estado atual do objeto user:", JSON.stringify(user, null, 2));

        if (!user?.uid) {
            console.warn("⚠️ [Meus Descartes] Bloqueado: user.uid está indefinido ou nulo! Desligando o loading.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('@TokenFlow:token'); 
            console.log(`🎫 [Storage] Token recuperado para listagem: ${token ? "Encontrado" : "NULO/VAZIO"}`);

            if (!token) {
            console.warn("⚠️ [Meus Descartes] Erro: Token não encontrado no Storage. Cancelando requisição.");
            setLoading(false);
            return;
            }

            const response = await fetch("https://api-c5avejvdoq-uc.a.run.app/api/itens/meus-itens", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                }
            });

            console.log(`📡 [API Response] Status recebido da listagem: ${response.status}`);
            const data = await response.json();

            if (response.ok) {
                console.log(`✅ [API Success] Quantidade de itens retornados: ${data.length}`);
                const formattedData = data.map((item: any) => {
                    let dateStr = "Data indisponível";
                    if (item.criado_em) {
                        dateStr = new Date(item.criado_em).toLocaleDateString('pt-BR');
                    }
                    return {
                        id: item.id,
                        nome_item: item.nome_item,
                        descricao: item.descricao,
                        tipo_material: item.tipo_material,
                        status: item.status,
                        dateString: dateStr
                    };
                });

                setAllDiscards(formattedData);
            } else {
                console.error("❌ [API Error] Detalhes do erro da listagem:", data);
            }
        } catch (error) {
            console.error("🚨 [Meus Descartes] Falha crítica de conexão de rede:", error);
        } finally {
            setLoading(false);
        }
    }

    // Exclui o descarte selecionado no back-end (DELETE)
    async function handleDeleteItem() {
        if (!selectedItemId) {
            Alert.alert("Atenção", "Selecione um descarte da lista abaixo clicando nele antes de excluir.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem('@TokenFlow:token');
            
            const response = await fetch(`https://api-c5avejvdoq-uc.a.run.app/api/itens/deletar/${selectedItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert("Sucesso", "O cadastro do descarte foi removido do sistema.");
                setSelectedItemId(null); // Reseta a seleção
                fetchMyDiscards(); // Recarrega a listagem atualizada direto do banco
            } else {
                Alert.alert("Erro", result.error || "Não foi possível excluir o item.");
            }
        } catch (error) {
            console.error("Erro ao chamar endpoint de exclusão:", error);
            Alert.alert("Erro", "Erro ao conectar ao servidor.");
        }
    }

    // ==========================================
    // 1. FILTRAGEM LOCAL DOS CARDS DE STATUS
    // ==========================================
    useEffect(() => {
        if (activeFilter === 'todos') {
        setFilteredDiscards(allDiscards);
        } else {
        setFilteredDiscards(
            allDiscards.filter(item => item.status?.toLowerCase() === activeFilter)
        );
    }
        }, [activeFilter, allDiscards]);

    // ==========================================
    // 2. DISPARO INICIAL DE BUSCA DA API
    // ==========================================
    useEffect(() => {
    if (user?.uid) {
        fetchMyDiscards();
    } else {
        setAllDiscards([]);
        setFilteredDiscards([]);
        setLoading(false);
    }
}, [user]);

    // Cálculos automáticos do totalizador de cards
    const totalCount = allDiscards.length;
    const pendingCount = allDiscards.filter(item => item.status?.toLowerCase() === 'pendente').length;
    const collectedCount = allDiscards.filter(item => item.status?.toLowerCase() === 'coletado').length;

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
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24} color="#111827" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Meus Descartes</Text>
                    </View>

                    {}
                    <View style={styles.discardStatus}>
                        <TouchableOpacity 
                            style={[styles.totalDiscards, activeFilter === 'todos' && { borderWidth: 2, borderColor: '#6366F1' }]}
                            onPress={() => setActiveFilter('todos')}
                        >
                            <Text style={styles.totalText}>{totalCount}</Text>
                            <Text style={styles.totalLabel}>Total</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.pendingDiscards, activeFilter === 'pendente' && { borderWidth: 2, borderColor: '#F97316' }]}
                            onPress={() => setActiveFilter('pendente')}
                        >
                            <Text style={styles.pendingText}>{pendingCount}</Text>
                            <Text style={styles.pendingLabel}>Pendentes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.collectedDiscards, activeFilter === 'coletado' && { borderWidth: 2, borderColor: '#22C55E' }]}
                            onPress={() => setActiveFilter('coletado')}
                        >
                            <Text style={styles.collectedText}>{collectedCount}</Text>
                            <Text style={styles.collectedLabel}>Coletados</Text>
                        </TouchableOpacity>
                    </View>

                    {/* LISTA DINÂMICA COMPILADA */}
                    {loading ? (
                        <View style={{ marginTop: 40, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#6366F1" />
                            <Text style={{ marginTop: 10, color: '#6B7280' }}>Carregando histórico...</Text>
                        </View>
                    ) : filteredDiscards.length === 0 ? (
                        <Text style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 40 }}>
                            Nenhum descarte encontrado para esta categoria.
                        </Text>
                    ) : (
                        filteredDiscards.map((item) => (
                            <TouchableOpacity 
                                key={item.id} 
                                activeOpacity={0.8}
                                onPress={() => setSelectedItemId(item.id === selectedItemId ? null : item.id)} // Seleciona/deseleciona o item
                                style={[
                                    selectedItemId === item.id && { borderWidth: 2, borderColor: '#E7000B', borderRadius: 16 }
                                ]}
                            >
                                <DiscardCard
                                    title={item.nome_item || "Sem título"}
                                    description={item.descricao || "Sem observações."}
                                    category={item.tipo_material || "Outro"}
                                    date={item.dateString || ""}
                                    status={(item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Pendente") as "Pendente" | "Coletado"}
                                />
                            </TouchableOpacity>
                        ))
                    )}

                    {/* BOTÃO EXCLUIR - 🌟 Agora ativo e chamando a função handleDeleteItem */}
                    <TouchableOpacity 
                        style={[
                            styles.buttonDelete, 
                            !selectedItemId && { opacity: 0.5 } // Fica semi-transparente se nenhum item estiver selecionado
                        ]}
                        onPress={handleDeleteItem}
                    >
                        <Text style={styles.buttonText}>
                            {selectedItemId ? "Excluir item selecionado" : "Excluir cadastro"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

// Abaixo disso, mantenha o const styles exatamente como a Lívia montou!

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
        marginTop: 20,
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
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