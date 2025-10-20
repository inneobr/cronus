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
    connectString: process.env.DATABASE_HOSTNAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [Cidade, Today, Meteored, Nexthour, Lunar, Emprego, Prefeitura],
});

export async function initOracle() {
  if (!oracle.isInitialized) {
    await oracle.initialize();
  }
}