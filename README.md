<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<h1>Projeto OLT Upload Logs</h1>

<p>Este projeto foi desenvolvido utilizando Node.js para o backend, React para o frontend e PostgreSQL como banco de dados.</p>

<h2>Clonar Repositório</h2>
<p>Clone o repositório e entre na pasta do projeto:</p>
<pre><code>git clone https://github.com/PSilva25/olt-upload-logs.git
cd olt-upload-logs</code></pre>

<h2>Instalação</h2>

<h3>Backend (Node.js)</h3>
<pre><code>cd file-upload-backend
npm install  
npm install cors dotenv express-fileupload express nodemon pg sequelize-cli sequelize
</code></pre>

<h3>Frontend (React)</h3>
<pre><code>cd file-upload-frontend
npm install
npm install antd axios moment react-dom react-scripts react
</code></pre>

<h1>Configuração do Banco de Dados PostgreSQL</h1>

<p>Para configurar o banco de dados PostgreSQL para este projeto, siga os passos abaixo:</p>

<h2>Passos para Configuração do Banco de Dados</h2>

<h3>1. Instalação do PostgreSQL</h3>
<p>Se você ainda não tem o PostgreSQL instalado, faça o download e instalação a partir do <a href="https://www.postgresql.org/download/" target="_blank">site oficial do PostgreSQL</a>.</p>

<h3>2. Criação do Banco de Dados e Usuário</h3>
<p>Crie um banco de dados PostgreSQL com o nome especificado em <code>DB_DATABASE</code> (por exemplo, <code>dev_db</code>) e um usuário com permissões adequadas. Você pode usar o <a href="https://www.postgresql.org/docs/current/sql-createdatabase.html" target="_blank">comando CREATE DATABASE</a> e <a href="https://www.postgresql.org/docs/current/sql-createuser.html" target="_blank">comando CREATE USER</a> no console do PostgreSQL ou em uma ferramenta de administração como o pgAdmin.</p>

<h3>3. Configuração das Variáveis de Ambiente</h3>
<p>No ambiente Node.js, configure as seguintes variáveis de ambiente no arquivo <code>.env</code> na raiz do seu projeto:</p>

<pre><code>DB_USERNAME=dev_user
DB_PASSWORD=dev_password
DB_DATABASE=dev_db
DB_HOST=127.0.0.1
DB_DIALECT=postgres
PORT=3000</code></pre>

<p>Substitua os valores acima pelos detalhes específicos do seu ambiente (nome de usuário, senha, nome do banco de dados, host, etc.). Essas variáveis serão utilizadas pelo seu aplicativo Node.js para se conectar ao banco de dados PostgreSQL.</p>

<h2>Executando o Projeto</h2>

<h3>Backend (Node.js)</h3>
<pre><code>cd file-upload-backend/src
node index.js</code></pre>

<h3>Frontend (React)</h3>
<pre><code>cd file-upload-frontend
npm start</code></pre>

<h2>Licença</h2>
<p>Este projeto está licenciado sob a MIT License. Consulte o arquivo LICENSE para mais detalhes.</p>

</body>
</html>
