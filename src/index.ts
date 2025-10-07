import cron from "node-cron";
import { initOracle } from '@/config/source.js';
import EmpregoService from "./service/emprego.js";
import PrefeituraService from "./service/prefeitura.js";
import { MeteoredService } from '@/service/meteored.js';

async function main() {
  await initOracle();
  await EmpregoService();
  await MeteoredService();
  await PrefeituraService();

  cron.schedule("0 * * * *", async () => {
    await MeteoredService();
  });

  cron.schedule("0 */6 * * *", async () => {
    await EmpregoService();
    await PrefeituraService();
  });
  console.log(`Bem vindo!`);
}

main().catch((err) => {
  console.error("Erro ao iniciar o serviço:", err);
  process.exit(1);
});