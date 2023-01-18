import { GetAccountByToken } from "../../../domain/usecase/account";
import { AccountModel } from "../../../domain/usecase/model";
import { Decrypter } from "./protocols";

export class DbGetAccountByToken implements GetAccountByToken{
    constructor(private readonly decrypter: Decrypter){}
    getAccount = async (token: string):Promise<AccountModel> => {
        await this.decrypter.descrypt(token)
        return Promise.resolve(null)
    }
}