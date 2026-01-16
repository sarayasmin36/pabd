const express = require('express');
const router = express.Router();
const conexao = require('../db');

router.get('/', (req, res) => {
    conexao.query('SELECT * FROM fornecedor', (err, fornecedores) => {
        if (err) throw err;
        res.render('fornecedores/listar', { fornecedores });
    });
});

router.get('/cadastro', (req, res) => {
    res.render('fornecedores/cadastro');
});

router.post('/salvar', (req, res) => {
    const { nome_fornecedor, telefone, email, cnpj } = req.body;
    const sql = `
        INSERT INTO fornecedor (nome_fornecedor, telefone, email, cnpj)
        VALUES (?, ?, ?, ?)
    `;
    conexao.query(sql, [nome_fornecedor, telefone, email, cnpj], err => {
        if (err) throw err;
        res.redirect('/fornecedores');
    });
});

module.exports = router;
