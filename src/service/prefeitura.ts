import { PrefeituraRep } from "@/repository/PrefeituraRep.js";
import { PrefeituraDTO } from "@/utils/type.js";
import * as cheerio from "cheerio";

export default async function PrefeituraService() {
    const url = "https://pmp.pr.gov.br/website/views/maisNoticias.php";

    const site = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
        }
    });

    const html = await site.text();
    const $ = cheerio.load(html);

    const page = $(".col").toArray();

    const cards = page.map((el) => {
        const noticia = cheerio.load($(el).html() || "");
        const title = noticia(".card-title").text().trim();
        const item = noticia("a").attr("href") || "";
        const uri = item.startsWith("http")
            ? item
            : `https://pmp.pr.gov.br/website/views/${item}`;
        return { title, uri };
    });

    const noticias = await Promise.all(
        cards.map(async ({ title, uri }) => {
            try {
                const response = await fetch(uri);
                const page = await response.text();
                const $noticia = cheerio.load(page);

                const descricao = $noticia("div.post-content.text-justify")
                    .text()
                    .trim();

                const thumbnail =
                    $noticia(
                        "img.img-responsive.card-img-top.d-block.d-xxl-none.mt-3"
                    ).attr("src") || "";

                return {
                    uri,
                    title,
                    descricao,
                    thumbnail,
                    cidade: 2,
                };
            } catch (erro) {
                console.error(`Erro ao acessar ${uri}`, erro);
                return null;
            }
        })
    );

    const prefeituraRep = new PrefeituraRep();
    for (const noticia of noticias.filter(Boolean)) {
        try {
            await prefeituraRep.save(noticia as PrefeituraDTO);
        } catch (error) {
            console.error("Erro ao salvar notícia:", error);
        }
    }
}