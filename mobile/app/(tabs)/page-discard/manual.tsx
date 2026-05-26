import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker'
import { useDiscard } from "@/contexts/DiscardContext";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Inicializa o Firebase no front-end caso ele já não tenha sido iniciado em outro lugar
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export default function Manual() {
    const { data, updateData } = useDiscard();
    const { user } = useAuth();

    const [categoryError, setCategoryError] = useState(false);
    const [itemNameError, setItemNameError] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false); // Estado para loading do botão

    useFocusEffect(
        useCallback(() => {
            updateData({
                itemName: '',
                category: '',
                observations: ''
            });
            setImages([]);
        }, [])
    );

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
        data.category !== '' && !isUploading;

    const router = useRouter();

    function removeImage(uriToRemove: string) {
        setImages(prevImages => prevImages.filter(uri => uri !== uriToRemove));
    }

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: false,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3, // Comprime a foto local deixando-a super leve
        });

        if (!result.canceled) {
            setImages([result.assets[0].uri]);
        }
    }

    // 🌟 FUNÇÃO AUXILIAR: Envia a foto direto do celular para o bucket do Firebase Storage
    async function uploadImageToStorage(localUri: string): Promise<string> {
        const response = await fetch(localUri);
        const blob = await response.blob(); // Transforma o arquivo em um blob binário aceito pelo Firebase
        
        const filename = `descartes/front_${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);
        
        // Faz o upload direto do dispositivo para a nuvem do Firebase
        await uploadBytes(storageRef, blob);
        
        // Captura a URL pública gerada na hora
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
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
            setIsUploading(true);
            const token = await AsyncStorage.getItem('@TokenFlow:token');
            if (!token) {
                console.error("❌ Nenhum token encontrado no storage!");
                setIsUploading(false);
                return;
            }

            let urlFinalDaFoto = "";

            // 🌟 Se o usuário escolheu uma imagem, o upload é feito aqui na hora
            if (images.length > 0) {
                console.log("☁️ Iniciando upload direto para o Storage via Client...");
                urlFinalDaFoto = await uploadImageToStorage(images[0]);
                console.log("🔗 URL gerada com sucesso pelo celular:", urlFinalDaFoto);
            }

            console.log("📤 Enviando formulário leve via JSON plano para o back-end...");

            // 🌟 Chamada HTTP pura usando JSON tradicional
            const response = await fetch('https://api-c5avejvdoq-uc.a.run.app/api/itens/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome_item: data.itemName,
                    tipo_material: data.category,
                    observacoes: data.observations,
                    imagem_url: urlFinalDaFoto // Enviado como texto puro! Sem FormData, sem erros de boundary.
                })
            });

            console.log("📡 Status da Resposta da API:", response.status);
            const result = await response.json();

            if (response.ok) {
                console.log("✅ Cadastro efetuado com sucesso!");
                router.push('/registered');
            } else {
                console.error("❌ Erro retornado pelo Servidor:", result);
                alert(`Erro: ${result.error || 'Falha ao registrar'}`);
            }
        } catch (error: any) {
            console.error("🚨 Erro crítico na execução:", error);
            alert(`Erro na requisição: ${error?.message || error}`);
        } finally {
            setIsUploading(false);
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
                        <TouchableOpacity
                                onPress={() => router.back()}
                                style={styles.backButton}
                            >
                                <Ionicons name="arrow-back" size={24} color="#111827" />
                            </TouchableOpacity>

                        <Text style={styles.headerTitle}>Registrar item</Text>
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
                            updateData({ itemName: text });
                            setItemNameError(false);
                        }}
                    />

                    {itemNameError && (
                        <Text style={styles.errorText}>Nome do item é obrigatório</Text>
                    )}

                    <Text style={styles.label}>Categoria *</Text>
                    <View style={styles.categoriesContainer}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    data.category === category && styles.categorySelected,
                                    categoryError && !data.category && styles.categoryError
                                ]}
                                onPress={() => {
                                    if (data.category === category) {
                                        updateData({ category: '' });
                                    } else {
                                        updateData({ category: category });
                                        setCategoryError(false);
                                    }
                                }}
                            >
                                <Text style={[styles.categoryText, data.category === category && styles.categoryTextSelected]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {categoryError && (
                        <Text style={styles.errorText}>Selecione uma categoria</Text>
                    )}

                    <Text style={styles.label}>Observações</Text>
                    <TextInput
                        placeholder="Ex: Item em bom estado, funcionando perfeitamente"
                        style={styles.inputObs}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={data.observations}
                        onChangeText={(text) => updateData({ observations: text })}
                    />

                    <Text style={styles.label}>Foto (opcional)</Text>

                    <View style={styles.imagesContainer}>
                        {images.map((uri) => (
                            <View key={uri} style={styles.imageWrapper}>
                                <Image source={{ uri }} style={styles.previewImage} />
                                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(uri)}>
                                    <Text style={styles.removeText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {images.length === 0 && (
                            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                                <Text style={styles.plus}>+</Text>
                                <Text style={styles.uploadText}>Adicionar foto</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={[styles.registerItem, !isFormValid && styles.registerItemDisabled]}
                            disabled={!isFormValid}
                            onPress={handleRegister}
                        >
                            <Text style={styles.buttonText}>
                                {isUploading ? "Enviando Imagem..." : "Registrar item"}
                            </Text>
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
        marginTop: 20,
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
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