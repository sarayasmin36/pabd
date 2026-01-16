const express = require('express');
const router = express.Router();
const conexao = require('../db');

router.get('/', (req, res) => {
    conexao.query('SELECT * FROM tb_cliente', (err, clientes) => {
        if (err) throw err;
        res.render('clientes/listar', { clientes });
    });
});

router.get('/cadastro', (req, res) => {
    res.render('clientes/cadastro');
});

router.post('/salvar', (req, res) => {
    const { nome, cpf, email, endereco } = req.body;
    const sql = `
        INSERT INTO tb_cliente (nome, cpf, email, endereco)
        VALUES (?, ?, ?, ?)
    `;
    conexao.query(sql, [nome, cpf, email, endereco], err => {
        if (err) throw err;
        res.redirect('/clientes');
    });
});

module.exports = router;
