import { Express } from 'express'

import { bodyParser, contentTypeJson, cors } from '../middleware';

export const useMiddlewares = (app: Express) => {
    app.use(bodyParser)
    app.use(cors)
    app.use(contentTypeJson)
}