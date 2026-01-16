const express = require('express');
const router = express.Router();
const conexao = require('../db');

// Listar funcionários
router.get('/', (req, res) => {
    const sql = `
        SELECT f.id_funcionario, f.nome, f.salario,
               c.nome_cargo, s.nome_setor
        FROM tb_funcionario f
        JOIN cargo c ON f.id_cargo = c.id_cargo
        JOIN tb_setor s ON f.id_setor = s.id_setor
    `;
    conexao.query(sql, (err, funcionarios) => {
        if (err) throw err;
        res.render('funcionarios/listar', { funcionarios });
    });
});

// Formulário de cadastro
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

// Salvar funcionário
router.post('/salvar', (req, res) => {
    const { nome, salario, data_admissao, id_cargo, id_setor } = req.body;
    const sql = `
        INSERT INTO tb_funcionario
        (nome, salario, data_admissao, id_cargo, id_setor)
        VALUES (?, ?, ?, ?, ?)
    `;
    conexao.query(sql, [nome, salario, data_admissao, id_cargo, id_setor], err => {
        if (err) throw err;
        res.redirect('/funcionarios');
    });
});

module.exports = router;
