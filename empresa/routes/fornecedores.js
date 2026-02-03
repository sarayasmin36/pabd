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

router.get('/editar/:id', (req, res) => {
    const id = req.params.id;

    conexao.query(
        'SELECT * FROM fornecedor WHERE id_fornecedor = ?',
        [id],
        (err, resultado) => {
            if (err) throw err;

            if (resultado.length === 0) {
                return res.send('Fornecedor não encontrado');
            }

            res.render('fornecedores/editar', {
                fornecedor: resultado[0]
            });
        }
    );
});

router.post('/editar/:id', (req, res) => {
    const id = req.params.id;
    const { nome_fornecedor, telefone, email, cnpj } = req.body;

    const sql = `
        UPDATE fornecedor
        SET nome_fornecedor=?, telefone=?, email=?, cnpj=?
        WHERE id_fornecedor=?
    `;

    conexao.query(
        sql,
        [nome_fornecedor, telefone, email, cnpj, id],
        err => {
            if (err) throw err;
            res.redirect('/fornecedores');
        }
    );
});

router.get('/excluir/:id', (req, res) => {
    const id = req.params.id;

    conexao.query(
        'DELETE FROM fornecedor WHERE id_fornecedor = ?',
        [id],
        err => {
            if (err) throw err;
            res.redirect('/fornecedores');
        }
    );
});

module.exports = router;
