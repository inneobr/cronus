import { PrefeituraRep } from "@/repository/PrefeituraRep.js";
import { PrefeituraDTO } from "@/utils/type.js";
import * as cheerio from "cheerio";

export default async function PrefeituraService(): Promise<string> {
    try {
        const url = "https://pmp.pr.gov.br/website/views/maisNoticias.php";

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
            }
        });

        if (!response) {
            console.log('Conexão com notícias da prefeitura foi recusada:', new Date());
            return "Conexão prefeitura recusada";
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const page = $(".col").toArray();

        const cards = page.map((el) => {
            const noticia = cheerio.load($(el).html() || "");
            const title = noticia(".card-title").text().trim();
            const item = noticia("a").attr("href") || "";
            const uri = item.startsWith("http")
                ? item
                : `https://pmp.pr.gov.br/website/views/${item}`;

            const match = uri.match(/id=(\d+)/);
            const id = match ? parseInt(match[1], 10) : 0;

            return { title, uri, id };
        });

        cards.sort((a, b) => a.id - b.id);
        const noticias = await Promise.all(
            cards.map(async ({ title, uri, id }) => {
                try {
                    const response = await fetch(uri);
                    const page = await response.text();
                    const $noticia = cheerio.load(page);

                    const descricao = $noticia("div.post-content.text-justify")
                        .text()
                        .trim();

                    const thumbnail =
                        $noticia("img.img-responsive.card-img-top.d-block.d-xxl-none.mt-3")
                            .attr("src") || "";

                    return {
                        id,
                        uri,
                        title,
                        descricao,
                        thumbnail,
                        cidade: 1                        
                    };
                } catch (erro) {
                    console.error(`Erro ao acessar ${uri}`, erro);
                    return null;
                }
            })
        );

        const prefeituraRep = new PrefeituraRep();
        for (const item of noticias.filter(Boolean)) {
            try {
                await prefeituraRep.save(item as PrefeituraDTO);
            } catch (error) {
                console.error(`PREFEITURA - Falha ao salvar: ${item?.title}, causa:`, error);
            }
        }

        return "Noticias Prefeitura success";
    } catch (error) {
        console.error(`Erro de conexão: https://pmp.pr.gov.br/website/views/maisNoticias.php`, error);
        return "Erro ao buscar notícias";
    }
}
