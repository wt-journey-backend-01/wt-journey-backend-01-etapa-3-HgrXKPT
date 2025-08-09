## Como fazer o docker criar imagem
---

1- tenha o Docker Desktop

2- Use o comando docker-compose up -d(Tenha o arquivo docker-compose configurado)

---
## Criar migration e seeds

Primeiro instale o knex localmente com npm install knex pg

Rode npm install dotenv

Aplique as migrations que já estão configuradas com o comando: npx knex migrate:latest

Faça o mesmo para as seeds já criadas:  npx knex seed:run

## Pronto, Código rodando 👌

## 🚨 IMPORANTE!!!!
Levei em consideração que tenha clonado o repositorio e tem todos arquivos já configurados.

