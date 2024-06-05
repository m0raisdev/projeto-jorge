import { Router } from "express";
import { pool } from "../database.js";

export const memoriasRouter = Router();

memoriasRouter.get("/", async (req, res) => {
  try {
    const [results] = await pool.query("select * from memorias");
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar memorias" });
  }
});

memoriasRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("select * from memorias where id=?", [
      id,
    ]);
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar memorias" });
  }
});

memoriasRouter.post("/", async (req, res) => {
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const qtdMemoria = req.body.qtd_memoria;

  if (!(marca && modelo && valor && qtdMemoria)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    const query = `
    INSERT INTO memorias (marca,modelo,valor,qtd_memoria)
    VALUES (?,?,?,?)
    `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      qtdMemoria,
    ]);
    res.status(201).json({ id: results.insertId });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar memorias" });
  }
});
memoriasRouter.put("/:id", async (req, res) => {
  const id = req.params.id;

  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const qtdMemoria = req.body.qtd_memoria;
  
  // && = and       // STATUS 400 = indica que não pode
  if (!(marca && modelo && valor && qtdMemoria)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    // query = consulta dados no banco
    const query = `
      UPDATE memorias
      SET marca = ?, 
      modelo = ?,
      valor = ?,
      qtd_memoria = ?
      WHERE id = ?
  `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      qtdMemoria,
      id,
    ]);
    // STATUS 207 = USADO PARA VARIOS SERVIÇOS(MULTI SERVICES)
    res
      .status(207)
      .json({
        mensagem: `memoria de id ${id} atualizado`,
        novoRegistro: req.body,
      });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar memoria" });
  }
});

memoriasRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("delete from memorias where id=?", [id]);
    res.status(200).json({ mensagem: `memoria de id ${id} deletado` });
  } catch (error) {
    console.error("error ao deletar memoria", error.stack);
    res.status(500).json({ mensagem: "erro ao deletar memoria" });
  }
});




