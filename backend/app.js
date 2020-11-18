const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Cliente = require('./models/cliente');
const dadosDeAcesso = require("./dados_de_acesso");
mongoose.connect('mongodb+srv://'+dadosDeAcesso.usuario+':'+dadosDeAcesso.senha+'@cluster0.skf8n.mongodb.net/app-mean?retryWrites=true&w=majority')
  .then(() => {
    console.log("Conexão OK")
  })
  .catch(() => {
    console.log("Conexão NOK")
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.get('/api/clientes', (req, res, next) => { //lista de clientes
  Cliente.find().then(documents => {
    console.log(documents)
    res.status(200).json({
      mensagem: "Tudo OK",
      clientes: documents
    });
  })
});

app.get('/api/clientes/:id', (req, res, next) => { // dados do cliente que foi alterado
  Cliente.findById(req.params.id).then(cli => {
    if (cli)
      res.status(200).json(cli);
    else
      res.status(404).json({mensagem: "cliente não encontrado"})
  })
});

app.post('/api/clientes', (req, res, next) => {
  const cliente = new Cliente({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  })
  cliente.save().then(clienteInserido => {
    res.status(201).json({
      mensagem: 'Cliente inserido',
      id: clienteInserido._id
    })
  })
});

app.delete ('/api/clientes/:id', (req, res, next) => {
  Cliente.deleteOne ({_id: req.params.id}).then((resultado) => {
    console.log (resultado);
    res.status(200).json({mensagem: "Cliente removido"})
  });
});

app.put("/api/clientes/:id", (req, res, next) => {
  const cliente = new Cliente({
    _id: req.params.id,
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  });
  Cliente.updateOne({_id: req.params.id}, cliente)
  .then ((resultado) => {
    console.log(resultado)
  });
  res.status(200).json({mensagem: 'Atualização realizada com sucesso!'})
})

module.exports = app;
