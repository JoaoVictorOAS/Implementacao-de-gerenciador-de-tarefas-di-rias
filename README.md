# Sistema de Agendamento de Compromissos

Este projeto é um exemplo de um sistema de agendamento de compromissos construído com Node.js e TypeScript, seguindo uma arquitetura em camadas (N-Tier). Ele permite adicionar e listar compromissos através de uma API REST, uma interface de linha de comando (CLI) e uma interface web simples.

## Tecnologias Utilizadas

- **Node.js:** Ambiente de execução JavaScript no servidor.
- **TypeScript:** Superset de JavaScript que adiciona tipagem estática.
- **Prisma:** ORM para Node.js e TypeScript, utilizado para a comunicação com o banco de dados.
- **PostgreSQL:** Banco de dados relacional.
- **Express.js:** Framework para a criação da API REST.
- **Commander.js:** Framework para a construção da interface de linha de comando.
- **GoogleCloud** Projeto está hospedado em uma VM dos serviços da google

## Acesso página web 

- https://hkt7wcgp-3000.use.devtunnels.ms/


## Arquitetura em Camadas (N-Tier)

O projeto é estruturado em camadas para separar as responsabilidades e facilitar a manutenção e escalabilidade.

- **Entidades (`entities`):** Define as estruturas de dados principais da aplicação.
  - `Appointment.ts`: Representa um compromisso.

- **Repositórios (`repos`):** Camada de acesso a dados. Abstrai a lógica de consulta e manipulação do banco de dados.
  - `AppointmentRepo.ts`: Implementa as operações de banco de dados para os compromissos, utilizando o Prisma.

- **Serviços (`services`):** Contém a lógica de negócio da aplicação.
  - `AppointmentService.ts`: Orquestra as operações relacionadas a compromissos, como validações e interações com o repositório.

- **Adaptadores (`web` e `cli`):** Pontos de entrada da aplicação que adaptam as requisições externas para chamadas de serviço.
  - `web/server.ts`: Uma API REST criada com Express para interação via HTTP.
  - `cli/index.ts`: Uma interface de linha de comando (CLI) para interação direta pelo terminal.
  - `public/`: Contém uma interface de usuário web simples para interagir com a API.

## Como Executar

### 1. Pré-requisitos

- Node.js instalado
- Uma instância do PostgreSQL em execução

### 2. Configuração do Banco de Dados

Crie um arquivo `.env` na raiz do projeto com a sua connection string do PostgreSQL. O Prisma a utilizará para se conectar ao banco.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3. Instalação das Dependências

Execute o comando abaixo para instalar as dependências do projeto:

```bash
npm install
```

### 4. Executar as Migrations do Prisma

Para criar as tabelas no banco de dados, execute a migração do Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Executar a Aplicação

A aplicação pode ser executada de três formas:

**a) Servidor Web (API REST)**

Inicia o servidor na porta 3000.

```bash
npx tsx web/server.ts
```

Após iniciar, você pode acessar a interface web em `http://localhost:3000` ou usar as rotas da API.

**b) Interface de Linha de Comando (CLI)**

Execute o comando `tsx` seguido do caminho do arquivo CLI e dos subcomandos desejados.

```bash
# Exemplo para adicionar um compromisso
npx tsx cli/index.ts adicionar "01/12/2025" "14:00" "15:00" "Reunião de equipe"

# Exemplo para listar os compromissos
npx tsx cli/index.ts listar
```

## Funcionalidades

### API REST

- **`POST /compromissos`**: Adiciona um novo compromisso.
  - **Corpo da Requisição (JSON):**
    ```json
    {
      "data": "01/12/2025",
      "hora_inicio": "14:00",
      "hora_fim": "15:00",
      "description": "Reunião de equipe"
    }
    ```

- **`GET /compromissos`**: Lista todos os compromissos cadastrados.

### Interface de Linha de Comando (CLI)

- **`adicionar <data> <hora_inicio> <hora_fim> <descricao>`**: Adiciona um novo compromisso.
  - Argumentos:
    - `data`: Data no formato `dd/mm/aaaa`.
    - `hora_inicio`: Hora de início no formato `hh:mm`.
    - `hora_fim`: Hora de término no formato `hh:mm`.
    - `descricao`: Descrição do compromisso.

- **`listar`**: Lista todos os compromissos.

## Estrutura do Projeto

```
.
├── cli/
│   └── index.ts          # Lógica da Interface de Linha de Comando (CLI)
├── entities/
│   └── Appointment.ts    # Definição da entidade de Compromisso
├── lib/
│   └── prisma.ts         # Configuração do cliente Prisma
├── prisma/
│   └── schema.prisma     # Esquema do banco de dados Prisma
├── public/
│   ├── app.js            # Lógica do frontend
│   └── index.html        # Página web para interagir com a API
|   |__ style.css         # Estilização 
├── repos/
│   └── AppointmentRepo.ts # Repositório para a entidade Appointment
├── services/
│   └── AppointmentService.ts # Serviço com a lógica de negócio para compromissos
└── web/
    └── server.ts         # Servidor web Express (API REST)
```
