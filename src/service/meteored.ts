import { Meteored } from "@/domain/Meteored.js";
import { parseData } from "@/utils/utils.js";
import { oracle } from "@/config/source.js";
import * as cheerio from "cheerio";

export async function MeteoredService() {
  const res = await fetch("https://www.tempo.pt/palmas_brasil-l116480.htm");
  const html = await res.text();
  const $ = cheerio.load(html);

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
        ifps: "",
        dfps: "",
        tmax: $el.find(".max").text().trim(),
        tmin: $el.find(".min").text().trim(),
        wind: windText.length > 0 ? Math.max(...windText) + " km/h" : "",
        desc: $el.find(".simbW").attr("alt") || "",
        icon: $el.find(".simbW").attr("src") || "",
        wdir: $el.find(".col-s strong").text().trim()
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
    meteored[0].ifps = $('img.iUVi').attr('src') || "";
    meteored[0].dfps = $("td span.row span.col.velocidad strong").first().text().trim();
  }

  for (const item of meteored) {
    try {
      const repo = oracle.getRepository(Meteored);
      let weather = await repo.findOneBy({ date: item.date });

      if (!weather) {
        weather = repo.create({
          date: item.date,
          cidadeId: 2
        });
      }

      if (
        item.name &&
        item.name.toLowerCase() !== "hoje" &&
        item.name.toLowerCase() !== "amanhã"
      ) {
        weather.name = item.name;
      }

      weather.temp = item.temp;
      weather.sens = item.sens;
      weather.tmax = item.tmax;
      weather.tmin = item.tmin;
      weather.wind = item.wind;
      weather.desc = item.desc;
      weather.icon = item.icon;
      weather.dfps = item.dfps;

      await repo.save(weather);      
    } catch (error) {
      console.error("Meteored error: ", error);
    }
  }  
}