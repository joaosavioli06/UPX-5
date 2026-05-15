import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker'
import { useDiscard } from "@/contexts/DiscardContext";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Manual() {
    const { data, updateData } = useDiscard();
    const { user } = useAuth(); 

    // const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryError, setCategoryError] = useState(false);

    // const [itemName, setItemName] = useState('');
    const [itemNameError, setItemNameError] = useState(false);

    const [images, setImages] = useState<string[]>([]);

    const categories = [
        'Eletrônico',
        'Eletrodoméstico',
        'Móvel',
        'Vestuário',
        'Brinquedo',
        'Outro'
    ];

    const isFormValid =
        data.itemName.trim() !== '' &&
        data.category !== '';


    const router = useRouter();

    async function pickImage() {

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {

            const selectedImages = result.assets.map(
                (asset) => asset.uri
            );

            setImages((prev) => [
                ...prev,
                ...selectedImages
            ]);
        }
    }

    function removeImage(uri: string) {
        setImages((prev) =>
            prev.filter((image) => image !== uri)
        );
    }

    async function handleRegister() {
        let hasError = false;

        if (!data.itemName.trim()) {
            setItemNameError(true);
            hasError = true;
        }

        if (!data.category) {
            setCategoryError(true);
            hasError = true;
        }

        if (hasError) return;

       try {
        const token = await AsyncStorage.getItem('@TokenFlow:token');
        if (!token) {
            console.error("❌ Nenhum token encontrado no storage!");
            return;
            }

    // LOG 1: Verificar o que está sendo enviado (Payload)
    const payload = {
        nome_item: data.itemName,
        categoria: data.category,
        observacoes: data.observations,
        morador_id: user?.uid,
        status: "Pendente"
    };
    console.log("📤 Enviando descarte:", JSON.stringify(payload, null, 2));

    const response = await fetch('https://api-c5avejvdoq-uc.a.run.app/api/itens/registrar', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
    });

    // LOG 2: Verificar o status da resposta HTTP
    console.log("📡 Status da Resposta:", response.status);

    const result = await response.json();

    if (response.ok) {
        // LOG 3: Sucesso total
        console.log("✅ Sucesso no Firestore! ID do Token:", result.tokenQR);
        router.push('/registered');
    } else {
        // LOG 4: Erro de lógica do servidor (ex: validação falhou)
        console.error("❌ Erro no Servidor (JSON):", result);
        alert(`Erro: ${result.message || 'Falha ao registrar'}`);
    }
} catch (error) {
    // LOG 5: Erro de rede ou crash (ex: URL errada ou servidor offline)
    console.error("🚨 Erro crítico na requisição:", error);
    alert("Não foi possível conectar ao servidor.");
}

    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.backArrow}>←</Text>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Registrar item</Text>
                        <View style={styles.side} />
                    </View>

                    <Text style={styles.title}>Informaçōes do item</Text>
                    <Text style={styles.subTitle}>Preencha os dados do item que será descartado</Text>

                    <Text style={styles.label}>Nome do item *</Text>
                    <TextInput
                        placeholder="Ex: Geladeria Brastemp duplex"
                        style={[
                            styles.input,
                            itemNameError && styles.inputError
                        ]}
                        value={data.itemName}
                        onChangeText={(text) => {
                            updateData({
                                itemName: text
                            });
                            setItemNameError(false);
                        }}
                    />

                    {itemNameError && (
                        <Text style={styles.errorText}>
                            Nome do item é obrigatório
                        </Text>
                    )}

                    <Text style={styles.label}>Categoria *</Text>
                    <View style={styles.categoriesContainer}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    data.category === category &&
                                    styles.categorySelected,
                                    categoryError &&
                                    !data.category &&
                                    styles.categoryError
                                ]}
                                onPress={() => {
                                    if (data.category === category) {
                                        updateData({
                                            category: ''
                                        });
                                    } else {
                                        updateData({
                                            category: category
                                        });
                                        setCategoryError(false);
                                    }
                                }}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        data.category === category &&
                                        styles.categoryTextSelected
                                    ]}
                                >
                                    {category}
                                </Text>

                            </TouchableOpacity>
                        ))}
                    </View>

                    {categoryError && (
                        <Text style={styles.errorText}>
                            Selecione uma categoria
                        </Text>
                    )}

                    <Text style={styles.label}>Observações</Text>
                    <TextInput
                        placeholder="Ex: Item em bom estado, funcionando perfeitamente"
                        style={styles.inputObs}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={data.observations}
                        onChangeText={(text) => 
                            updateData({
                                observations: text
                            })
                        }
                    />

                    <Text style={styles.label}>Foto (opcional)</Text>

                    <View style={styles.imagesContainer}>
                        {images.map((uri) => (
                            <View
                                key={uri}
                                style={styles.imageWrapper}
                            >
                                <Image
                                    source={{ uri }}
                                    style={styles.previewImage}
                                />

                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeImage(uri)}
                                >
                                    <Text style={styles.removeText}>
                                        ×
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        ))}
                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={pickImage}
                        >
                            <Text style={styles.plus}>+</Text>
                            <Text style={styles.uploadText}>
                                Adicionar foto
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={[
                                styles.registerItem,
                                !isFormValid && styles.registerItemDisabled
                            ]}
                            disabled={!isFormValid}
                            onPress={handleRegister}
                        >
                            <Text style={styles.buttonText}>Registrar item</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    content: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 18,
        marginBottom: 28,
    },
    side: {
        width: 40,
    },
    backArrow: {
        fontSize: 28,
        color: '#111827',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    title: {
        color: '#101828',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 14,
    },
    subTitle: {
        fontSize: 16,
        color: '#4A5565',
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
    inputObs: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 14,
        padding: 12,
        height: 120,
        marginTop: 6,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },
    categoryButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    categorySelected: {
        backgroundColor: '#DCFCE7',
    },
    categoryText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    categoryTextSelected: {
        color: '#16A34A',
        fontWeight: '600',
    },
    plus: {
        fontSize: 40,
        color: '#6B7280',
        marginBottom: 10,
    },
    uploadText: {
        fontSize: 14,
        color: '#4A5565',
    },
    button: {
        width: '100%',
        gap: 14,
        marginTop: 24,
    },
    registerItem: {
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
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginTop: 4,
    },
    categoryError: {
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    registerItemDisabled: {
        backgroundColor: '#86D7A5',
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 10,
    },
    imageWrapper: {
        position: 'relative',
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    removeText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    previewImage: {
        width: 120,
        height: 120,
        borderRadius: 18,
    },
    uploadBox: {
        width: '100%',
        height: 180,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#D1D5DB',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
})