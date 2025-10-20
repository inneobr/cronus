import { oracle } from "@/config/source.js";
import { Today } from "@/domain/Today.js";
import { TodayDTO } from "@/utils/type.js";

export class TodayRep {
    async save(dto: TodayDTO): Promise<void> {
        const repo = oracle.getRepository(Today);
        let today = await repo.findOneBy({ cidadeId: dto.cidadeId });

        if (!today) {
            today = repo.create({                
                cidadeId: dto.cidadeId 
            });
        }
        today.date = dto.date;
        today.indi = dto.indi;
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

    async update(dto: Partial<TodayDTO> & { cidadeId: number }): Promise<Today | null> {
        const repo = oracle.getRepository(Today);
        const today = await repo.findOneBy({ cidadeId: dto.cidadeId });

        if (!today) return null;

        if (dto.date !== undefined) today.date = dto.date;
        if (dto.indi !== undefined) today.indi = dto.indi;
        if (dto.desc !== undefined) today.desc = dto.desc;
        if (dto.valu !== undefined) today.valu = dto.valu;
        if (dto.info !== undefined) today.info = dto.info;
        if (dto.resu !== undefined) today.resu = dto.resu;
        if (dto.pluz !== undefined) today.pluz = dto.pluz;
        if (dto.nsun !== undefined) today.nsun = dto.nsun;
        if (dto.mday !== undefined) today.mday = dto.mday;
        if (dto.psun !== undefined) today.psun = dto.psun;
        if (dto.uluz !== undefined) today.uluz = dto.uluz;

        await repo.save(today);
        return today;
    }

    async findByCidade(cidadeId: number): Promise<Today | null> {
        const repo = oracle.getRepository(Today);
        return await repo.findOneBy({ cidadeId });
    }
}