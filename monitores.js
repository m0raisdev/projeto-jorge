import { Router } from "express";
import { pool } from "../database.js";

export const monitoresRouter = Router();

monitoresRouter.get("/", async (req, res) => {
  try {
    const [results] = await pool.query("select * from monitores");
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar monitores" });
  }
});

monitoresRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("select * from monitores where id=?", [
      id,
    ]);
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar monitores" });
  }
});

monitoresRouter.post("/", async (req, res) => {
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const frequencia = req.body.frequencia;
  const painel = req.body.painel;
  const conectividade = req.body.conectividade;

  if (!(marca && modelo && valor && frequencia && painel && conectividade)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    const query = `
    INSERT INTO monitores (marca,modelo,valor,frequencia,painel,conectividade)
    VALUES (?,?,?,?,?,?)
    `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      frequencia,
      painel,
      conectividade,
    ]);
    res.status(201).json({ id: results.insertId  });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar monitores" });
  }
});

monitoresRouter.put("/:id", async (req, res) => {
  const id = req.params.id;

  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const frequencia = req.body.frequencia;
  const painel = req.body.painel;
  const conectividade = req.body.conectividade;
  
  // && = and       // STATUS 400 = indica que não pode
  if (!(marca && modelo && valor && frequencia && painel && conectividade)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    // query = consulta dados no banco
    const query = `
      UPDATE monitores
      SET marca = ?, 
      modelo = ?,
      valor = ?,
      frequencia = ?,
      painel = ?,
      conectividade = ?
      WHERE id = ?
  `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      frequencia,
      painel,
      conectividade,
      id,
    ]);
    // STATUS 207 = USADO PARA VARIOS SERVIÇOS(MULTI SERVICES)
    res
      .status(207)
      .json({
        mensagem: `monitor de id ${id} atualizado`,
        novoRegistro: req.body,
      });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar monitor" });
  }
});


monitoresRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("delete from monitores where id=?", [id]);
    res.status(200).json({ mensagem: `monitor de id ${id} deletado` });
  } catch (error) {
    console.error("error ao deletar monitor", error.stack);
    res.status(500).json({ mensagem: "erro ao deletar monitor" });
  }
});
