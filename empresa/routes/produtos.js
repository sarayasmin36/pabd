const express = require('express');
const router = express.Router();
const conexao = require('../db');

// Listar
router.get('/', (req, res) => {
    const sql = `
        SELECT p.id_produto, p.nome_produto, p.preco, p.estoque,
               c.nome_categoria, f.nome_fornecedor
        FROM produto p
        JOIN categoria c ON p.id_categoria = c.id_categoria
        JOIN fornecedor f ON p.id_fornecedor = f.id_fornecedor
    `;
    conexao.query(sql, (err, produtos) => {
        if (err) throw err;
        res.render('produtos/listar', { produtos });
    });
});

// Formulário de cadastro
router.get('/cadastro', (req, res) => {
    conexao.query('SELECT * FROM categoria', (err, categorias) => {
        if (err) throw err;
        conexao.query('SELECT * FROM fornecedor', (err, fornecedores) => {
            if (err) throw err;
            res.render('produtos/cadastro', { categorias, fornecedores });
        });
    });
});

// Salvar
router.post('/salvar', (req, res) => {
    const { nome_produto, preco, estoque, id_categoria, id_fornecedor } = req.body;
    const sql = `
        INSERT INTO produto (nome_produto, preco, estoque, id_categoria, id_fornecedor)
        VALUES (?, ?, ?, ?, ?)
    `;
    conexao.query(sql, [nome_produto, preco, estoque, id_categoria, id_fornecedor], err => {
        if (err) throw err;
        res.redirect('/produtos');
    });
});

module.exports = router;
