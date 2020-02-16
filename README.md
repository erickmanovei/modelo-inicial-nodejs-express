# SOBRE #

Esse projeto se trata da configuração inicial necessária para qualquer projeto que necessite de autenticação, em NodeJS com Express.

### Plugins Utilizados ###

* Nodemon - colocado em dev, serve como servidor que se reconecta. Necessário adicionar comando no scripts
do Package.json, assim: "dev": "nodemon src/server.js".

* sucrase - colocado em dev, permite a utilização da forma de importação como import talcoisa from talcoisa
ao invés de usar o require. Também altera a forma de exportação para export default. Necessário adicionar
comando no scripts do Package.json, assim: "dev": "nodemon src/server.js". Além disso, deve-se criar um
arquivo nodemon.json na raiz com o conteúdo:
{
	"execMap": {
		"js": "node -r sucrase/register"
	}
}
* Caso for utilizar o processo de debug, também precisa alterar um script em Package.json assim:
"dev:debug": "nodemon --inspect src/server.js"
Depois deve ir na opção de debug do vscode, clicar em Create a launch.json file, escolher a
opção Node.js e deixar o conteúdo do arquivo como segue:
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "attach",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "restart": true,
            "protocol": "inspector"
        }
    ]
}

* eslint - colocado em dev, pacote para mantimento de padrões de código. Para instalar deve-se rodar o
"yarn add eslint -D" e em seguida o "yarn eslint --init". Selecionar a opção
"Check syntax, find problems and enforce code style".
Depois escolher "javascript modules";
Depois escolher a linguagem (no caso de node.js escolher none of these);
Depois dizer que não está usando typescript;
Depois informar que está utiliando no Node, e não no browser (usar barra de espaço para deselecionar um e
selecionar outro)
Depois selecionar Use a Popular Style Guide;
Depois Airbnb;
Depois Javascript;
Depois pergunta se quer instalar automaticamente as dependências, escolhe Y;
Ele vai instalar as dependências pelo npm e gerar o arquivo package-lock.json. Como não usamos npm, mas sim
o yarn, devemos excluir esse arquivo e rodar novamente o comando "yarn".
Feito isso, ele gerou um arquivo .eslintrc.js (é preciso ter a extenção eslint instalada do VSCODE).
Para que o eslint realize as correções automaticamente, deve-se entrar nas configurações do vscode
dando um Command+shift+P, escrever json e escolher Preferences: Open Settings (JSON) e adicionar esse
conteúdo, CASO AINDA NÃO EXISTIR LÁ:
"[javascript]": {
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
    }
},
"[javascriptreact]": {
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
    }
}
O conteúdo do objeto rules do arquivo .eslintrc.js deve ficar assim:
rules: {
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "camelcase": "off",
    "no-unused-vars": ["error", {"argsIgnorePattern": "next"}]
}

* prettier - colocado em dev, deixa o codigo mais bonito. Deve-se instalar junto com o
* eslint-config-prettier e o eslint-plugin-prettier, ficando assim o comando de instalação:
yarn add prettier -D
yarn add eslint-config-prettier -D
yarn add eslint-plugin-prettier -D
Depois edita o arquivo .eslintrc.js substituindo o extends e adicionando o plugins, ficando como abaixo:
extends: ['airbnb-base', 'prettier'],
plugins: ['prettier'],
E dentro desse mesmo arquivo, no objeto rules, adicionar:
"prettier/prettier": "error",
Agora deve-se criar um arquivo chamado .prettierrc com o conteúdo:
{
    "singleQuote": true,
    "trailingComma": "es5"
}
Para realizar um fix em todo o projeto e não ficar dando erro em arquivo por arquivo por conta de padrão,
pode-se rodar o comando:
yarn eslint --fix src --ext .js

* editorconfig - Adaptar padrões em qualquer editor. Deve-se instalar essa extenção no VSCODE.
De posse da extensão, deve-se clicar com o botão direito na raiz do projeto e selecionar
Generate .editorconfig
Deve-se colocar esses valores neste arquivo gerado:
indent_size = 2
trim_trailing_whitespace = true
insert_final_newline = true

* sequelize - banco de dados com migrations e seeds
Deve-se criar um arquivo na raiz chamado .sequelizerc que será responsável por informar os caminhos dos
arquivos. Deve ficar com conteúdo assim:
//inicio
const { resolve } = require('path');

module.exports = {
  config: resolve(__dirname, 'src', 'config', 'database.js'),
  'models-path': resolve(__dirname, 'src', 'app', 'models'),
  'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': resolve(__dirname, 'src', 'database', 'seeds'),
}
//fim
Caso queira utiliar o banco de dados postgres, deve-se instalar os pacotes pg e pg-hstore.
Caso queira utiliar o banco de dados mysql, deve-se instalar o pacote mysql2.


* sequelize-cli - colocado em dev, interface de linha de comando para criar migrations, executa-las etc

* bcryptjs - geração de hash de senha

* jsonwebtoken - para geração de tokens JWT

* yup - validação de dados

* multer - Upload de arquivos

* date-fns@next - lidar com datas

* mongoose - conexão com banco de dados mongodb

* nodemailer - envio de emails

* express-handlebars e nodemailer-express-handlebars - Template engine para envio de e-mails em html estilizado

* bee-queue - gerenciador de filas compativel com redis

* express-async-errors - resolve problemas de erros assíncronos

https://sentry.io/ sistema de monitorament de erros

* youch - trata mensagens de erro

* dotenv - fazer funcionar o arquivo .env
