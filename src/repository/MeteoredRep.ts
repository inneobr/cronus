import { oracle } from "@/config/source.js";
import { Meteored } from "@/domain/Meteored.js";
import { MeteoredDTO } from "@/utils/type.js";

export class MeteoredRep {
    async save(dto: MeteoredDTO) {
        const repo = oracle.getRepository(Meteored);
        let weather = await repo.findOneBy({ date: dto.date });

        if (!weather) {
            weather = repo.create({
                date: dto.date,
                cidadeId: 2
            });
        }

        if (
            dto.name &&
            dto.name.toLowerCase() !== "hoje" &&
            dto.name.toLowerCase() !== "amanhã"
        ) {
            weather.name = dto.name;
        }

        weather.temp = dto.temp;
        weather.sens = dto.sens;
        weather.tmax = dto.tmax;
        weather.tmin = dto.tmin;
        weather.wind = dto.wind;
        weather.burs = dto.burs;
        weather.desc = dto.desc;
        weather.icon = dto.icon;
        weather.rain = dto.rain;
        weather.prov = dto.prov;

        await repo.save(weather);
    }
}
