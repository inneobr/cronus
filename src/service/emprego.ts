import { JobRep } from "@/repository/JobsRep.js";
import * as cheerio from "cheerio";
import { JobDTO } from "@/utils/type.js";

export default async function EmpregoService() {
  try {
    // Faz a requisição da página de vagas
    const response = await fetch("https://pmp.pr.gov.br/website/views/vagasEmprego.php", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
      }
    });

    const html = await response.text();

    // Carrega o html com cheerio
    const $ = cheerio.load(html);

    const vagas: JobDTO[] = [];

    // Itera pelas linhas da tabela
    $("table tbody tr").each((_, el) => {
      const tds = $(el).find("td");

      if (tds.length < 3) return;

      const name = $(tds[0]).text().trim();
      const amount = $(tds[1]).text().trim();
      const rawDetails = $(tds[2]).html() || '';

      // Manipula o HTML dos detalhes para limpar tags e substituir por \n
      const $details = cheerio.load(rawDetails);

      // Troca <br> por quebra de linha
      $details('br').replaceWith('\n');
      // Troca <p> por quebra de linha e seu texto
      $details('p').replaceWith((_, el) => '\n' + $details(el).text() + '\n');
      // Troca <div> por quebra de linha e seu texto
      $details('div').replaceWith((_, el) => '\n' + $details(el).text() + '\n');

      let details = $details.text();

      // Remove quebras de linha duplicadas e espaços extras
      details = details.replace(/\n{2,}/g, '\n').trim();

      vagas.push({
        name,
        amount,
        details,
        cidadeId: 2
      });
    });

    // Instancia o repositório e limpa as vagas antigas
    const jobRep = new JobRep();
    await jobRep.clearAll();

    // Salva as vagas processadas no banco
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
