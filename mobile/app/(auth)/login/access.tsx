import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '@/contexts/AuthContext';

export default function Access() { // Corrigido de Acess para Access
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signIn } = useAuth();
    const router = useRouter();

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('https://api-c5avejvdoq-uc.a.run.app/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            console.log("DADOS QUE CHEGARAM DO SERVIDOR:", JSON.stringify(result, null, 2));

            if (response.ok) {
               
                console.log("Usuário logado:", result.usuario.nome);

                await signIn(result.usuario, result.token); 

                // Navegação para a Home
                router.replace('/(tabs)');
            } else {
            
                Alert.alert("Erro no Login", result.error || "Credenciais inválidas.");
            }
        } catch (error) {
            Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique sua internet.");
            console.error("[Login Error]:", error);
        } finally {
            setLoading(false);
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
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.backArrow}>←</Text>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Entrar</Text>
                        <View style={styles.side} />
                    </View>

                    <Text style={styles.title}>Acesse sua conta</Text>
                    <Text style={styles.subTitle}>Entre com seu e-mail e senha cadastrados</Text>

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        placeholder="seu@email.com"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        // Vincula o texto digitado ao estado 'email'
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Senha</Text>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="••••••••"
                            style={styles.passwordInput}
                            secureTextEntry={!showPassword}
                            autoCorrect={false}
                            autoCapitalize="none"
                            // Vincula o texto digitado ao estado 'password'
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.password}>Esqueci minha senha</Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            // Chama a função handleLogin em vez de navegar direto
                            onPress={handleLogin}
                            style={[styles.primaryButton, loading && { opacity: 0.7 }]}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryText}>Entrar</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity disabled={loading}>
                            <Text style={styles.enter}>
                                Não tem uma conta? <Text onPress={() => !loading && router.push('/register')} style={styles.link}>Criar conta</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        marginBottom: 10,
        marginTop: 32,
    },
    subTitle: {
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
    password: {
        fontSize: 14,
        fontWeight: 'medium',
        marginTop: 8,
        color: '#00A63E',
    },
    buttons: {
        width: '100%',
        gap: 14,
        marginBottom: 20,
        marginTop: '50%'
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