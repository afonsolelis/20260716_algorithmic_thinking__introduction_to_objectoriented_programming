import { createApp } from "./app.js";

const app = createApp();

const porta = Number(process.env.PORT ?? 3000);
app.listen(porta, () => {
  console.log(`🏠 Imobiliária R.M — servidor rodando em http://localhost:${porta}`);
});
