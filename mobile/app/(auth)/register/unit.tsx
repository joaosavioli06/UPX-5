import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import ProgressBar from "@/components/progressBar";
import { Stack, useRouter } from "expo-router";
import { useRegister } from "@/contexts/RegisterContext";

export default function Unit() {
    const router = useRouter();
    const { setData } = useRegister();

    const [block, setBlock] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [type, setType] = useState('');

    function handleContinue() {
        setData({
            unit: block ? `Bloco ${block} - ${unitNumber}` : unitNumber,
            type: type
        });

        router.push('/register/vehicle');
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
                        
                        <ProgressBar step={2} total={4} />

                        <Text style={styles.title}>Sua unidade</Text>
                        <Text style={styles.subTitle}>Informe os dados da sua moradia no condomínio</Text>

                        <Text style={styles.label}>Bloco (opcional)</Text>
                        <TextInput
                            placeholder="Ex: A, B, C..."
                            style={styles.input}
                            value={block}
                            onChangeText={setBlock}
                        />

                        <Text style={styles.label}>Número da unidade</Text>
                        <TextInput
                            placeholder="Ex: 101, 202, Casa 5..."
                            style={styles.input}
                            value={unitNumber}
                            onChangeText={setUnitNumber}
                        />

                        <Text style={styles.label}>Tipo de moradia</Text>
                        <TextInput
                            placeholder="Casa, apartamento..."
                            style={styles.input}
                            value={type}
                            onChangeText={setType}
                        />

                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={styles.buttonBack}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.textBack}>Voltar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.buttonContinue}
                                onPress={handleContinue}
                            >
                                <Text style={styles.textContinue}>Continuar</Text>
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