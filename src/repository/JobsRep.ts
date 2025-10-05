import { oracle } from "@/config/source.js";
import { Job } from "@/domain/Jobs.js";
import { JobDTO } from "@/utils/type.js";

export class JobRep {
    async save(dto: JobDTO) {
        const repo = oracle.getRepository(Job);

        let job = await repo.findOne({
            where: {
                name: dto.name
            }
        });

        if (!job) {
            job = repo.create({
                name: dto.name,
                cidade: { id: dto.cidadeId ?? 2 }
            });
        }

        // Atualiza apenas se os campos vierem preenchidos
        if (dto.amount !== undefined) job.amount = dto.amount;
        if (dto.details !== undefined) job.details = dto.details;

        await repo.save(job);
    }

    async clearAll() {
        const queryRunner = oracle.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`TRUNCATE TABLE INFORMATIVE.JOBS`);
            await queryRunner.query(`DROP SEQUENCE INFORMATIVE.SEQJOBS`);
            await queryRunner.query(`
        CREATE SEQUENCE INFORMATIVE.SEQJOBS
        START WITH 1
        INCREMENT BY 1
        NOCACHE
        NOCYCLE
      `);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error("Erro ao limpar tabela e resetar sequence:", err);
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}