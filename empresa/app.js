const express = require('express');
const bodyParser = require('body-parser');

const indexRoutes = require('./routes/index');
const funcionariosRoutes = require('./routes/funcionarios');
const produtosRoutes = require('./routes/produtos');
const clientesRoutes = require('./routes/clientes');
const vendasRoutes = require('./routes/vendas');
const fornecedoresRoutes = require('./routes/fornecedores');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Para arquivos CSS/JS

// Rotas
app.use('/', indexRoutes);
app.use('/funcionarios', funcionariosRoutes);
app.use('/produtos', produtosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/vendas', vendasRoutes);
app.use('/fornecedores', fornecedoresRoutes);

module.exports = app;
