import { GetAccountByToken } from "../../../domain/usecase/account";
import { AccountModel } from "../../../domain/usecase/model";
import { Decrypter, GetAccountByIdRepository } from "./protocols";

export class DbGetAccountByToken implements GetAccountByToken{
    constructor(
            private readonly decrypter: Decrypter,
            private readonly dbGetAccountByIdRepository: GetAccountByIdRepository){}
    getAccount = async (token: string):Promise<AccountModel> => {
        const tokenObject = await this.decrypter.descrypt(token)
        if(tokenObject){
            const account = this.dbGetAccountByIdRepository.getAccountById(tokenObject.id)
            if(account){
                return account
            }
        }
        return null
    }
}