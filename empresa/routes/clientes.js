const express = require('express');
const router = express.Router();
const conexao = require('../db');


// ============================
// LISTAR
// ============================
router.get('/', (req, res) => {

    const sql = `
        SELECT c.*,
               COUNT(v.id_venda) AS total_vendas
        FROM tb_cliente c
        LEFT JOIN tb_venda v 
            ON v.id_cliente = c.id_cliente
        GROUP BY c.id_cliente
    `;

    conexao.query(sql, (err, clientes) => {
        if (err) throw err;
        res.render('clientes/listar', { clientes });
    });

});


// ============================
// FORM CADASTRO
// ============================
router.get('/cadastro', (req, res) => {
    res.render('clientes/cadastro');
});


// ============================
// SALVAR
// ============================
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


// ============================
// FORM EDITAR
// ============================
router.get('/editar/:id', (req, res) => {

    const id = req.params.id;

    conexao.query(
        'SELECT * FROM tb_cliente WHERE id_cliente = ?',
        [id],
        (err, resultado) => {

            if (err) throw err;

            if (resultado.length === 0) {
                return res.send('Cliente não encontrado');
            }

            res.render('clientes/editar', {
                cliente: resultado[0]
            });
        }
    );

});


// ============================
// ATUALIZAR
// ============================
router.post('/editar/:id', (req, res) => {

    const id = req.params.id;
    const { nome, cpf, email, endereco } = req.body;

    const sql = `
        UPDATE tb_cliente
        SET nome=?, cpf=?, email=?, endereco=?
        WHERE id_cliente=?
    `;

    conexao.query(
        sql,
        [nome, cpf, email, endereco, id],
        err => {
            if (err) throw err;
            res.redirect('/clientes');
        }
    );

});


// ============================
// EXCLUIR
// ============================
router.get('/excluir/:id', (req, res) => {

    const id = req.params.id;

    conexao.query(
        'SELECT COUNT(*) AS total FROM tb_venda WHERE id_cliente = ?',
        [id],
        (err, resultado) => {

            if (err) throw err;

            if (resultado[0].total > 0) {
                return res.send('Não é possível excluir: cliente possui vendas cadastradas.');
            }

            conexao.query(
                'DELETE FROM tb_cliente WHERE id_cliente = ?',
                [id],
                err => {
                    if (err) throw err;
                    res.redirect('/clientes');
                }
            );
        }
    );

});



module.exports = router;
