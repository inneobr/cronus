import { Meteored } from "@/domain/Meteored.js";
import { Cidade } from "@/domain/Cidade.js";

import { DataSource } from "typeorm";
import 'reflect-metadata';
import 'dotenv/config';
import { Today } from "@/domain/Today.js";
import { Emprego } from "@/domain/Emprego.js";
import { Lunar } from "@/domain/Lunar.js";
import { Nexthour } from "@/domain/Nexthour.js";
import { Prefeitura } from "@/domain/Prefeitura.js";

export const oracle = new DataSource({
    type: "oracle",
    connectString: process.env.DATABASE_HOSTNAME || "",
    username: process.env.DATABASE_USERNAME || "",
    password: process.env.DATABASE_PASSWORD || "",
    entities: [Cidade, Today, Meteored, Nexthour, Lunar, Emprego, Prefeitura],
});

// Função utilitária para pegar variáveis obrigatórias
function requireEnv(name: string): string | null {
  const value = process.env[name];
  if (!value) {
    console.warn(`⚠️ Variável de ambiente '${name}' não definida. Verifique seu arquivo .env.`);
    return null;
  }
  return value;
}

// Lê variáveis do ambiente
const username = requireEnv("DATABASE_USERNAME");
const password = requireEnv("DATABASE_PASSWORD");
const connectString = requireEnv("DATABASE_HOSTNAME");


export async function initOracle() {
  if (!username || !password || !connectString) {
    console.error("Credenciais do Oracle não configuradas.");
    return; 
  }

  try {
    if (!oracle.isInitialized) {
      await oracle.initialize();
    }
  } catch (err: any) {
    console.error("Conexão Oracle source:", err.message);
  }
}

