import { oracle } from "@/config/source.js";
import { Emprego } from "@/domain/Emprego.js";
import { EmpregoDTO } from "@/utils/type.js";
import { IsNull } from "typeorm";

export class EmpregoRep {
    async save(dto: EmpregoDTO) {
        const repo = oracle.getRepository(Emprego);
        let emprego = await repo.findOne({
            where: {
                name: dto.name,
                details: dto.details
            }
        });

        if (!emprego) {
            emprego = repo.create({
                name: dto.name,
                cidade: { id: dto.cidadeId ?? 2 }
            });
        }

        if (dto.amount !== undefined) emprego.amount = dto.amount;
        if (dto.details !== undefined) emprego.details = dto.details;

        await repo.save(emprego);
    }

    async findByCidade(cidadeId: number): Promise<Emprego[]> {
        const repo = oracle.getRepository(Emprego);
        return repo.find({
            where: {
                cidadeId,
                waxed: IsNull(),
            }
        });
    }

     async update(id: number) {
        const repo = oracle.getRepository(Emprego);        
        repo.update(id, { waxed: new Date() });
    }

    async finalizar(id: number): Promise<void> {
        const repo = oracle.getRepository(Emprego);
        const dataLocal = new Date();
        await repo.update(id, { waxed: dataLocal });
    }
}