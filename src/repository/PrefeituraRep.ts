import { oracle } from "@/config/source.js";
import { PrefeituraDTO } from "@/utils/type.js";
import { Prefeitura } from "@/domain/Prefeitura.js";

export class PrefeituraRep {
  async save(dto: PrefeituraDTO) {
    const repo = oracle.getRepository(Prefeitura);

    let noticia = await repo.findOneBy({ uri: dto.uri });
    if (!noticia) {
      noticia = repo.create({
        uri: dto.uri,
        cidadeId: 2,
      });
    }

    noticia.title     = dto.title;
    noticia.descricao = dto.descricao;
    noticia.thumbnail = dto.thumbnail;

    await repo.save(noticia);
  }
}