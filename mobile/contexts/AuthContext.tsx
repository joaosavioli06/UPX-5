import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  uid: string;
  nome: string;
  email: string;
  unidade: string;
  cpf: string;         
  telefone: string;     
  tipo_perfil: string;  
  status: string
  criado_em: any;
}

export interface Veiculo {
  color: string;
  modelo: string;
  placa: string;
  possui: boolean;
}

interface AuthContextData {
    user: User | null;
    loading: boolean;
    signIn(user: User, token: string): Promise<void>;
    signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function loadStorageData() {
        const storagedUser = await AsyncStorage.getItem('@TokenFlow:user');
        const storagedToken = await AsyncStorage.getItem('@TokenFlow:token');

        if (storagedUser && storagedToken) {
            setUser(JSON.parse(storagedUser));
        }
        // ESSENCIAL: O loading precisa virar false NO FINAL, independente de ter usuário ou não
        setLoading(false); 
    }

    loadStorageData();
}, []);

    const signIn = async (userData: User, token: string) => {
    try {
        
        setUser(userData); 

        await AsyncStorage.setItem('@TokenFlow:user', JSON.stringify(userData));
        await AsyncStorage.setItem('@TokenFlow:token', token);
        
        console.log("Estado atualizado com:", userData.nome);
    } catch (error) {
        console.error("Erro ao salvar no storage:", error);
    } finally {
        setLoading(false); // Finaliza o carregamento
    }
};
    const signOut = async () => {
        await AsyncStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}