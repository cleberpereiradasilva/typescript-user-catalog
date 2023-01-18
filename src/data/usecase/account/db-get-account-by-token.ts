import { GetAccountByToken } from "../../../domain/usecase/account";
import { AccountModel } from "../../../domain/usecase/model";
import { Decrypter } from "./protocols";

export class DbGetAccountByToken implements GetAccountByToken{
    constructor(private readonly decrypter: Decrypter){}
    getAccount = async (token: string):Promise<AccountModel> => {
        const tokenObject = await this.decrypter.descrypt(token)
        if(tokenObject){
            return tokenObject as AccountModel
        }
        return null
    }
}