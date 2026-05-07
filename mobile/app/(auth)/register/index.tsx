import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useRegister } from "@/contexts/RegisterContext";

export default function Register() {
    const router = useRouter();
    const { setData } = useRegister();
    
    // Estados locais para capturar o que o usuário digita
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleContinue() {
        // Validação simples antes de salvar (opcional)
        if (!nome || !email || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // 'as any' para o TypeScript ignorar a diferença de idioma
        // entre o Front (inglês) e back (português)
        setData({ 
            nome, 
            email, 
            password 
        } as any); 

        router.push('/register/basic');
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

                            <Text style={styles.headerTitle}>Cadastro</Text>
                            <View style={styles.side} />
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
                        />
                        <Text style={styles.info}>
                            Usaremos este e-mail para comunicações importantes
                        </Text>

                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            placeholder="Mínimo 8 caracteres"
                            style={styles.input}
                            secureTextEntry // Esconde a senha
                            value={password}
                            onChangeText={setPassword} // Atualiza o estado ao digitar
                        />
                        <Text style={styles.info}>Mínimo de 8 caracteres</Text>

                        <TouchableOpacity
                            style={styles.buttonCreate}
                            onPress={handleContinue} // Agora chama a função que salva e navega
                        >
                            <Text style={styles.buttonText}>
                                Criar conta
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.enter}>
                            Já tem uma conta? <Text onPress={() => router.push('/login')} style={styles.link}>Entrar</Text>.
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
        marginBottom: 10,
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
});