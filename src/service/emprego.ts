import { EmpregoRep } from "@/repository/EmpregoRep.js";
import { EmpregoDTO } from "@/utils/type.js";
import * as cheerio from "cheerio";

export default async function EmpregoService() {
  try {
    const response = await fetch("https://pmp.pr.gov.br/website/views/vagasEmprego.php", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
      }
    });

    if(!response){
      console.log('conexão emprego recusada: ', new Date())
      return;
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
        cidadeId: 2
      });
    });

    const empregoRep = new EmpregoRep();
    for (const vaga of vagas) {
      try {
        await empregoRep.save(vaga);
      } catch (error) {
        console.error("Erro ao salvar vaga:", vaga.name, error);
      }
    }

    const vagasBanco = await empregoRep.findByCidade(2);
    const nomesAtuais = new Set(vagas.map(v => v.name));

    for (const vaga of vagasBanco) {
      if (!nomesAtuais.has(vaga.name)) {
        try {          
          await empregoRep.update(vaga.id);
        } catch (error) {
          console.error("Erro ao desativar vaga:", vaga.name, error);
        }
      }
    }

  } catch (error) {
    console.error("Erro ao buscar ou processar vagas:", error);
  }
}
