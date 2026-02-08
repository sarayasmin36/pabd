const express = require('express');
const router = express.Router();
const conexao = require('../db');


// ============================
// LISTAR
// ============================
router.get('/', (req, res) => {

    const sql = `
        SELECT f.id_funcionario, f.nome, f.salario,
               c.nome_cargo, s.nome_setor,
               COUNT(v.id_venda) AS total_vendas
        FROM tb_funcionario f
        JOIN cargo c ON f.id_cargo = c.id_cargo
        JOIN tb_setor s ON f.id_setor = s.id_setor
        LEFT JOIN tb_venda v
            ON v.id_funcionario = f.id_funcionario
        GROUP BY f.id_funcionario
    `;

    conexao.query(sql, (err, funcionarios) => {
        if (err) throw err;
        res.render('funcionarios/listar', { funcionarios });
    });

});


// ============================
// FORM CADASTRO
// ============================
router.get('/cadastro', (req, res) => {

    const sqlCargo = "SELECT * FROM cargo";
    const sqlSetor = "SELECT * FROM tb_setor";

    conexao.query(sqlCargo, (err, cargos) => {
        if (err) throw err;

        conexao.query(sqlSetor, (err, setores) => {
            if (err) throw err;

            res.render('funcionarios/cadastro', { cargos, setores });
        });
    });

});


// ============================
// SALVAR
// ============================
router.post('/salvar', (req, res) => {

    const { nome, salario, data_admissao, id_cargo, id_setor } = req.body;

    const sql = `
        INSERT INTO tb_funcionario
        (nome, salario, data_admissao, id_cargo, id_setor)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [nome, salario, data_admissao, id_cargo, id_setor],
        err => {
            if (err) throw err;
            res.redirect('/funcionarios');
        }
    );

});


// ============================
// FORM EDITAR
// ============================
router.get('/editar/:id', (req, res) => {

    const id = req.params.id;

    const sqlFuncionario = `
        SELECT * FROM tb_funcionario
        WHERE id_funcionario = ?
    `;

    const sqlCargo = "SELECT * FROM cargo";
    const sqlSetor = "SELECT * FROM tb_setor";

    conexao.query(sqlFuncionario, [id], (err, funcionarioResult) => {
        if (err) throw err;

        if (funcionarioResult.length === 0) {
            return res.send('Funcionário não encontrado');
        }

        conexao.query(sqlCargo, (err, cargos) => {
            if (err) throw err;

            conexao.query(sqlSetor, (err, setores) => {
                if (err) throw err;

                res.render('funcionarios/editar', {
                    funcionario: funcionarioResult[0],
                    cargos,
                    setores
                });

            });
        });
    });

});


// ============================
// ATUALIZAR
// ============================
router.post('/editar/:id', (req, res) => {

    const id = req.params.id;
    const { nome, salario, data_admissao, id_cargo, id_setor } = req.body;

    const sql = `
        UPDATE tb_funcionario
        SET nome=?, salario=?, data_admissao=?, id_cargo=?, id_setor=?
        WHERE id_funcionario=?
    `;

    conexao.query(
        sql,
        [nome, salario, data_admissao, id_cargo, id_setor, id],
        err => {
            if (err) throw err;
            res.redirect('/funcionarios');
        }
    );

});


// ============================
// EXCLUIR (OPCIONAL FUTURO)
// ============================
router.get('/excluir/:id', (req, res) => {

    const id = req.params.id;

    conexao.query(
        'DELETE FROM tb_funcionario WHERE id_funcionario = ?',
        [id],
        err => {
            if (err) throw err;
            res.redirect('/funcionarios');
        }
    );

});



module.exports = router;
