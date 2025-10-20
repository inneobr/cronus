import { oracle } from "@/config/source.js";
import { Nexthour } from "@/domain/Nexthour.js";
import { NexthourDTO } from "@/utils/type.js";
import { MoreThanOrEqual } from "typeorm";

export class NexthourRep {
    async save(dto: NexthourDTO) {
        const repo = oracle.getRepository(Nexthour);
        let nexthour = await repo.findOneBy({
            hour: dto.hour,
            cidadeId: dto.cidadeId
        });

        if (!nexthour) {
            nexthour = repo.create({
                hour: dto.hour,
                cidadeId: dto.cidadeId,
            });
        }

        nexthour.hour = dto.hour,
        nexthour.date = dto.date,
        nexthour.temp = dto.temp,
        nexthour.sens = dto.sens,
        nexthour.rain = dto.rain,
        nexthour.prov = dto.prov,
        nexthour.clod = dto.clod,
        nexthour.fogs = dto.fogs,
        nexthour.visb = dto.visb,
        nexthour.dews = dto.dews,
        nexthour.umid = dto.umid,
        nexthour.desc = dto.desc,
        nexthour.wind = dto.wind,
        nexthour.burs = dto.burs,
        nexthour.pres = dto.pres,
        nexthour.ifps = dto.ifps,
        nexthour.icon = dto.icon,

        await repo.save(nexthour);
    }

    async findall(cidadeId: number) {
        const repo = oracle.getRepository(Nexthour);
        const hoje = new Date().toISOString().split("T")[0];
        const hour = new Date().toTimeString().slice(0, 5);

        const data = await repo.find({
            where: {
                cidadeId,
                date: MoreThanOrEqual(hoje),
                hour: MoreThanOrEqual(hour)
            },
            order: {
                hour: "ASC",
            }
        });
        return data;
    }
}