import { AddAccount } from "../../../domain/usecase/account";
import { AccountData } from "../../../domain/usecase/account/type";
import { AccountModel } from "../../../domain/usecase/model";
import { AddAccountRepository } from "./protocols";
import { Encrypter } from "./protocols/encrypter";

export class DbAddAccount implements AddAccount{
    constructor(
        private readonly encrypter: Encrypter,
        private readonly addAccountRepository: AddAccountRepository,
    ){}

    add = async (accountData: AccountData): Promise<AccountModel | null> => {
        const passwordEncrypted = await this.encrypter.encrypt(accountData.password);
        const newAccount = await this.addAccountRepository.add({...accountData, password: passwordEncrypted})
        return new Promise(resolve => resolve(newAccount));
    }
}