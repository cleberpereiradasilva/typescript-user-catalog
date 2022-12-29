import { Request, Response, NextFunction} from 'express'

export const contentTypeJson = (req: Request, res: Response, next: NextFunction) => {
    res.contentType('json')
    next()
}
