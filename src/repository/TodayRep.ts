import { oracle } from "@/config/source.js";
import { Today } from "@/domain/Today.js";
import { TodayDTO } from "@/utils/type.js";

export class TodayRep {
    async save(dto: TodayDTO) {
        const repo = oracle.getRepository(Today);
        let today = await repo.findOneBy({ cidadeId: 2 });

        if (!today) {
            today = repo.create({                
                cidadeId: 2 
            });
        }
        today.indi = dto.indi,
        today.desc = dto.desc;
        today.valu = dto.valu;
        today.info = dto.info;
        today.pluz = dto.pluz;
        today.nsun = dto.nsun;
        today.mday = dto.mday;
        today.psun = dto.psun;
        today.uluz = dto.uluz;

        await repo.save(today);
    }
}