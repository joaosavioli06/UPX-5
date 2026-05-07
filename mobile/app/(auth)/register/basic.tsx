import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import ProgressBar from "@/components/progressBar";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useRegister } from "@/contexts/RegisterContext"; 

export default function Basic() {
    const router = useRouter();
    const { setData } = useRegister(); 

    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');

    function handleContinue() {
        if (!cpf || !phone) {
            alert("Por favor, preencha o CPF e o Telefone.");
            return;
        }

        // 'as any' para evitar conflitos de nomes entre Front e Back
        setData({ 
            cpf, 
            telefone: phone 
        } as any);

        router.push('/register/unit');
    }

    return (
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
                    
                    <ProgressBar step={1} total={4} />

                    <Text style={styles.title}>Dados básicos</Text>
                    <Text style={styles.subTitle}>Precisamos de algumas informações para identificá-lo</Text>

                    <Text style={styles.label}>CPF</Text>
                    <TextInput
                        placeholder="000.000.000-00"
                        style={styles.input}
                        keyboardType="numeric"
                        value={cpf}
                        onChangeText={setCpf} // Atualiza o estado do CPF
                    />

                    <Text style={styles.label}>Telefone/Celular</Text>
                    <TextInput
                        placeholder="(00) 00000-0000"
                        style={styles.input}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone} // Atualiza o estado do Telefone
                    />
                    <Text style={styles.info}>Para contato em caso de emergência</Text>

                    <TouchableOpacity
                        style={styles.buttonContinue}
                        onPress={handleContinue} // Chama a função que salva e navega
                    >
                        <Text style={styles.buttonText}>
                            Continuar
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