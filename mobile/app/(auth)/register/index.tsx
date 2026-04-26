import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Stack, useRouter } from "expo-router";

export default function Register() {
    const router = useRouter();

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Criar conta',
                    headerBackTitle: 'Voltar',
                }}
            />

            <View style={styles.container}>
                <View style={styles.card}>

                    <Text style={styles.title}>Crie sua conta</Text>
                    <Text style={styles.subtitle}>Preencha os dados abaixo para começar</Text>

                    <Text style={styles.label}>Nome completo</Text>
                    <TextInput
                        placeholder="João da Silva"
                        style={styles.input}
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        placeholder="seu@email.com"
                        style={styles.input}
                    />
                    <Text style={styles.info}>
                        Usaremos este e-mail para comunicações importantes
                    </Text>

                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        placeholder="Mínimo 8 caracteres"
                        style={styles.input}
                    />
                    <Text style={styles.info}>Mínimo de 8 caracteres</Text>

                    <TouchableOpacity style={styles.buttonCreate}>
                        <Text style={styles.buttonText}>Criar conta</Text>
                    </TouchableOpacity>

                    <Text style={styles.enter}>
                        Já tem uma conta? <Text onPress={() => router.push('/login')} style={styles.link}>Entrar</Text>. 
                    </Text>
                </View>
            </View>
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        // alignItems: 'center',
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
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
        marginTop: 15,
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