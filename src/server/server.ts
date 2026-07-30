import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { apiRouter } from "./api.js";

const raizProjeto = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const distCliente = join(raizProjeto, "dist", "client");

const app = express();
app.use(express.json());
app.use("/api", apiRouter);
app.use(express.static(distCliente));

const porta = Number(process.env.PORT ?? 3000);
app.listen(porta, () => {
  console.log(`🏠 Imobiliária R.M — servidor rodando em http://localhost:${porta}`);
});
