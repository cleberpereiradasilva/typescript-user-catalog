import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./database.sqlite",
    synchronize: true,
    logging: false,
    entities: ["src/external/db/typeorm/entity/*.ts"],
    subscribers: [],
    migrations: [],
})