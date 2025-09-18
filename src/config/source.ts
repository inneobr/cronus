import { Meteored } from "@/domain/Meteored.js";
import { Cidade } from "@/domain/Cidade.js";

import { DataSource } from "typeorm";
import 'reflect-metadata';
import 'dotenv/config';

export const oracle = new DataSource({
    type: "oracle",
    connectString: process.env.DATABASE_HOSTNAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [Cidade, Meteored],
});

export async function initOracle() {
  if (!oracle.isInitialized) {
    await oracle.initialize();
  }
}