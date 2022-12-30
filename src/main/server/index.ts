import { AppDataSource } from "../../external/db/typeorm/db/pg-data-source"

AppDataSource.initialize().then(async () => {
    const app = (await import("../../external/server/express")).default
    const server = app

    server.listen(8080, () => { console.log('rodando....')})
}).catch(error => console.error(error))
