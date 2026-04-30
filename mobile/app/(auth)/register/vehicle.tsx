import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import ProgressBar from "@/components/progressBar";
import { useRouter } from "expo-router";

export default function Vehicle() {
    const [hasVehicle, setHasVehicle] = useState<null | boolean>(null);
    const router = useRouter();

    return (
        <>
            <View style={styles.container}>
                <View style={styles.card}>

                    <View style={styles.content}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.backArrow}>←</Text>
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Cadastro</Text>
                            <View style={styles.side} />
                        </View>

                        <ProgressBar step={3} total={4} />

                        <Text style={styles.title}>Veículo</Text>
                        <Text style={styles.subTitle}>
                            Possui veículo cadastrado no condomínio?
                        </Text>

                        <View style={styles.buttonsAcess}>
                            <TouchableOpacity
                                style={[
                                    styles.buttonOption,
                                    hasVehicle === true && styles.buttonSelected
                                ]}
                                onPress={() => setHasVehicle(true)}
                            >
                                <Text style={[
                                    styles.textOption,
                                    hasVehicle === true && styles.textSelected
                                ]}>
                                    Sim
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.buttonOption,
                                    hasVehicle === false && styles.buttonSelected
                                ]}
                                onPress={() => setHasVehicle(false)}
                            >
                                <Text style={[
                                    styles.textOption,
                                    hasVehicle === false && styles.textSelected
                                ]}>
                                    Não
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {hasVehicle && (
                            <>
                                <Text style={styles.label}>Placa</Text>
                                <TextInput placeholder="ABC1D23" style={styles.input} />

                                <Text style={styles.label}>Modelo</Text>
                                <TextInput placeholder="Ex: Honda Civic" style={styles.input} />

                                <Text style={styles.label}>Cor</Text>
                                <TextInput placeholder="Ex: Prata" style={styles.input} />
                            </>
                        )}
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={styles.buttonBack}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.textBack}>Voltar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonContinue}
                            onPress={() => router.push('/register/basic')}
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
        padding: 20,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
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
        marginTop: 20,
    },
    subTitle: {
        fontSize: 16,
        color: '#4A5565',
        marginBottom: 20,
    },
    buttonsAcess: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },
    buttonOption: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 14,
        alignItems: 'center',
    },
    buttonSelected: {
        backgroundColor: '#00A63E',
    },

    textOption: {
        fontSize: 16,
        color: '#364153',
    },
    textSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        marginTop: 16,
        color: '#364153',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 14,
        padding: 12,
        marginTop: 6,
    },
    buttons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
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
        fontWeight: 'bold',
    },
});