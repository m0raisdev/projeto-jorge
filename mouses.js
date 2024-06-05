import { Router } from "express";
import { pool } from "../database.js";

export const mousesRouter = Router();

mousesRouter.get("/", async (req, res) => {
  try {
    const [results] = await pool.query("select * from mouses");
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar mouses" });
  }
});

mousesRouter.get("/:id", async (req,res)=>{
  const id = req.params.id
  try {
    const [results] = await pool.query("select * from mouses where id=?",[id])
    res.status(200).json(results);
  }
  catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar mouses" });
  }
})

mousesRouter.post("/", async (req, res) => {
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const botoes = req.body.botoes;
  const wired = req.body.wired;
  const dpi = req.body.dpi;

  if (!(marca && modelo && valor && botoes && wired && dpi)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    const query = `
    INSERT INTO mouses (marca,modelo,valor,botoes,wired,dpi)
    VALUES (?,?,?,?,?,?)
    `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      botoes,
      wired,
      dpi,
    ]);
    res.status(201).json({ id: results.insertId  });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar mouses" });
  }
});

mousesRouter.put("/:id", async (req, res) => {
  const id = req.params.id;

  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const botoes = req.body.botoes;
  const wired = req.body.wired;
  const dpi = req.body.dpi;
  
  // && = and       // STATUS 400 = indica que não pode
  if (!(marca && modelo && valor && botoes && wired && dpi)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    // query = consulta dados no banco
    const query = `
      UPDATE mouses
      SET marca = ?, 
      modelo = ?,
      valor = ?,
      botoes = ?,
      wired = ?,
      dpi = ?
      WHERE id = ?
  `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      botoes,
      wired,
      dpi,
      id,
    ]);
    // STATUS 207 = USADO PARA VARIOS SERVIÇOS(MULTI SERVICES)
    res
      .status(207)
      .json({
        mensagem: `mouse de id ${id} atualizado`,
        novoRegistro: req.body,
      });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar mouse" });
  }
});


mousesRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("delete from mouses where id=?", [id]);
    res.status(200).json({ mensagem: `mouse de id ${id} deletado` });
  } catch (error) {
    console.error("error ao deletar mouse", error.stack);
    res.status(500).json({ mensagem: "erro ao deletar mouse" });
  }
});
