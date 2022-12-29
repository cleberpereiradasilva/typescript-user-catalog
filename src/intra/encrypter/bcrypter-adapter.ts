import bcrypt from 'bcrypt'
import { Encrypter } from "../../data/usecase/account/protocols";

export class BcrypterAdapter implements Encrypter{
    encrypt = (value: string): Promise<string> =>{
        return bcrypt.hash(value, 12)
    }
}