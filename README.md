# 🎬 Front do CineXP
---
### 🔗  Links importantes
Repositório da API (back-end): [clique aqui](https://cinexp.netlify.app/)

Deploy do front-end: [clique aqui](https://github.com/anabraghim/trabalho_prog_web)
### 📝 Descrição geral
Este repositório contém o front-end do CineXP, desenvolvido como parte do trabalho da disciplina de Programação para Web, ministrada pelo professor Hudson Silva Borges.

O front-end foi construído com React + TypeScript e estilizado com Tailwind CSS, proporcionando uma interface responsiva, moderna e interativa, sem necessidade de recarregar a página. A comunicação com o back-end é realizada por meio de requisições a uma API, hospedada no repositório citado acima.

A aplicação está organizada em páginas como:

- Home

- Login e Cadastro

- Listagem de Críticas

- Cadastro de Crítica

- Minhas Críticas

Cada uma delas é estruturada com separação clara entre lógica, layout e estilo.
O deploy do backend foi feito pelo site Render e o front pelo Netlify.


### 👥 Integrantes do grupo
* Ana Júlia de Lima Braghim
RGA: 2023.1907.037-8
* Mariele Andressa de Oliveira Farias
RGA: 2023.1907.053-0
* Matheus Droppa Omido
RGA: 2023.1907.055-6
### ✅ Funcionalidades implementadas
- Funcionalidades básicas
  - Login e cadastro de usuário
  - Navegar pelas críticas de todos os usuários
  - Visualizar detalhes de cada crítica
  - Escrever críticas (apenas quando auenticado e autorizado)
  - Alterar e remover críticas (apenas quando autenticado e autorizado)
  - Buscar por críticas por nome da crítica.
  - Cadastrar filmes (para o usuário cadastrar filmes reais e não haver duplicação, requisitamos da API do TMDB)
- Funcionalides bônus:
  - Buscas avançadas (além de buscar pelo nome da crítica, é possível buscar por qualquer palavra no texto em si da crítica e buscar pelos filmes relacionados as críticas)
  - Comentar críticas (apenas quando autenticado e autorizado)
### Tecnologias utilizadas
- Vite + React + TypeScript
- React Router – Gerenciamento de rotas
- Redux – Gerenciamento de estados globais
- Tailwind CSS – Estilização

### 🚀 Como rodar o projeto
Abra o projeto e no terminal digite: ```npm install``` e depois ```npm run dev```