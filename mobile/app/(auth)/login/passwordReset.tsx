import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function PasswordReset() {
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
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={styles.backButton}
                            >
                                <Ionicons name="arrow-back" size={24} color="#111827" />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Alterar senha</Text>
                        </View>

                        <Text style={styles.title}>Esqueceu sua senha?</Text>
                        <Text style={styles.subTitle}>Preencha o campo abaixo para redefinir sua senha</Text>

                        <Text style={styles.label}>Nova senha</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="NovaSenha123#"
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

                        <Text style={styles.label}>Confirmar nova senha</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="NovaSenha123#"
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

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Alterar senha</Text>
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
        marginTop: 20,
        color: '#364153',
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
    buttonContainer: {
        width: '100%',
        gap: 14,
        marginBottom: 20,
        marginTop: '70%'
    },
    button: {
        backgroundColor: '#00A63E',
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})