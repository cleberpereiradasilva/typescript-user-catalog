import { AppDataSource } from "../../external/db/typeorm/db/pg-data-source"

export const AppStore = () => {
    const port = 8080
    AppDataSource.initialize().then(async () => {
        const app = (await import("../../external/server/express")).default
        const server = app

        server.listen(port, () => { console.log(`running http://localhost:${port}/api/`)})
    }).catch(error => console.error(error))
}
