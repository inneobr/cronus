import { oracle } from "@/config/source.js";
import { Methour } from "@/domain/Methour.js";
import { MethourDTO } from "@/utils/type.js";

export class MethourRep {
    async save(dto: MethourDTO) {
        const repo = oracle.getRepository(Methour);
        let methour = await repo.findOneBy({ hora: dto.hora });

        if (!methour) {
            methour = repo.create({
                hora: dto.hora,
                cidadeId: 2
            });
        }    

        methour.hora = dto.hora,
        methour.temp = dto.temp,
        methour.sens = dto.sens,
        methour.rain = dto.rain,
        methour.umid = dto.umid,
        methour.desc = dto.desc,
        methour.wind = dto.wind,
        methour.burs = dto.burs,
        methour.pres = dto.pres,
        methour.ifps = dto.ifps,
        methour.icon = dto.icon,   

        await repo.save(methour);
    }
}