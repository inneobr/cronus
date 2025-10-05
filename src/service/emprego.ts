import { JobRep } from "@/repository/JobsRep.js";
import * as cheerio from "cheerio";
import { JobDTO } from "@/utils/type.js";

export default async function EmpregoService() {
  try {
    const response = await fetch("https://pmp.pr.gov.br/website/views/vagasEmprego.php", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const vagas: JobDTO[] = [];

    $("table tbody tr").each((_, el) => {
      const tds = $(el).find("td");

      if (tds.length < 3) return;

      const name = $(tds[0]).text().trim();
      const amount = $(tds[1]).text().trim();
      const rawDetails = $(tds[2]).html() || '';

      const details = rawDetails
        .split(/<br\s*\/?>/i)
        .map((line) => line.replace(/^-/, '').trim())
        .filter(Boolean)
        .join(' ')
        .replace(/;\s*/g, '. ')
        .replace(/\n{2,}/g, '\n')
        .trim();

      vagas.push({
        name,
        amount,
        details,
        cidadeId: 2
      });
    });
   
    const jobRep = new JobRep();
    await jobRep.clearAll();

    for (const vaga of vagas) {
      try {
        await jobRep.save(vaga);
      } catch (error) {
        console.error("Erro ao salvar vaga:", vaga.name, error);
      }
    }

  } catch (error) {
    console.error("Erro ao buscar ou processar vagas:", error);
  }
}
