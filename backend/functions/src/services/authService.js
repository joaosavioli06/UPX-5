const admin = require('firebase-admin');
// Importação direta para evitar o erro de 'undefined' no serverTimestamp
const { FieldValue } = require('firebase-admin/firestore');

/**
 * Realiza o cadastro robusto de usuários.
 * Valida a existência, cria a credencial e o perfil vinculado com Rollback automático.
 */
const cadastrarUsuario = async (nome, email, password, tipo_perfil) => {
  let userRecord;

  try {
    // 1. Validação de Segurança (Fail-fast)
    const perfisValidos = ['morador', 'zelador', 'sindico'];
    if (!perfisValidos.includes(tipo_perfil)) {
      throw new Error('Perfil de usuário inválido.');
    }

    // 2. Criar o usuário no Firebase Authentication
    // O Firebase cuida do Hash da senha automaticamente
    userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nome,
      disabled: false,
    });

    // Bloco interno para garantir que, se o Firestore falhar, o Auth seja deletado (Rollback)
    try {
      // 3. Criar o Perfil no Firestore utilizando o UID como chave
      const userDocRef = admin.firestore().collection('usuarios').doc(userRecord.uid);

      await userDocRef.set({
        uid: userRecord.uid,
        nome,
        email,
        tipo_perfil,
        status: 'ativo',
        criado_em: FieldValue.serverTimestamp(),
        atualizado_em: FieldValue.serverTimestamp(),
      });

      // 4. Definir Custom Claims para Cibersegurança (RBAC)
      // Permite validar permissões direto no Token JWT sem consultar o banco
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: tipo_perfil });

      return {
        uid: userRecord.uid,
        email: userRecord.email
      };

    } catch (firestoreError) {
      // ROLLBACK: Se o banco de dados falhar, removemos o login criado para não deixar lixo
      console.error(`[AuthService] Falha no Firestore, executando rollback do Auth...`);
      if (userRecord) {
        await admin.auth().deleteUser(userRecord.uid);
      }
      throw firestoreError; // Repassa o erro para o controlador
    }

  } catch (error) {
    // Log detalhado para o desenvolvedor no terminal do Firebase
    console.error(`[AuthService] Erro no cadastro: ${error.message}`);
    throw error; 
  }
};

module.exports = { cadastrarUsuario };