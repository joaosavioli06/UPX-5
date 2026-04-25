// Modelo de representação de um Usuário
 
const UserModel = (data) => {
  return {
    uid: data.uid,
    nome: data.nome,
    email: data.email,
    tipo_perfil: data.tipo_perfil || 'morador',
    is_admin: data.is_admin || false,
    saldo_pontos: data.saldo_pontos || 0,
    status: data.status || 'ativo',
    criado_em: data.criado_em || new Date(),
    atualizado_em: new Date()
  };
};

module.exports = UserModel;