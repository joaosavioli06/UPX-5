import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import ProgressBar from "@/components/progressBar";
import { useRouter } from "expo-router";

export default function Preference() {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const router = useRouter();

    function toggleOption(option: string) {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.backArrow}>←</Text>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Cadastro</Text>
                        <View style={styles.side} />
                    </View>

                    <ProgressBar step={4} total={4} />

                    <Text style={styles.title}>Preferências</Text>
                    <Text style={styles.subTitle}>
                        Como você prefere receber informações?
                    </Text>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => toggleOption('whatsapp')}
                    >
                        <View style={[
                            styles.checkbox,
                            selectedOptions.includes('whatsapp') && styles.checkboxSelected
                        ]}>
                            {selectedOptions.includes('whatsapp') && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </View>

                        <Text style={styles.checkboxText}>
                            Receber avisos por WhatsApp
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => toggleOption('email')}
                    >
                        <View style={[
                            styles.checkbox,
                            selectedOptions.includes('email') && styles.checkboxSelected
                        ]}>
                            {selectedOptions.includes('email') && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </View>

                        <Text style={styles.checkboxText}>
                            Receber avisos por e-mail
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => toggleOption('condominio')}
                    >
                        <View style={[
                            styles.checkbox,
                            selectedOptions.includes('condominio') && styles.checkboxSelected
                        ]}>
                            {selectedOptions.includes('condominio') && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </View>

                        <Text style={styles.checkboxText}>
                            Newslatter do condomínio
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => toggleOption('eventos')}
                    >
                        <View style={[
                            styles.checkbox,
                            selectedOptions.includes('eventos') && styles.checkboxSelected
                        ]}>
                            {selectedOptions.includes('eventos') && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </View>

                        <Text style={styles.checkboxText}>
                            Notificaçōes de eventos
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.obsTitle}>Observaçōes (opcional)</Text>

                    <TextInput
                        placeholder="Alguma informação adicional que gostaria de compartilhar?"
                        style={styles.inputObs}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </ScrollView>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.buttonBack}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.textBack}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonContinue}
                        onPress={() => router.push('/register/confirm')}
                    >
                        <Text style={styles.textContinue}>Finalizar</Text>
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
        padding: 20,
    },
    scrollContent: {
        paddingBottom: 20,
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
        marginTop: 20,
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 16,
        color: '#4A5565',
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#D1D5DC',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxSelected: {
        backgroundColor: '#00A63E',
        borderColor: '#00A63E',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    checkboxText: {
        fontSize: 16,
        color: '#111827',
    },
    obsTitle: {
        fontSize: 16,
        color: '#4A5565',
        marginTop: 20,
        marginBottom: 10,
    },
    inputObs: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 14,
        padding: 12,
        height: 120,
    },
    buttons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
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