const express = require('express');
const router = express.Router();
const conexao = require('../db');

// Listar vendas (cliente + funcionário)
router.get('/', (req, res) => {
    const sql = `
        SELECT 
            v.id_venda,
            v.data_venda,
            v.valor,
            c.nome AS cliente,
            f.nome AS funcionario
        FROM tb_venda v
        JOIN tb_cliente c ON v.id_cliente = c.id_cliente
        JOIN tb_funcionario f ON v.id_funcionario = f.id_funcionario
    `;

    conexao.query(sql, (err, vendas) => {
        if (err) throw err;
        res.render('vendas/listar', { vendas });
    });
});

// Formulário de cadastro
router.get('/cadastro', (req, res) => {
    conexao.query('SELECT * FROM tb_cliente', (err, clientes) => {
        if (err) throw err;

        conexao.query('SELECT * FROM produto', (err, produtos) => {
            if (err) throw err;

            conexao.query('SELECT * FROM tb_funcionario', (err, funcionarios) => {
                if (err) throw err;

                res.render('vendas/cadastro', {
                    clientes,
                    produtos,
                    funcionarios   // ← ISSO resolve o erro
                });
            });
        });
    });
});


// Salvar venda
router.post('/salvar', (req, res) => {
    const { data_venda, valor, id_cliente, id_funcionario } = req.body;

    const sql = `
        INSERT INTO tb_venda (data_venda, valor, id_cliente, id_funcionario)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [data_venda, valor, id_cliente, id_funcionario],
        err => {
            if (err) throw err;
            res.redirect('/vendas');
        }
    );
});

module.exports = router;
