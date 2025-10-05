import { Meteored } from "@/domain/Meteored.js";
import { Cidade } from "@/domain/Cidade.js";

import { DataSource } from "typeorm";
import 'reflect-metadata';
import 'dotenv/config';
import { Moon } from "@/domain/Moon.js";
import { Methour } from "@/domain/Methour.js";
import { Today } from "@/domain/Today.js";
import { Job } from "@/domain/Jobs.js";

export const oracle = new DataSource({
    type: "oracle",
    connectString: process.env.DATABASE_HOSTNAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [Cidade, Today, Meteored, Methour, Moon, Job],
});

export async function initOracle() {
  if (!oracle.isInitialized) {
    await oracle.initialize();
  }
}