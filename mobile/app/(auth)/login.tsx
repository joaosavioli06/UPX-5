import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/icone_QR_token_flow.png')}
                style={styles.logo}
            />

            <Text style={styles.title}>Bem-vindo ao TokenFlow</Text>

            <Text style={styles.subtitle}>
                Gerencie sua moradia de forma simples e prática. Tudo em um só lugar.
            </Text>

            <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryText}>Entrar</Text>
            </TouchableOpacity>


            <TouchableOpacity
                onPress={() => router.push('/register')}
                style={styles.secondaryButton}
            >
                <Text style={styles.secondaryText}>Criar conta</Text>
            </TouchableOpacity>

            <Text style={styles.link}>Acesso para síndicos →</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center'
    },
    logo: {
        width: 130,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#4A5565',
        marginVertical: 16,
    },
    primaryButton: {
        backgroundColor: '#00A63E',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    primaryText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        borderWidth: 2,
        borderColor: '#00A63E',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    secondaryText: {
        color: '#00A63E',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
        fontSize: 14,
        color: '#6A7282',
    },
});