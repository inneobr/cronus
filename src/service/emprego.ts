import { EmpregoRep } from "@/repository/EmpregoRep.js";
import { EmpregoDTO } from "@/utils/type.js";
import * as cheerio from "cheerio";

export default async function EmpregoService(): Promise<string> {
  try {
    const response = await fetch("https://pmp.pr.gov.br/website/views/vagasEmprego.php", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
      }
    });

    if (!response) {
      console.log('conexão sine recusada: ', new Date());
      return 'conexão sine recusada';
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const vagas: EmpregoDTO[] = [];
    $("table tbody tr").each((_, el) => {
      const tds = $(el).find("td");

      if (tds.length < 3) return;

      const name = $(tds[0]).text().trim();
      const amount = $(tds[1]).text().trim();
      const rawDetails = $(tds[2]).html() || '';

      const $details = cheerio.load(rawDetails);
      $details('br').replaceWith('\n');
      $details('p').replaceWith((_, el) => '\n' + $details(el).text() + '\n');
      $details('div').replaceWith((_, el) => '\n' + $details(el).text() + '\n');

      let details = $details.text();
      details = details.replace(/\n{2,}/g, '\n').trim();

      vagas.push({
        name,
        amount,
        details,
        cidadeId: 1
      });
    });

    // 👉 ORDENAR VAGAS POR NOME ANTES DE SALVAR
    vagas.sort((a, b) => a.name.localeCompare(b.name));

    const empregoRep = new EmpregoRep();
    for (const item of vagas) {
      try {
        await empregoRep.save(item);
      } catch (error) {
        console.error(`EMPREGO, falha ao salvar: ${item.name}, causa:`, error);
      }
    }

    const vagasBanco = await empregoRep.findByCidade(2);
    const vagasAtuais = new Set(vagas.map(v => v.name));

    for (const item of vagasBanco.filter(Boolean)) {
      if (!vagasAtuais.has(item.name)) {
        try {
          await empregoRep.update(item.id);
        } catch (error) {
          console.error(`EMPREGO, falha ao encerrar vaga: ${item.name}, causa:`, error);
        }
      }
    }

  } catch (error) {
    console.error(`Conexão recusada:\nhttps://pmp.pr.gov.br/website/views/vagasEmprego.php`, error);
  }
  return "Sine success";
}