const express = require('express');
const router = express.Router();
const conexao = require('../db');


// ================= LISTAR =================
router.get('/', (req, res) => {

    const sql = `
        SELECT 
            p.id_produto,
            p.nome_produto,
            p.preco,
            p.estoque,
            c.nome_categoria,
            f.nome_fornecedor,
            COUNT(pv.id_venda) AS total_vendas
        FROM produto p
        JOIN categoria c ON p.id_categoria = c.id_categoria
        JOIN fornecedor f ON p.id_fornecedor = f.id_fornecedor
        LEFT JOIN produto_venda pv ON pv.id_produto = p.id_produto
        GROUP BY 
            p.id_produto,
            p.nome_produto,
            p.preco,
            p.estoque,
            c.nome_categoria,
            f.nome_fornecedor
            ORDER BY p.nome_produto ASC
    `;

    conexao.query(sql, (err, produtos) => {
        if (err) {
            console.log(err);
            return res.send('Erro ao listar produtos');
        }

        res.render('produtos/listar', { produtos });
    });
});


// ================= CADASTRO =================
router.get('/cadastro', (req, res) => {

    conexao.query('SELECT * FROM categoria', (err, categorias) => {
        if (err) return res.send('Erro categorias');

        conexao.query('SELECT * FROM fornecedor', (err, fornecedores) => {
            if (err) return res.send('Erro fornecedores');

            res.render('produtos/cadastro', {
                categorias,
                fornecedores
            });
        });
    });
});


// ================= SALVAR =================
router.post('/salvar', (req, res) => {

    const { nome_produto, preco, estoque, id_categoria, id_fornecedor } = req.body;

    const sql = `
        INSERT INTO produto
        (nome_produto, preco, estoque, id_categoria, id_fornecedor)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [nome_produto, preco, estoque, id_categoria, id_fornecedor],
        err => {
            if (err) {
                console.log(err);
                return res.send('Erro ao salvar');
            }

            res.redirect('/produtos');
        }
    );
});


// ================= EDITAR =================
router.get('/editar/:id', (req, res) => {

    const id = req.params.id;

    conexao.query(
        'SELECT * FROM produto WHERE id_produto = ?',
        [id],
        (err, produto) => {

            if (err || produto.length === 0) {
                return res.send('Produto não encontrado');
            }

            conexao.query('SELECT * FROM categoria', (err, categorias) => {
                if (err) return res.send('Erro categorias');

                conexao.query('SELECT * FROM fornecedor', (err, fornecedores) => {
                    if (err) return res.send('Erro fornecedores');

                    res.render('produtos/editar', {
                        produto: produto[0],
                        categorias,
                        fornecedores
                    });
                });
            });
        }
    );
});


// ================= ATUALIZAR =================
router.post('/atualizar/:id', (req, res) => {

    const id = req.params.id;
    const { nome_produto, preco, estoque, id_categoria, id_fornecedor } = req.body;

    const sql = `
        UPDATE produto 
        SET nome_produto = ?,
            preco = ?,
            estoque = ?,
            id_categoria = ?,
            id_fornecedor = ?
        WHERE id_produto = ?
    `;

    conexao.query(
        sql,
        [nome_produto, preco, estoque, id_categoria, id_fornecedor, id],
        err => {

            if (err) {
                console.log(err);
                return res.send('Erro ao atualizar');
            }

            res.redirect('/produtos');
        }
    );
});


// ================= EXCLUIR =================
router.post('/excluir/:id', (req, res) => {

    const id = req.params.id;

    conexao.query(
        'DELETE FROM produto WHERE id_produto = ?',
        [id],
        err => {

            if (err) {
                console.log(err);
                return res.send('Erro ao excluir, há uma venda com o produto');
            }

            res.redirect('/produtos');
        }
    );
});


module.exports = router;
