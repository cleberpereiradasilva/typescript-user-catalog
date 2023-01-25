import jwt from 'jsonwebtoken'
import { Decrypter, Encrypter } from "../../../data/usecase/account/protocols";

export class JwtAdapter implements Encrypter, Decrypter{
    constructor(private readonly secret: string){}

    encrypt = (value: Object): Promise<string> => {
        return Promise.resolve(jwt.sign(value, this.secret, { expiresIn: 30000}))
    }

    descrypt = (hash: string): Promise<{ userAccountId: number }> => {
        try{
            const userObject = jwt.verify(hash,this.secret)
            return Promise.resolve(userObject as unknown as {userAccountId: number})
        }catch(error){
            return Promise.resolve(null)
        }
    }
}