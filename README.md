# 📊 Live Insights App 

Bem-vindo ao **Live Insights App**! 😎

## 🚀 Primeiros Passos 

1. **Instale as dependências** 

   ```bash
   npm install
   ```

2. **Dê a partida no projeto** 

    ```bash
    npm start
    ```

3. **Agora, é só abrir seu navegador e acessar:**

    http://localhost:3000

A página vai recarregar automaticamente quando fizer mudanças. 

## 🔑 Criando usuário pela primeira vez

Para criar um usuário, você deverá realizar um cadastro através da seguinte rota:

`http://localhost:3000/register`

<img width="1270" alt="image" src="https://github.com/user-attachments/assets/a5e82729-fb0f-45e6-8f02-7e20f93290e3" />

## Realizando o Login

Para realizar o login, você deverá acessar a seguinte rota, entrando com um usuário já cadastrado:

`http://localhost:3000/login`

<img width="1270" alt="image" src="https://github.com/user-attachments/assets/afe9f5c1-8152-4211-9c35-1ec8797520a7" />

## Home

A tela inicial conta com o dashboard com os cards das lives já cadastradas.

`http://localhost:3000/client/lives`

<img width="1270" alt="image" src="https://github.com/user-attachments/assets/b8ad64c1-beb7-4ef4-b3dc-38a8d40bf150" />

Também é possível realizar o cadastro de uma nova live:

<img width="1270" alt="image" src="https://github.com/user-attachments/assets/ab6c3edc-9f79-464a-8c6b-61ba271af063" />

Ao clicar em um card de live, temos a análise realizada para ela:

`http://localhost:3000/client/lives/JezdYmFAst8`

<img width="1270" alt="image" src="https://github.com/user-attachments/assets/072e9884-8fb3-4af4-9ba3-88556c2019a6" />

Também podemos acessar e filtrar os comentários que foram efetivamente realizados, tanto por Sentimento quanto por Interação:

<img width="1270" height="1037" alt="image" src="https://github.com/user-attachments/assets/99033a43-9144-4584-bed4-4adb5c54b243" />

## BackEnd

Você pode conferir o código do backend aqui:
https://github.com/live-insights/back-end

