import { MeteoredRep } from "@/repository/MeteoredRep.js";
import { MethourRep } from "@/repository/MethourRep.js";
import { MoomRep } from "@/repository/MoomRep.js";
import { parseData } from "@/utils/utils.js";
import * as cheerio from "cheerio";

export async function MeteoredService() {
  const site = await fetch("https://www.tempo.pt/palmas_brasil-l116480.htm", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
    }
  });
  const html = await site.text();
  const $ = cheerio.load(html);

  {/* Previsão semanal */ }
  const meteored = $(".dia")
    .map((_, el) => {
      const $el = $(el);
      const rawDate = $el.find(".subtitle-m").text().trim();

      const windText = $el
        .find(".veloc-day .changeUnitW")
        .map((_, span) => $(span).text().trim())
        .get()
        .filter((v) => /^\d+$/.test(v))
        .map(Number);

      return {
        date: rawDate ? parseData(rawDate) : "",
        name: $el.find(".text-0").text().trim(),
        temp: "",
        sens: "",
        tmax: $el.find(".max").text().trim(),
        tmin: $el.find(".min").text().trim(),
        wind: windText.length > 0 ? String(Math.min(...windText)) : "",
        burs: windText.length > 1 ? String(Math.max(...windText)) : "",
        desc: $el.find(".simbW").attr("alt") || "",
        icon: $el.find(".simbW").attr("src") || "",
        rain: $el.find(".precip .changeUnitR").text().trim(),
        prov: $el.find(".precip .probabilidad").text().trim(),
      };
    })
    .get();

  if (meteored.length > 0) {
    let parse = $("#estado-actual .flex-top img").attr("src") || "";
    parse = parse.replace("/white/", "/color/");
    const icon = parse.startsWith("http") ? parse : "https://www.tempo.pt" + parse;
    meteored[0].temp = $(".dato-temperatura").first().text().trim();
    meteored[0].sens = $(".sensacion .txt-strng").text().trim();
    meteored[0].icon = icon;
    meteored[0].desc = $("#estado-actual .flex-top img").attr("alt") || "";
  }

  const meteoredRep = new MeteoredRep();
  for (const item of meteored) {
    try {
      await meteoredRep.save(item);
    } catch (error) {
      console.error("Meteored error: ", error);
    }
  }

  {/* Calendario lunar */ }
  const moon = $(".card.lunas .fases-luna tr")
    .map((_, tr) => {
      return $(tr).find("td")
        .map((_, td) => {
          const div = $(td).find(".td-content");
          const dayText = div.text().trim().split(" ")[0];
          const img = div.find("img");

          if (img.length > 0) {
            return {
              date: dayText,
              name: img.attr("alt"),
              icon: img.attr("src")
            };
          }
          return null;
        })
        .get();
    }).get().filter(Boolean);

  const moonRep = new MoomRep();
  for (const item of moon) {
    try {
      await moonRep.save(item);
    } catch (error) {
      console.error("Moon error: ", error);
    }
  }

  {/* Tempo por hora*/ }
  const methours = $(".tabla-horas.dos-semanas tr").map((_, el) => {
    const img = $(el).find(".simbolo-pred img");
    const more = $(el).next(".detalleH");

    if (!$(el).find(".text-princ").text().trim()) return null;
    return {
      date: meteored[0].date,
      hora: $(el).find(".text-princ").text().trim(),
      temp: $(el).find(".title-mod.changeUnitT").first().text().trim(),
      sens: $(el).find(".descripcion .ocultar .changeUnitT").text().trim(),
      rain: more.find(".iLluv").parent().find("span.cantidad-lluvia.changeUnitR").first().text().trim(),
      prov: more.find(".iLluv").parent().find(".prob span").first().text().trim(),
      clod: more.find(".iNub").parent().find("strong").text().trim(),
      fogs: more.find(".iNiebla").parent().find("strong").text().trim().toLowerCase(),
      visb: more.find(".iVis").parent().find("strong").text().trim(),
      dews: more.find(".iPRocio").parent().find("strong").text().trim(),
      umid: more.find(".iHum").parent().find("strong").text().trim(),
      desc: $(el).find(".descripcion strong").text().trim(),
      wind: more.find(".iViM").parent().find("strong").text().trim(),
      burs: more.find(".iViR").parent().find("strong").text().trim(),
      pres: more.find(".iPres").parent().find("strong").text().trim(),
      ifps: $(el).find(".iUVi").parent().find("strong").text().trim(),
      icon: img.attr("src") || "",
    };
  }).get().filter(Boolean);

  const methourRep = new MethourRep();
  for (const item of methours) {
    try {
      await methourRep.save(item);
    } catch (error) {
      console.error("Erro ao salvar Methour:", error);
    }
  }
}