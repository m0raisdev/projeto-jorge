import { Router } from "express";
import { pool } from "../database.js";

export const tecladosRouter = Router();

tecladosRouter.get("/", async (req, res) => {
  try {
    const [results] = await pool.query("select * from teclados");
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar teclados" });
  }
});

tecladosRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("select * from teclados where id=?", [
      id,
    ]);
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar teclados" });
  }
});

tecladosRouter.post("/", async (req, res) => {
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const tamanho = req.body.tamanho;
  const wired = req.body.wired;

  //na falta de informação if alerta
  if (!(marca && modelo && valor && tamanho && wired)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    const query = `
    INSERT INTO teclados (marca,modelo,valor,tamanho,wired)
    VALUES (?,?,?,?,?)
    `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      tamanho,
      wired,
    ]);

    //status 201 = criado com sucesso
    res.status(201).json({ id: results.insertId });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    //status 500 = erro
    res.status(500).json({ mensagem: "erro ao buscar teclados" });
  }
});

tecladosRouter.put("/:id", async (req, res) => {
  const id = req.params.id;

  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const tamanho = req.body.tamanho;
  const wired = req.body.wired;

  // && = and       // STATUS 400 = indica que não pode
  if (!(marca && modelo && valor && tamanho && wired)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    // query = consulta dados no banco
    const query = `
      UPDATE teclados
      SET marca = ?, 
      modelo = ?,
      valor = ?,
      tamanho = ?,
      wired = ?
      WHERE id = ?
  `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      tamanho,
      wired,
      id,
    ]);
    // STATUS 207 = USADO PARA VARIOS SERVIÇOS(MULTI SERVICES)
    res.status(207).json({
      mensagem: `teclados de id ${id} atualizado`,
      novoRegistro: req.body,
    });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar teclados" });
  }
});

tecladosRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("delete from teclados where id=?", [id]);
    res.status(200).json({ mensagem: `teclado de id ${id} deletado` });
  } catch (error) {
    console.error("error ao deletar teclado", error.stack);
    res.status(500).json({ mensagem: "erro ao deletar teclado" });
  }
});
