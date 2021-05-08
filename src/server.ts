import express, { response } from 'express';

const app = express();

/*
   GET -> Buscar
   POST -> Salvar
   PUT -> Alterar
   DELETE -> Deletar
   PATCH -> Alteração específica
*/

app.get("/", (req, res) => {
   return res.json({message: "Hello world"})
});

app.post("/", (req, res) => {
   //Recebeu dados
   return res.json({ message: "É isso aí" })
})

app.listen(3333, () => console.log("Server is Running"));