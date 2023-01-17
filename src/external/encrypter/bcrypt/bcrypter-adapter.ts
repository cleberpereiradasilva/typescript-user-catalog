import bcrypt from 'bcrypt'
import { Compare, Encrypter } from "../../../data/usecase/account/protocols";

export class BcrypterAdapter implements Encrypter, Compare{
    encrypt = (value: string): Promise<string> =>{
        return bcrypt.hash(value, 12)
    }

    compare = (value: string, hash: string): Promise<boolean> => {
        return bcrypt.compare(value, hash)
    }
}