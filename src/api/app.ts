import express, { type Express } from "express";
import { LojaService } from "../service/loja-service.js";
import { criarRotas } from "./rotas.js";
import { tratadorErros } from "./tratador-erros.js";

export function criarApp(service: LojaService = new LojaService()): Express {
  const app = express();

  app.use(express.json());
  app.use("/loja", criarRotas(service));
  app.use((_req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
  });
  app.use(tratadorErros);

  return app;
}
