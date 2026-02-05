# SimpleTasks: Gerenciador de Tarefas

> Este é um projeto de demonstração desenvolvido como parte de um processo seletivo, focado em atender a um conjunto específico de requisitos técnicos e funcionais.

<br />
<br />

**[➡️ ACESSE A APLICAÇÃO AQUI ⬅️](https://simple-tasks-mauve.vercel.app/)**

<br />

---

## 🎯 Visão Geral do Projeto

O **SimpleTasks** é um sistema web intuitivo para gerenciar uma lista de tarefas. Ele permite que o usuário adicione, edite, exclua e, o mais importante, reordene suas tarefas de forma visual e interativa.

O objetivo principal foi criar uma aplicação funcional, estável e que atendesse rigorosamente aos requisitos propostos, demonstrando competência técnica na construção de uma solução full-stack, desde o banco de dados até a interface do usuário.

## ✨ Funcionalidades Principais

O sistema implementa todas as funcionalidades solicitadas, incluindo:

- **Listagem de Tarefas:** Exibe todas as tarefas ordenadas.
- **Destaque Visual:** Tarefas com custo igual ou superior a R$ 1.000,00 são destacadas em amarelo.
- **Somatório de Custos:** O custo total de todas as tarefas é exibido no rodapé.
- **Inclusão, Edição e Exclusão:** Gerenciamento completo do ciclo de vida de uma tarefa, com modais de confirmação para ações destrutivas.
- **Validações:** Impede a criação de tarefas com nomes duplicados e garante que todos os campos obrigatórios sejam preenchidos.
- **Reordenação Dupla:**
    - **Arrastar e Soltar (Drag-and-Drop):** Permite reordenar tarefas de forma fluida, ideal para desktops.
    - **Botões de Seta (Subir/Descer):** Oferece uma alternativa de reordenação precisa e acessível.
- **Responsividade:** A interface se adapta a dispositivos móveis, otimizando a visualização e a usabilidade em telas menores.
- **Feedback ao Usuário:** Indicadores de carregamento (loaders) são exibidos durante as operações (salvar, excluir), melhorando a experiência do usuário.

## 🛠️ Detalhes Técnicos e Decisões de Implementação

### Stack de Tecnologias Utilizadas

- **Frontend:**
    - **Framework:** **React com Vite** - Escolhido pela performance, ecossistema moderno e experiência de desenvolvimento ágil.
    - **Biblioteca de UI/UX:** **`@dnd-kit`** - Utilizada para a funcionalidade de "arrastar e soltar", por ser uma biblioteca moderna, performática e com excelente suporte a dispositivos de toque (mobile).
    - **Comunicação com API:** **Axios** - Para chamadas HTTP robustas e de fácil manutenção.

- **Backend:**
    - **Framework:** **Node.js com Express** - Uma escolha sólida e amplamente utilizada para criar APIs RESTful de forma rápida e eficiente.
    - **Banco de Dados:** **PostgreSQL** - Com a conexão gerenciada pela biblioteca `pg` e hospedagem robusta feita na plataforma Neon.
    - **Segurança:** Utiliza `cors` para permitir requisições apenas de origens confiáveis (o frontend local e em produção).
        > Observação: o sistema não possui autenticação, pois o escopo do desafio não previa controle de usuários.

### Estrutura do Projeto (Monorepo)

O projeto está organizado em uma estrutura de monorepo para simplificar o desenvolvimento e o versionamento:

- `backend/`: Contém a aplicação Node.js/Express e toda a lógica de negócio e acesso ao banco de dados.
- `frontend/`: Contém a aplicação React, incluindo componentes, páginas e serviços.

```
├── backend
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── frontend
│   ├── public
│   │   └── simple-tasks-logo.png
│   ├── src
│   │   ├── components
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── TarefaForm.jsx
│   │   │   └── TarefaItem.jsx
│   │   ├── pages
│   │   │   └── ListaTarefas.jsx
│   │   ├── services
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── LICENSE
└── README.md
```

### Implementação da Reordenação

Conforme os requisitos, foram implementadas **ambas as formas de reordenação**:

1.  **Drag-and-Drop:** Utilizando `@dnd-kit`, a solução oferece uma experiência de usuário moderna. Um ícone de "☰" serve como alça de arrasto (`drag-handle`), liberando o restante do item para cliques nos botões de ação, o que é uma boa prática de UX.
2.  **Botões de Seta:** A lógica de troca de posição com o item adjacente foi mantida para garantir total conformidade com os requisitos e oferecer uma alternativa que funciona bem em qualquer dispositivo.

Ambos os métodos disparam uma única chamada à API (`PATCH /tarefas/reordenar`), enviando a nova lista de ordenação para ser persistida no banco de dados de forma transacional e segura.

## 🌐 Deploy

A aplicação está hospedada utilizando serviços de nuvem com planos gratuitos, adequados para fins de demonstração:

- Frontend hospedado na **Vercel:** **[Aqui](https://simple-tasks-mauve.vercel.app/)**
- Backend hospedado na **Render**
- Banco de dados PostgreSQL hospedado na **Neon**

> Observação: no plano gratuito da Render, o backend pode entrar em hibernação após um período de inatividade, o que pode causar um pequeno atraso na primeira requisição.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
- Um banco de dados PostgreSQL acessível.

### 1. Configuração do Backend

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Crie um arquivo .env na raiz da pasta /backend
# e adicione a string de conexão do seu banco de dados PostgreSQL:
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"

# 4. Inicie o servidor backend (geralmente em http://localhost:3001)
npm start
```

### 2. Configuração do Frontend

```bash
# 1. Em um novo terminal, navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie a aplicação de desenvolvimento (geralmente em http://localhost:5173)
npm run dev
```

Após seguir os passos, a aplicação estará acessível no endereço do frontend (`http://localhost:5173` por padrão).

---

## 🏛️ Estrutura da API e Banco de Dados

### Endpoints da API

| Método   | Rota                 | Descrição                                             |
| :------- | :------------------- | :---------------------------------------------------- |
| `GET`    | `/tarefas`           | Lista todas as tarefas, ordenadas pelo campo `ordem`. |
| `POST`   | `/tarefas`           | Cria uma nova tarefa.                                 |
| `PUT`    | `/tarefas/:id`       | Atualiza uma tarefa existente.                        |
| `DELETE` | `/tarefas/:id`       | Exclui uma tarefa.                                    |
| `PATCH`  | `/tarefas/reordenar` | Atualiza a ordem de múltiplas tarefas em lote.        |

### Schema do Banco de Dados (PostgreSQL)

```sql
CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  nome TEXT UNIQUE NOT NULL,
  custo NUMERIC(10,2) NOT NULL CHECK (custo >= 0),
  data_limite DATE NOT NULL,
  ordem INTEGER UNIQUE NOT NULL
);
```
