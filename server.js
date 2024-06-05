import express,{Router} from "express";
import { monitoresRouter } from "./routes/monitores.js";
import { tecladosRouter } from "./routes/teclados.js";
import { mousesRouter } from "./routes/mouses.js";
import { processadoresRouter } from "./routes/processadores.js";
import { memoriasRouter } from "./routes/memorias.js";
import { memoriaRamsRouter} from "./routes/memoriaRams.js";

//instanciou servidor
const app = express();
app.use (express.json())


//roteamento
const router = Router()
app.use("/api",router)
router.use("/monitores",monitoresRouter)
router.use("/teclados",tecladosRouter)
router.use("/mouses",mousesRouter)
router.use("/processadores",processadoresRouter)
router.use("/memorias",memoriasRouter)
router.use("/memoria-rams",memoriaRamsRouter)

//abriu o servidor
app.listen(3000, () => {
  console.log("servidor iniciado na porta 3000");
});
 
