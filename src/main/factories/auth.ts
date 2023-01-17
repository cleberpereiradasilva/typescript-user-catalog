import { Request, Response, NextFunction} from 'express'

export const makeAuthenticator = (role: string) => {
    
    return (req: Request, res: Response, next: NextFunction) => {
    console.log(role)
    
    next()

    }
}