import bcrypt from 'bcrypt'
import { Decrypter, Encrypter } from "../../data/usecase/account/protocols";

export class BcrypterAdapter implements Encrypter, Decrypter{
    encrypt = (value: string): Promise<string> =>{
        return bcrypt.hash(value, 12)
    }

    compare = (value: string, hash: string): Promise<boolean> => {
        return bcrypt.compare(value, hash)
    }
}