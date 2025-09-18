import cron from "node-cron";
import { MeteoredService } from '@/service/meteored.js';
import { initOracle } from '@/config/source.js';

async function main() {
  await initOracle();
  await MeteoredService();

  cron.schedule("0 * * * *", async () => {
    await MeteoredService();
  });
}

main().catch((err) => {
  console.error("Erro ao iniciar o serviço:", err);
  process.exit(1);
});