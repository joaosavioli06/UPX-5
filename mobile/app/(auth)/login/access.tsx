import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Acess() {
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

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
                        />

                        <Text style={styles.label}>Senha</Text>

                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="••••••••"
                                style={styles.passwordInput}
                                secureTextEntry={!showPassword}
                                autoCorrect={false}
                                autoCapitalize="none"
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
                                style={styles.primaryButton}
                            >
                                <Text style={styles.primaryText}>Entrar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={styles.enter}>
                                    Não tem uma conta? <Text onPress={() => router.push('/register')} style={styles.link}>Criar conta</Text>
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