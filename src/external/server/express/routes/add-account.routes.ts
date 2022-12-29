import { Request, Response, Express } from "express"

export default (app: Express): void => {
    app.post('/signup', (req: Request, res: Response) => {
        res.send()
    })
}