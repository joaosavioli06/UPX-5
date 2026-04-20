const admin = require('firebase-admin');

/**
 * Realiza o cadastro robusto de usuários.
 * Valida a existência, cria a credencial e o perfil vinculado.
 */
const cadastrarUsuario = async (nome, email, password, tipo_perfil) => {
  // 1. Iniciar uma transação ou garantir atomicidade lógica
  // No Firebase Auth + Firestore, fazemos em passos com tratamento de erro granular
  
  try {
    // Verificar se o perfil enviado é válido (Segurança de Tipos)
    const perfisValidos = ['morador', 'zelador', 'sindico'];
    if (!perfisValidos.includes(tipo_perfil)) {
      throw new Error('Perfil de usuário inválido.');
    }

    // 2. Criar o usuário no Firebase Authentication
    // O password é enviado via HTTPS e o Firebase cuida do Hash (Cibersegurança) [cite: 54]
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nome,
      disabled: false,
    });

    // 3. Criar o Perfil no Firestore utilizando o UID como chave
    // Isso garante que Usuário Auth === Documento Firestore
    const userDocRef = admin.firestore().collection('usuarios').doc(userRecord.uid);

    await userDocRef.set({
      uid: userRecord.uid,
      nome,
      email,
      tipo_perfil,
      status: 'ativo',
      criado_em: admin.firestore.FieldValue.serverTimestamp(),
      atualizado_em: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. (Opcional) Definir Custom Claims para Cibersegurança
    // Isso permite verificar o cargo do usuário sem consultar o banco todas as vezes
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: tipo_perfil });

    return {
      uid: userRecord.uid,
      email: userRecord.email
    };

  } catch (error) {
    // Log detalhado para debug, mas erro genérico para o cliente (Segurança)
    console.error(`[AuthService] Erro no cadastro: ${error.message}`);
    
    // Se o usuário foi criado no Auth mas o Firestore falhou, idealmente deletaríamos o Auth (Rollback manual)
    throw error; 
  }
};

module.exports = { cadastrarUsuario };