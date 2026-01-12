import cron from "node-cron";
import { initOracle } from '@/config/source.js';
import { MeteoredService, WeekService } from '@/service/meteored.js';
import MeteorologistaService from "./service/meteorologista.js";

async function main() {
  await initOracle();
  await MeteoredService();
  await MeteorologistaService();

  cron.schedule("0 */6 * * *", async () => {
    await MeteoredService();
    await MeteorologistaService();
  });

  cron.schedule("0 */12 * * *", async () => {
    await WeekService();
  });
  console.log(`CRONUS v1.1!`);
}

main().catch((err) => {
  console.error("Erro ao iniciar o serviço:", err);
  process.exit(1);
});