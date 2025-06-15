# Encurtame - Encurtador de Links

Um encurtador de URLs criado com o objetivo de aplicar tecnologias modernas e aprimorar conhecimentos práticos. O projeto segue o padrão arquitetural **MVC (Model-View-Controller)** e inclui recursos de **cache**, **verificação de segurança**, **monitoramento de erros** e **rate limit** para proteger o sistema contra abusos.

## Tecnologias Utilizadas

* **Node.js** e **Express** — Servidor HTTP e roteamento.
* **MongoDB** — Banco de dados NoSQL para armazenar URLs encurtadas.
* **Redis** — Utilizado como cache:

  * Para respostas rápidas (consultas frequentes).
  * Para armazenar listas de sites **seguros** e **maliciosos**.
* **Google Safe Browsing API** — Verifica se a URL é maliciosa.
* **Sentry** — Monitoramento e rastreamento de erros.
* **Axios** — Comunicação com API externa e Frontend.
* **Rate Limit** — Controle de chamadas abusivas por IP.

## Estrutura de Pastas

```
encurtame/
├── src/
│   ├── cache/
│   │   └── redisClient.js
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── urlController.js
│   ├── models/
│   │   └── urlSchema.js
│   ├── routes/
│   │   └── urlRoutes.js
│   ├── sentry/
│   │   └── instrument.js
│   └── service/
│       └── safeBrowsingService.js
├── .gitignore
├── package.json
├── package-lock.json
├── app.js
└── server.js
```

## Funcionamento (Fluxo Lógico)

1. O usuário envia uma URL via `POST`.
2. O sistema verifica se é uma URL válida.
3. Em seguida, verifica o cache de resposta rápida (Redis).
4. Se não estiver no cache, verifica o banco de dados (MongoDB).
5. Caso ainda não encontrada, o sistema verifica:

   * Se está no **cache de sites seguros**.
   * Se está no **cache de sites maliciosos**.
   * Caso não esteja em nenhum, consulta a **API Google Safe Browsing**.
6. URLs seguras são:

   * Armazenadas nos caches apropriados.
   * Armazenadas no banco.
   * Encurtadas com `nanoid` e retornadas ao usuário.
7. URLs maliciosas são bloqueadas e não são encurtadas.

➡️ URLs inseguras **não** são processadas e retornam erro apropriado.

## Segurança

* Sistema previne encurtamento de links **maliciosos**.
* Armazena em cache para evitar requisições repetidas à API do Google.
* Limita chamadas abusivas com rate-limit.

## Instalação e Execução

1. Clone o repositório:

   ```bash
   git clone https://github.com/lucashrt/Encurtame-backend.git
   cd Encurtame-backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o arquivo `.env` com as seguintes variáveis:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/encurtame
   REDIS_URL=redis://localhost:6379
   SENTRY_DSN=Sua_DSN_do_Sentry
   GOOGLE_API_KEY=Sua_API_Key_do_Google
   ```

4. Inicie o servidor:

   ```bash
   npm start
   ```

## Principais Bibliotecas

```json
"dependencies": {
  "@sentry/node": "^9.28.1",
  "@sentry/profiling-node": "^9.28.1",
  "axios": "^1.9.0",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "express": "^5.1.0",
  "express-rate-limit": "^7.5.0",
  "mongoose": "^8.15.1",
  "nanoid": "^5.1.5",
  "redis": "^5.5.6"
}
```
## Diagrama de Fluxo

Abaixo está o fluxo de funcionamento do Encurtame, desde o recebimento da URL até a entrega do link encurtado:

![Fluxo do Encurtame](https://i.imgur.com/iEnSiiv.png)


Desenvolvido por **Lucas Hartmann**
