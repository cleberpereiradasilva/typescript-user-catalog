import { AddAccount } from "../../../domain/usecase/account";
import { AccountData } from "../../../domain/usecase/account/type";
import { AccountModel } from "../../../domain/usecase/model";
import { Encrypter } from "./protocols/encrypter";

export class DbAddAccount implements AddAccount{
    constructor(private readonly encrypter: Encrypter){}

    add = (accountData: AccountData): Promise<AccountModel | null> => {
        this.encrypter.encrypt(accountData.password);
        return new  Promise(resolve => resolve(null));
    }
}