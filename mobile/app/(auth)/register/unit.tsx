import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import ProgressBar from "@/components/progressBar";
import { Stack, useRouter } from "expo-router";

export default function Unit() {
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
                    <ProgressBar step={2} total={4} />

                    <Text style={styles.title}>Sua unidade</Text>
                    <Text style={styles.subTitle}>Informe os dados da sua moradia no condomínio</Text>

                    <Text style={styles.label}>Bloco (opcional)</Text>
                    <TextInput
                        placeholder="Ex: A, B, C..."
                        style={styles.input}
                    />

                    <Text style={styles.label}>Número da unidade</Text>
                    <TextInput
                        placeholder="Ex: 101, 202, Casa 5..."
                        style={styles.input}
                    />

                    <Text style={styles.label}>Tipo de moradia</Text>
                    <TextInput
                        placeholder="Casa, apartamento..."
                        style={styles.input}
                    />

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={styles.buttonBack}
                            onPress={() => router.push('/register/basic')}
                        >
                            <Text style={styles.textBack}>Voltar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonContinue}
                            onPress={() => router.push('/register/vehicle')}
                        >
                            <Text style={styles.textContinue}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
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
    buttons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 24,
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
        textAlign: 'center',
        fontWeight: 'medium',
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
        textAlign: 'center',
        fontWeight: 'medium',
    },
});