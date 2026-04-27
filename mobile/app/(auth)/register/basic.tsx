import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import ProgressBar from "@/components/progressBar";
import { Stack, useRouter } from "expo-router";

export default function Basic() {
    const router = useRouter();

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Cadastro',
                    headerBackTitle: 'Voltar',
                }}
            />
            <View style={styles.container}>
                <View style={styles.card}>
                    <ProgressBar step={1} total={4} />

                    <Text style={styles.title}>Dados básicos</Text>
                    <Text style={styles.subTitle}>Precisamos de algumas informações para identificá-lo</Text>

                    <Text style={styles.label}>CPF</Text>
                    <TextInput
                        placeholder="000.000.000-00"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Telefone/Celular</Text>
                    <TextInput
                        placeholder="(00) 00000-0000"
                        style={styles.input}
                    />
                    <Text style={styles.info}>Para contato em caso de emergência</Text>

                    <TouchableOpacity
                        style={styles.buttonContinue}
                        onPress={() => router.push('/register/unit')}
                    >
                        <Text style={styles.buttonText}>
                            Continuar
                        </Text>
                    </TouchableOpacity>
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
    info: {
        fontSize: 12,
        color: '#6A7282',
        marginBottom: 10,
    },
    buttonContinue: {
        backgroundColor: '#00A63E',
        padding: 15,
        borderRadius: 14,
        marginTop: 87,
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'medium',
    },
});    