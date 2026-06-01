import {
    View, Text, TouchableOpacity, StyleSheet, TextInput,
    KeyboardAvoidingView, Platform, Image, ScrollView, Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { useDiscard } from "@/contexts/DiscardContext";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";

export default function Manual() {
    const { data, updateData } = useDiscard();
    const { user } = useAuth();
    const params = useLocalSearchParams();

    const [categoryError, setCategoryError] = useState(false);
    const [itemNameError, setItemNameError] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    // Indica se veio da câmera com dados preenchidos
    const veioDaIA = !!data.itemName || !!data.category;

    // Só limpa o formulário se NÃO vier da IA
    useEffect(() => {
        if (!veioDaIA) {
            updateData({ itemName: '', category: '', observations: '' });
            setImages([]);
        }
    }, []);

    const categories = [
        'Eletrônico',
        'Eletrodoméstico',
        'Móvel',
        'Vestuário',
        'Brinquedo',
        'Outro'
    ];

    const isFormValid = data.itemName.trim() !== '' && data.category !== '';

    const router = useRouter();

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => asset.uri);
            setImages(prev => [...prev, ...selectedImages]);
        }
    }

    function removeImage(uri: string) {
        setImages(prev => prev.filter(image => image !== uri));
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
                Alert.alert("Sessão expirada", "Faça login novamente.");
                router.replace('/(auth)/login/access');
                return;
            }

            const payload = {
                nome_item: data.itemName,
                tipo_material: data.category,
                observacoes: data.observations,
                morador_id: user?.uid,
                status: "Pendente"
            };

            const response = await fetch('https://api-c5avejvdoq-uc.a.run.app/api/itens/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                // Limpa o contexto após registrar com sucesso
                updateData({ itemName: '', category: '', observations: '' });
                router.push('/registered');
            } else {
                Alert.alert("Erro", result.message || 'Falha ao registrar');
            }
        } catch (error) {
            Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor.");
        }
    }

    return (
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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Registrar item</Text>
                </View>

                {/* Banner informativo quando veio da IA */}
                {veioDaIA && (
                    <View style={styles.iaBanner}>
                        <Ionicons name="sparkles-outline" size={18} color="#7C3AED" />
                        <Text style={styles.iaBannerText}>
                            Campos preenchidos automaticamente pela IA. Corrija se necessário.
                        </Text>
                    </View>
                )}

                <Text style={styles.title}>Informações do item</Text>
                <Text style={styles.subTitle}>Preencha os dados do item que será descartado</Text>

                <Text style={styles.label}>Nome do item *</Text>
                <TextInput
                    placeholder="Ex: Garrafa de plástico"
                    style={[styles.input, itemNameError && styles.inputError]}
                    value={data.itemName}
                    onChangeText={(text) => {
                        updateData({ itemName: text });
                        setItemNameError(false);
                    }}
                />
                {itemNameError && <Text style={styles.errorText}>Nome do item é obrigatório</Text>}

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
                                updateData({ category: data.category === category ? '' : category });
                                setCategoryError(false);
                            }}
                        >
                            <Text style={[
                                styles.categoryText,
                                data.category === category && styles.categoryTextSelected
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {categoryError && <Text style={styles.errorText}>Selecione uma categoria</Text>}

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
                    <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                        <Text style={styles.plus}>+</Text>
                        <Text style={styles.uploadText}>Adicionar foto</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.button}>
                    <TouchableOpacity
                        style={[styles.registerItem, !isFormValid && styles.registerItemDisabled]}
                        disabled={!isFormValid}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>Registrar item</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:             { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
    content:               { paddingBottom: 40 },
    header:                { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 18, marginBottom: 28, marginTop: 20 },
    backButton:            { justifyContent: 'center', alignItems: 'center' },
    headerTitle:           { fontSize: 18, fontWeight: '700', color: '#111827' },
    iaBanner:              { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EDE9FE', borderRadius: 12, padding: 12, marginBottom: 16 },
    iaBannerText:          { flex: 1, fontSize: 13, color: '#7C3AED', lineHeight: 18 },
    title:                 { color: '#101828', fontSize: 24, fontWeight: 'bold', marginBottom: 14 },
    subTitle:              { fontSize: 16, color: '#4A5565' },
    label:                 { fontSize: 14, fontWeight: 'medium', marginBottom: 5, marginTop: 16, color: '#364153' },
    input:                 { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 14, padding: 12, marginBottom: 5, marginTop: 8 },
    inputObs:              { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 14, padding: 12, height: 120, marginTop: 6 },
    categoriesContainer:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
    categoryButton:        { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
    categorySelected:      { backgroundColor: '#DCFCE7' },
    categoryText:          { fontSize: 14, color: '#374151', fontWeight: '500' },
    categoryTextSelected:  { color: '#16A34A', fontWeight: '600' },
    plus:                  { fontSize: 40, color: '#6B7280', marginBottom: 10 },
    uploadText:            { fontSize: 14, color: '#4A5565' },
    button:                { width: '100%', gap: 14, marginTop: 24 },
    registerItem:          { backgroundColor: '#00A63E', padding: 18, borderRadius: 14, alignItems: 'center' },
    buttonText:            { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    inputError:            { borderColor: '#EF4444' },
    errorText:             { color: '#EF4444', fontSize: 14, marginTop: 4 },
    categoryError:         { borderWidth: 1, borderColor: '#EF4444' },
    registerItemDisabled:  { backgroundColor: '#86D7A5' },
    imagesContainer:       { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
    imageWrapper:          { position: 'relative' },
    removeButton:          { position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: 14, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
    removeText:            { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    previewImage:          { width: 120, height: 120, borderRadius: 18 },
    uploadBox:             { width: '100%', height: 180, borderWidth: 2, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
});
