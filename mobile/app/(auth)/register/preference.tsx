import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native"; // Adicionei Alert aqui
import { useState } from "react";
import ProgressBar from "@/components/progressBar";
import { useRouter } from "expo-router";
import { useRegister } from "@/contexts/RegisterContext"; // Importação correta[cite: 2]

export default function Preference() {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false); // Estado de carregamento adicionado

    const router = useRouter();
    const { data } = useRegister(); // Acesso aos dados do contexto[cite: 2]

    // Função para enviar os dados ao seu Backend no Firebase
async function handleFinalize() {
    setLoading(true);
    // 1. Criamos uma referência limpa para os dados do contexto
    const registerData = data as any;

    try {
        const response = await fetch('https://api-c5avejvdoq-uc.a.run.app/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                // 2. Campos principais que o Controller desestrutura primeiro
                nome: registerData.nome,
                email: registerData.email,
                password: registerData.password,
                tipo_perfil: registerData.tipo_perfil || 'morador',
                codigoAcesso: registerData.codigoAcesso || '',
                
                // 3. O objeto userData deve conter EXATAMENTE o que o Service usa
                userData: {
                    cpf: registerData.cpf,
                    telefone: registerData.telefone,
                    unit: registerData.unit,        // Vem do unit.tsx
                    type: registerData.type,        // Vem do unit.tsx
                    hasVehicle: registerData.hasVehicle,
                    plate: registerData.plate,
                    model: registerData.model,
                    color: registerData.color,
                    preferencias: selectedOptions   // Opções marcadas nesta tela
                }
            }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro no servidor');
        }

        const result = await response.json();

        // 4. Navega para a confirmação passando os dados para exibir no resumo
        router.push({
            pathname: '/register/confirm',
            params: { 
                nome: registerData.nome,
                unit: registerData.unit 
            }
        });

    } catch (error: any) {
        Alert.alert("Erro no Cadastro", error.message);
    } finally {
        setLoading(false);
    }
}

    function toggleOption(option: string) {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.backArrow}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Cadastro</Text>
                        <View style={styles.side} />
                    </View>

                    <ProgressBar step={4} total={4} />

                    <Text style={styles.title}>Preferências</Text>
                    <Text style={styles.subTitle}>
                        Como você prefere receber informações?
                    </Text>

                    {/* Checkboxes de Preferências */}
                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleOption('whatsapp')}>
                        <View style={[styles.checkbox, selectedOptions.includes('whatsapp') && styles.checkboxSelected]}>
                            {selectedOptions.includes('whatsapp') && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>Receber avisos por WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleOption('email')}>
                        <View style={[styles.checkbox, selectedOptions.includes('email') && styles.checkboxSelected]}>
                            {selectedOptions.includes('email') && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>Receber avisos por e-mail</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleOption('condominio')}>
                        <View style={[styles.checkbox, selectedOptions.includes('condominio') && styles.checkboxSelected]}>
                            {selectedOptions.includes('condominio') && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>Newsletter do condomínio</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleOption('eventos')}>
                        <View style={[styles.checkbox, selectedOptions.includes('eventos') && styles.checkboxSelected]}>
                            {selectedOptions.includes('eventos') && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>Notificações de eventos</Text>
                    </TouchableOpacity>

                    <Text style={styles.obsTitle}>Observações (opcional)</Text>
                    <TextInput
                        placeholder="Alguma informação adicional que gostaria de compartilhar?"
                        style={styles.inputObs}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </ScrollView>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.buttonBack}
                        onPress={() => router.back()}
                        disabled={loading}
                    >
                        <Text style={styles.textBack}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonContinue, loading && { opacity: 0.6 }]}
                        onPress={handleFinalize} // Chama a nova função de envio
                        disabled={loading} 
                    >
                        <Text style={styles.textContinue}>
                             {loading ? "Enviando..." : "Finalizar"} 
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
        marginBottom: 16,
    },
    side: {
        width: 40,
        alignItems: 'center',
    },
    backArrow: {
        fontSize: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 16,
        color: '#4A5565',
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#D1D5DC',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxSelected: {
        backgroundColor: '#00A63E',
        borderColor: '#00A63E',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    checkboxText: {
        fontSize: 16,
        color: '#111827',
    },
    obsTitle: {
        fontSize: 16,
        color: '#4A5565',
        marginTop: 20,
        marginBottom: 10,
    },
    inputObs: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 14,
        padding: 12,
        height: 120,
    },
    buttons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    buttonBack: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        padding: 15,
        borderRadius: 14,
        alignItems: 'center',
    },
    textBack: {
        color: '#364153',
        fontSize: 16,
    },
    buttonContinue: {
        flex: 1,
        backgroundColor: '#00A63E',
        padding: 15,
        borderRadius: 14,
        alignItems: 'center',
    },
    textContinue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});