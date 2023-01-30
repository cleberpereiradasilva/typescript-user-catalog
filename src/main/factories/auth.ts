import { Request, Response, NextFunction} from 'express'
import { DbGetAccountByToken } from '../../data/usecase/account/db-get-account-by-token'
import { GetAccountByIdAdapter } from '../../external/db/typeorm/account-repository/get-account-by-id-adapter'
import { AppDataSource } from '../../external/db/typeorm/db'
import { JwtAdapter } from '../../external/encrypter/jwt/jwt-adapter'
import { AuthMiddleware } from '../../presentation/controller/middleware/auth-middleware'
import { HttpRequest } from '../../presentation/controller/protocols/types'

export const makeAuthenticator = (roles: string[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const getAccountByIdAdapter = new GetAccountByIdAdapter(AppDataSource.manager.connection)
        const decrypter = new JwtAdapter(process.env.SWT_TOKEN)
        const dbGetAccountByToken = new DbGetAccountByToken(decrypter, getAccountByIdAdapter)
        const authMiddleware = new AuthMiddleware(dbGetAccountByToken, roles)
        const httpRequest: HttpRequest ={
            headers: {
                'x-access-token' : req.headers['x-access-token']
            }
        }
        
        const authAccount = await authMiddleware.handle(httpRequest)
        if(authAccount.statusCode !== 200){
            res.status(authAccount.statusCode)
            res.send(authAccount.body)
        }else{
            next()
        }
    }
}