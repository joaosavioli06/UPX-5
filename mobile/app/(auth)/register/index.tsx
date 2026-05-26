import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useRegister } from "@/contexts/RegisterContext";
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showChave, setShowChave] = useState(false);

    const router = useRouter();
    const { setData } = useRegister();

    // Estados locais para capturar o que o usuário digita
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [chaveSindico, setChaveSindico] = useState('');

    async function handleContinue() {
        if (!nome || !email || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const checkResponse = await fetch('https://api-c5avejvdoq-uc.a.run.app/api/auth/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const checkResult = await checkResponse.json();

            if (checkResult.exists) {
                alert("Este e-mail já está em uso. Por favor, escolha outro.");
                return;
            }

            if (chaveSindico.trim() !== '') {
                const sindicoResponse = await fetch('https://api-c5avejvdoq-uc.a.run.app/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome,
                        email,
                        password,
                        tipo_perfil: 'sindico',
                        codigoAcesso: chaveSindico,
                        userData: {
                            telefone: ''
                        }
                    })
                });

                const sindicoResult = await sindicoResponse.json();

                if (!sindicoResponse.ok) {
                    alert(sindicoResult.error || "Chave inválida. Verifique e tente novamente.");
                    return;
                }

                router.replace('/(tabs)/page-syndic');
                return;
            }

            setData({ nome, email, password } as any);
            router.push('/register/basic');

        } catch (error) {
            alert("Erro ao validar dados. Verifique sua conexão.");
        }
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={styles.backButton}
                            >
                                <Ionicons name="arrow-back" size={24} color="#111827" />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Cadastro</Text>
                        </View>

                        <Text style={styles.title}>Crie sua conta</Text>
                        <Text style={styles.subtitle}>Preencha os dados abaixo para começar</Text>

                        <Text style={styles.label}>Nome completo</Text>
                        <TextInput
                            placeholder="João da Silva"
                            style={styles.input}
                            value={nome}
                            onChangeText={setNome} // Atualiza o estado ao digitar
                        />

                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            placeholder="seu@email.com"
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail} // Atualiza o estado ao digitar
                            autoCorrect={false}
                        />
                        <Text style={styles.info}>
                            Usaremos este e-mail para comunicações importantes
                        </Text>

                        <Text style={styles.label}>Senha</Text>

                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Mínimo 8 caracteres"
                                style={styles.passwordInput}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />

                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={22}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.info}>Mínimo de 8 caracteres</Text>

                        <Text style={styles.label}>Você é síndico? (opcional)</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Digite sua chave"
                                style={styles.passwordInput}
                                autoCapitalize="none"
                                value={chaveSindico}
                                onChangeText={setChaveSindico}
                                autoCorrect={false}
                                secureTextEntry={!showChave}
                            />
                            <TouchableOpacity onPress={() => setShowChave(!showChave)}>
                                <Ionicons
                                    name={showChave ? 'eye-outline' : 'eye-off-outline'}
                                    size={22}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.info}>Informe sua chave</Text>

                        <TouchableOpacity
                            style={styles.buttonCreate}
                            onPress={handleContinue} // Agora chama a função que salva e navega
                        >
                            <Text style={styles.buttonText}>
                                Criar conta
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.enter}>
                            Já tem uma conta? <Text onPress={() => router.push('/login/access')} style={styles.link}>Entrar</Text>.
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
        marginBottom: 16,
        marginTop: 20,
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 24,
    },
    subtitle: {
        fontSize: 16,
        color: '#4A5565',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'medium',
        marginBottom: 5,
        marginTop: 16,
        color: '#364153',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 14,
        padding: 12,
        marginBottom: 5,
        marginTop: 8,
    },
    info: {
        fontSize: 12,
        color: '#6A7282',
        // marginBottom: 10,
        marginTop: 10
    },
    buttonCreate: {
        backgroundColor: '#16a34a',
        padding: 15,
        borderRadius: 12,
        marginTop: 24,
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'medium',
    },
    enter: {
        textAlign: 'center',
        marginTop: 14,
        color: '#4A5565',
    },
    link: {
        fontSize: 16,
        color: '#00A63E',
        fontWeight: 'medium',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 14,
        paddingHorizontal: 12,
        marginTop: 6,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 12,
    },
});