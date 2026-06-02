![Logo do Projeto](/mobile/assets/images/icone_token_flow_completo_fundo_rmv.png)  

# Usina de Projetos Experimentais 5 - Grupo ODSCoders
## Token Flow — Plataforma Digital de Gestão de Descarte Residencial

> Sistema mobile e backend para gerenciamento, triagem e destinação inteligente de descartes em condomínios residenciais, desenvolvido como projeto acadêmico de ADS (Análise e Desenvolvimento de Sistemas) — Facens 2026.

---

## Sobre o Projeto

O **Token Flow** é uma solução digital projetada para intermediar, organizar e registrar o descarte de materiais recicláveis e grandes volumes (como móveis e eletroeletrônicos) dentro de ambientes condominiais. Através do aplicativo, os envolvidos realizam ações integradas em tempo real:

* **Moradores** registram os itens que desejam descartar, adicionando descrições dos materiais.
* **Síndicos e Administradores** acessam um painel de triagem para validar, aprovar ou recusar pedidos pendentes na fila de descarte.

## O problema que resolve

Em condomínios residenciais de médio e grande porte, o descarte irregular de resíduos volumosos em áreas comuns gera desorganização física, atritos de convivência e problemas sanitários. Sem um canal centralizado, a comunicação entre moradores, a administração do condomínio e as cooperativas de reciclagem locais é descentralizada e caótica.

O Token Flow digitaliza esse ecossistema em Sorocaba/SP, transformando o acúmulo desordenado em um fluxo de dados totalmente rastreável, apoiando diretamente o cumprimento das Metas Globais de Sustentabilidade (ODS 11, 12, 13 e 17).

---

### Tecnologias Utilizadas

| Camada / Componente | Tecnologia | Finalidade no Projeto |
| :--- | :--- | :--- |
| **Mobile** | React Native + Expo Go | Desenvolvimento do aplicativo multiplataforma e execução em ambiente de testes. |
| **Backend** | Node.js + Express | Construção da API RESTful, gerenciamento de rotas e segurança do ecossistema. |
| **Banco de Dados** | Firebase Firestore | Armazenamento NoSQL escalável para documentos de usuários, descartes e logs. |
| **Object Storage** | Firebase Storage | Armazenamento de arquivos de mídia (fotos dos itens enviados pelos moradores). |
| **API de IA** | Google Vision API | Processamento inteligente de imagens para identificação automatizada de resíduos. |

---

### 📁 Estrutura do Repositório

```text
TokenFlow/
├── backend/                 # Infraestrutura do Servidor (Firebase Cloud Functions)
│   ├── firebase.json        # Configurações de Hosting, Rules e Functions do Firebase
│   ├── firestore.rules      # Regras de segurança e acesso do banco Firestore
│   └── functions/           # Diretório principal da API Node.js / Express
│       ├── index.js         # Ponto de entrada (Entrypoint) da API
│       └── src/
│           ├── config/      # Constantes globais e chaves de configuração
│           ├── controllers/ # Lógica de controle (admin, auth, coleta, ia, item)
│           ├── middlewares/ # Interceptadores de requisição (autenticação e erros)
│           ├── models/      # Estrutura de dados/entidades (item, user)
│           ├── routes/      # Endpoints HTTP da API mapeados por módulos
│           └── services/    # Regras de negócio isoladas e integrações (IA/Vision)
│
├── mobile/                  # Aplicação Mobile Multiplataforma (React Native & Expo)
│   ├── app/                 # Arquitetura de roteamento dinâmico (Expo Router)
│   │   ├── (auth)/          # Fluxo de autenticação (Login, Cadastro por etapas, Senha)
│   │   └── (tabs)/          # Módulos principais de navegação persistente
│   │       ├── page-discard/# Painel do Morador (Registro, Câmera com IA, Histórico)
│   │       └── page-syndic/ # Painel Administrativo do Síndico (Gestão de Descartes)
│   ├── assets/              # Recursos estáticos de mídia (Logos, Ícones, Splash)
│   ├── components/          # Componentes visuais reutilizáveis (Cards, Barras de Progresso)
│   └── contexts/            # Provedores de estado global (Autenticação, Descarte)
│
├── DOCS/                    # Entrega de relatórios e artigos acadêmicos (AC1, AC2, AF)
└── README.md                # Documentação principal do repositório
```

---

### Mentorias Presenciais / Apresentações Gerais

Para o 5º semestre, foram definidos dias para mentorias presenciais e apresentações via Teams. O grupo cumpriu com esta exigência, participando em todas, nos seguintes dias:

| Data | Mentoria | Participantes |
| :--- | :--- | :--- |
| `22/04/2026` | 1ª mentoria | Lívia & Luiz Fernando  |
| `11/05/2026` | Apresentação Projeto 70% (Funcionalidades)| Felipe & João Gabriel  |
| `03/06/2026` | Apresentação UPX | Todos  |

---

### Integrantes

| Nome | RA | Responsabilidade |
| :--- | :--- | :--- |
| `Felipe Rodrigues Hondei` | 237047 | IA |
| `João Gabriel Savioli` | 247617 | Backend & Banco de Dados|
 `João Guilherme Azevedo de Almeida` | 249229 | Documentação |
  `Karla Alejandra Acosta Barrios` | 249369 | Banco de Dados |
  `Lívia Moraes de Borba` | 249595 | Frontend |
  `Luiz Fernando Brisola` | 249429 | Documentação |

