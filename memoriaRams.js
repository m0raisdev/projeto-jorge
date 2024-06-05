import { Router } from "express";
import { pool } from "../database.js";

export const memoriaRamsRouter = Router();

memoriaRamsRouter.get("/", async (req, res) => {
  try {
    const [results] = await pool.query("select * from memoria_rams");
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar memoriaRams" });
  }
});

memoriaRamsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query(
      "select * from memoria_rams where id=?",
      [id]
    );
    res.status(200).json(results);
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar memoriaRams" });
  }
});

memoriaRamsRouter.post("/", async (req, res) => {
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const qtdMemoriaRams = req.body.qtd_memoria_ram;
  const slot = req.body.slot;
  const frequencia = req.body.frequencia;

  if (!(marca && modelo && valor && qtdMemoriaRams && slot && frequencia)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    const query = `
    INSERT INTO memoria_rams (marca,modelo,valor,qtd_memoria_ram,slot,frequencia)
    VALUES (?,?,?,?,?,?)
    `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      qtdMemoriaRams,
      slot,
      frequencia,
    ]);

    //STATUS 201 (DEU CERTO)
    res.status(201).json({ id: results.insertId });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar memoriasRams" });
  }
});
//STATUS 500 (ERRO)

memoriaRamsRouter.put("/:id", async (req, res) => {
  const id = req.params.id;

  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const valor = req.body.valor;
  const qtdMemoriaRams = req.body.qtdMemoriaRams;
  const slot = req.body.slot;
  const frequencia = req.body.frequencia;

  // && = and       // STATUS 400 = indica que não pode
  if (!(marca && modelo && valor && qtdMemoriaRams && slot && frequencia)) {
    res.status(400).json({ mensagem: "faltou campo" });
    return;
  }

  try {
    // query = consulta dados no banco
    const query = `
      UPDATE memoria_rams
      SET marca = ?, 
      modelo = ?,
      valor = ?,
      qtd_memoria_ram = ?,
      slot = ?,
      frequencia = ?
      WHERE id = ?
  `;

    const [results] = await pool.query(query, [
      marca,
      modelo,
      valor,
      qtdMemoriaRams,
      slot,
      frequencia,
      id,
    ]);
    // STATUS 207 = USADO PARA VARIOS SERVIÇOS
    res
      .status(207)
      .json({
        mensagem: `memoriaRam de id ${id} atualizado`,
        novoRegistro: req.body,
      });
  } catch (error) {
    console.error("error ao executar a consulta", error.stack);
    res.status(500).json({ mensagem: "erro ao buscar memoriasRams" });
  }
});

memoriaRamsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query("delete from memoria_rams where id=?", [id]);
    res.status(200).json({ mensagem: `memoriaRams de id ${id} deletado` });
  } catch (error) {
    console.error("error ao deletar memoriaRam", error.stack);
    res.status(500).json({ mensagem: "erro ao deletar memoriaRams" });
  }
});


