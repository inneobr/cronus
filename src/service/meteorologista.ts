import { NexthourRep } from "@/repository/NexthourRep.js";
import { TodayRep } from "@/repository/TodayRep.js";
import { GroqResponse } from "@/utils/type.js";

export default async function MeteorologistaService(): Promise<string> {
    try {
        const nexthourRep = new NexthourRep();
        const nexthour = await nexthourRep.findall(1);

        if (!nexthour) {
            return "Não foi possível obter os dados meteorológicos.";
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content:
                            "Você é um meteorologista responsável por criar publicações para redes sociais sobre a " +
                            "previsão do tempo do dia. Seja objetivo e assertivo, sua mensagem deve ser curta e precisa.",
                    },
                    {
                        role: "user",
                        content:
                            "Com base nos seguintes dados meteorológicos por hora do dia " +
                            "(temperatura, sensação térmica, umidade, vento, condição do céu, índice UV etc.), " +
                            "crie um resumo da previsão do tempo para hoje em formato conciso e informativo. " +
                            "Estrutura do texto: - Título com ícone e data - Breve resumo geral " +
                            "(tempo predominante, variação de temperatura, possibilidade de chuva) " +
                            "- Destaques por período do dia (manhã, tarde, noite) " +
                            "- Informações adicionais em bullet points (ventos, máxima/mínima, chuva) " +
                            "Use uma linguagem clara e objetiva, ideal para redes sociais ou boletim rápido. " +
                            "Inclua emojis de clima.\n\n" +
                            JSON.stringify(nexthour),
                    },
                ],
                temperature: 0.5,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro na chamada para a API: ${response.statusText}`);
        }

        const message = await response.json() as GroqResponse;
        const meteorologista = message?.choices?.[0]?.message?.content;
        if (!meteorologista) {
            throw new Error("Resposta inválida da API da Groq.");
        }
     
        const todayRep = new TodayRep();
        await todayRep.update({
            cidadeId: 1,
            resu: meteorologista
        });

        return "success console.groq.com";
    } catch (error) {
        console.error("meteorologista indisponível:", error);
        return "Erro ao gerar a previsão do tempo.";
    }
}
