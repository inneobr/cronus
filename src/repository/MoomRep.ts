import { oracle } from "@/config/source.js";
import { MoomDTO } from "@/utils/type.js";
import { Moon } from "@/domain/Moon.js";

export class MoomRep {
  async save(dto: MoomDTO) {
    const repo = oracle.getRepository(Moon);
    let moon = await repo.findOneBy({ date: dto.date });

    if (!moon) {
      moon = repo.create({ date: dto.date });
    }

    moon.name = dto.name;
    moon.icon = dto.icon;

    await repo.save(moon);
  }
}