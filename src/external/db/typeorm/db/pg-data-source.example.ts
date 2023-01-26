import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "host.com",
    port: 5432,
    database: "your database",
    username: "your username",
    password: "***********",
    synchronize: true,
    logging: false,
    entities: ["src/external/db/typeorm/entity/*.ts"],
    subscribers: [],
    migrations: [],
})