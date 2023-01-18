import { GetAccountByToken } from "../../../domain/usecase/account";
import { AccountModel } from "../../../domain/usecase/model";
import { Decrypter, GetAccountByTokenRepository } from "./protocols";

export class DbGetAccountByToken implements GetAccountByToken{
    constructor(
            private readonly decrypter: Decrypter,
            private readonly dbGetAccountByTokenRepository: GetAccountByTokenRepository){}
    getAccount = async (token: string):Promise<AccountModel> => {
        const tokenObject = await this.decrypter.descrypt(token)
        if(tokenObject){
            const account = this.dbGetAccountByTokenRepository.getAccountByToken(token)
            if(account){
                return account
            }
        }
        return null
    }
}