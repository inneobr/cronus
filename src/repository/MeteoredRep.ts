import { oracle } from "@/config/source.js";
import { Meteored } from "@/domain/Meteored.js";
import { MeteoredDTO } from "@/utils/type.js";

export class MeteoredRep {
    async save(dto: MeteoredDTO) {
        const repo = oracle.getRepository(Meteored);
        let meteored = await repo.findOneBy({ 
            date: dto.date, 
            cidadeId: dto.cidadeId 
        });

        if (!meteored) {
            meteored = repo.create({
                date: dto.date,
                cidadeId: dto.cidadeId
            });
        }

        if (
            dto.name &&
            dto.name.toLowerCase() !== "hoje" &&
            dto.name.toLowerCase() !== "amanhã"
        ) {
            meteored.name = dto.name;
        }

        meteored.temp = dto.temp;
        meteored.sens = dto.sens;
        meteored.tmax = dto.tmax;
        meteored.tmin = dto.tmin;
        meteored.wind = dto.wind;
        meteored.burs = dto.burs;
        meteored.desc = dto.desc;
        meteored.icon = dto.icon;
        meteored.rain = dto.rain;
        meteored.prov = dto.prov;

        await repo.save(meteored);
    }
}
