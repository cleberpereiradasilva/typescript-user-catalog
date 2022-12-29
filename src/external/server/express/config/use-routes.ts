import { Express, Router } from 'express'
import fg from 'fast-glob'

export const useRoutes = (app: Express): void => {
    const route = Router()
    app.use('/api', route)
    fg.sync('**/src/external/server/express/routes/*routes.ts').forEach(async file => {
        (await import(`./../../../../../${file}`)).default(route)
    })
}