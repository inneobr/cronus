import { oracle } from "@/config/source.js";
import { LunarDTO } from "@/utils/type.js";
import { Lunar } from "@/domain/Lunar.js";

export class LunarRep {
  async save(dto: LunarDTO) {
    const repo = oracle.getRepository(Lunar);
    let lunar = await repo.findOneBy({ day: dto.day });

    if (!lunar) {
      lunar = repo.create({ day: dto.day });
    }
    lunar.date = dto.date;
    lunar.name = dto.name;
    lunar.icon = dto.icon;
    lunar.perc = dto.perc;

    await repo.save(lunar);
  }
}