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

        // Tenta apagar a sequence apenas se ela existir
        await queryRunner.query(`
            BEGIN
                EXECUTE IMMEDIATE 'DROP SEQUENCE INFORMATIVE.SEQJOBS';
            EXCEPTION
                WHEN OTHERS THEN
                    IF SQLCODE != -2289 THEN -- ORA-02289: sequence does not exist
                        RAISE;
                    END IF;
            END;
        `);

        // Cria a sequence (caso tenha sido apagada ou nunca existiu)
        await queryRunner.query(`
            BEGIN
                EXECUTE IMMEDIATE '
                    CREATE SEQUENCE INFORMATIVE.SEQJOBS
                    START WITH 1
                    INCREMENT BY 1
                    NOCACHE
                    NOCYCLE
                ';
            EXCEPTION
                WHEN OTHERS THEN
                    IF SQLCODE != -955 THEN -- ORA-00955: name is already used by an existing object
                        RAISE;
                    END IF;
            END;
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