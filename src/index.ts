import cron from "node-cron";
import { initOracle } from '@/config/source.js';
import { MeteoredService } from '@/service/meteored.js';
import MeteorologistaService from "./service/meteorologista.js";

async function main() {
  await initOracle();
  await MeteoredService();
  await MeteorologistaService();

  cron.schedule("0 * * * *", async () => {
    await MeteoredService();
  });

  cron.schedule("0 */6 * * *", async () => {
    await MeteorologistaService();
  });
  console.log(`CRONUS v1.0!`);
}

main().catch((err) => {
  console.error("Erro ao iniciar o serviço:", err);
  process.exit(1);
});