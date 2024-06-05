import { Router } from "express";
import { pool } from "../database.js";

export const processadoresRouter = Router();

processadoresRouter.get("/", async (req, res) => {
  try {
    const [results] = await pool.query("select * from processadores");
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar processadores" });
  }
});

processadoresRouter.get("/:id", async (req,res)=>{
  const id = req.params.id
  try {
    const [results] = await pool.query("select * from processadores where id=?",[id])
    res.status(200).json(results);
  }
  catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar processadores" });
  }
})

processadoresRouter.post("/", async (req, res) => {
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const frequencia = req.body.frequencia;
  const soquete = req.body.soquete;
  const nucleo = req.body.nucleo;

  if (!(marca && modelo && valor && frequencia && soquete && nucleo)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    const query = `
    INSERT INTO processadores (marca,modelo,valor,frequencia,soquete,nucleo)
    VALUES (?,?,?,?,?,?)
    `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      frequencia,
      soquete,
      nucleo,
    ]);
    res.status(201).json({ id: results.insertId  });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar processadores" });
  }
});


processadoresRouter.put("/:id", async (req, res) => {
  const id = req.params.id;

  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const frequencia = req.body.frequencia;
  const soquete = req.body.soquete;
  const nucleo = req.body.nucleo;
  
  // && = and       // STATUS 400 = indica que não pode
  if (!(marca && modelo && valor && frequencia && soquete && nucleo)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    // query = consulta dados no banco
    const query = `
      UPDATE processadores
      SET marca = ?, 
      modelo = ?,
      valor = ?,
      frequencia = ?,
      soquete = ?,
      nucleo = ?
      WHERE id = ?
  `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      frequencia,
      soquete,
      nucleo,
      id,
    ]);
    // STATUS 207 = USADO PARA VARIOS SERVIÇOS(MULTI SERVICES)
    res
      .status(207)
      .json({
        mensagem: `processador de id ${id} atualizado`,
        novoRegistro: req.body,
      });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar processador" });
  }
});


processadoresRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("delete from processadores where id=?", [id]);
    res.status(200).json({ mensagem: `processador de id ${id} deletado` });
  } catch (error) {
    console.error("error ao deletar processador", error.stack);
    res.status(500).json({ mensagem: "erro ao deletar processador" });
  }
});
