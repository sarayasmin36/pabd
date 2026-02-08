const express = require('express');
const router = express.Router();
const conexao = require('../db');

router.get('/', (req, res) => {
    const sql = `
        SELECT 
            v.id_venda,
            v.data_venda,
            v.valor,
            c.nome AS cliente,
            f.nome AS funcionario,
            p.nome_produto,
            pv.quantidade
        FROM tb_venda v
        JOIN tb_cliente c ON v.id_cliente = c.id_cliente
        JOIN tb_funcionario f ON v.id_funcionario = f.id_funcionario
        JOIN produto_venda pv ON pv.id_venda = v.id_venda
        JOIN produto p ON pv.id_produto = p.id_produto
        ORDER BY v.id_venda DESC
    `;

    conexao.query(sql, (err, rows) => {
        if (err) throw err;

        const vendas = [];
        const mapa = {};

        rows.forEach(row => {
            if (!mapa[row.id_venda]) {
                mapa[row.id_venda] = {
                    id_venda: row.id_venda,
                    data_venda: row.data_venda,
                    valor: row.valor,
                    cliente: row.cliente,
                    funcionario: row.funcionario,
                    produtos: []
                };
                vendas.push(mapa[row.id_venda]);
            }
            mapa[row.id_venda].produtos.push({
                nome: row.nome_produto,
                quantidade: row.quantidade
            });
        });

        res.render('vendas/listar', { vendas });
    });
});


router.get('/cadastro', (req, res) => {

    conexao.query('SELECT * FROM tb_cliente', (err, clientes) => {
        if (err) throw err;

        conexao.query('SELECT * FROM produto', (err, produtos) => {
            if (err) throw err;

            

            conexao.query(`
                SELECT f.*
                FROM tb_funcionario f
                JOIN tb_setor s ON f.id_setor = s.id_setor
                WHERE s.nome_setor = 'Vendas'
            `, (err, funcionarios) => {
                if (err) throw err;

                

                res.render('vendas/cadastro', {
                    clientes,
                    produtos,
                    funcionarios
                });
            });
        });
    });
});



// Salvar venda
router.post('/salvar', (req, res) => {
    const { data_venda, id_cliente, id_funcionario, valor, produtos } = req.body;

    const sqlVenda = `
        INSERT INTO tb_venda (data_venda, valor, id_cliente, id_funcionario)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(sqlVenda, [data_venda, valor, id_cliente, id_funcionario], (err, result) => {
        if (err) throw err;

        const id_venda = result.insertId;

        const sqlProduto = `
            INSERT INTO produto_venda (id_venda, id_produto, quantidade, preco_unitario)
            VALUES ?
        `;

        const valores = produtos.map(p => [
            id_venda,
            parseInt(p.id_produto),
            parseInt(p.quantidade),
            parseFloat(p.preco)
        ]);

        conexao.query(sqlProduto, [valores], err => {
            if (err) throw err;

            produtos.forEach(p => {
                const sqlEstoque = `
                    UPDATE produto
                    SET estoque = estoque - ?
                    WHERE id_produto = ?
                `;
                conexao.query(sqlEstoque, [parseInt(p.quantidade), parseInt(p.id_produto)], err => {
                    if (err) throw err;
                });
            });

            res.redirect('/vendas');
        });
    });
});

// Excluir venda e devolver estoque
router.post('/excluir/:id', (req, res) => {
    const id_venda = req.params.id;

    // 1. Buscar produtos da venda
    const sqlBuscar = `
        SELECT id_produto, quantidade
        FROM produto_venda
        WHERE id_venda = ?
    `;

    conexao.query(sqlBuscar, [id_venda], (err, produtos) => {
        if (err) throw err;

        // 2. Devolver estoque
        produtos.forEach(p => {
            const sqlEstoque = `
                UPDATE produto
                SET estoque = estoque + ?
                WHERE id_produto = ?
            `;
            conexao.query(sqlEstoque, [p.quantidade, p.id_produto], err => {
                if (err) throw err;
            });
        });

        // 3. Excluir produtos da venda
        const sqlDeleteProdutos = `
            DELETE FROM produto_venda
            WHERE id_venda = ?
        `;

        conexao.query(sqlDeleteProdutos, [id_venda], err => {
            if (err) throw err;

            // 4. Excluir venda
            const sqlDeleteVenda = `
                DELETE FROM tb_venda
                WHERE id_venda = ?
            `;

            conexao.query(sqlDeleteVenda, [id_venda], err => {
                if (err) throw err;

                res.redirect('/vendas');
            });
        });
    });
});


module.exports = router;
