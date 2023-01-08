import jwt from 'jsonwebtoken'
import { Encrypter } from "../../../data/usecase/account/protocols";

export class JwtAdapter implements Encrypter{
    constructor(private readonly secret: string){}

    encrypt = (value: Object): Promise<string> => {
        return Promise.resolve(jwt.sign(value, this.secret, { expiresIn: 30000}))
    }
}