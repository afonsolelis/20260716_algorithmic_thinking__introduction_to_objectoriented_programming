/** Montagem do app Express — separado de server.ts para ser testável via supertest. */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { apiRouter } from "./api.js";

const raizProjeto = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const distCliente = join(raizProjeto, "dist", "client");

export function createApp(): Express {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use("/api", apiRouter);
  app.use(express.static(distCliente));

  // Error handler central: cobre erros de parsing do body-parser (JSON malformado,
  // payload maior que o limite) e qualquer exceção não tratada de um handler síncrono.
  // Nunca repassa err.message/stack ao cliente — só o status já classificado pelo middleware.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Erro não tratado:", err);
    const status = temStatusHttp(err) ? err.status : 500;
    res.status(status).json({
      erro: status < 500 ? "Corpo da requisição inválido." : "Erro interno do servidor.",
    });
  });

  return app;
}

function temStatusHttp(err: unknown): err is { status: number } {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number"
  );
}
