// Modelo de representação de um Item de Descarte

const ItemModel = (data) => {
  return {
    uid_usuario: data.uid_usuario,
    tipo_material: data.tipo_material, 
    descricao: data.descricao || "",
    imagem_url: data.imagem_url,
    status: data.status || 'pendente',
    pontos_gerados: data.pontos_gerados || 0,
    criado_em: data.criado_em || new Date(),
  };
};

module.exports = ItemModel;