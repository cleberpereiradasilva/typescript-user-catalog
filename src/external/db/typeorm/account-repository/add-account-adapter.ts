import { DataSource, Repository } from "typeorm";
import { AddAccountRepository } from "../../../../data/usecase/account/protocols";
import { AccountData } from "../../../../domain/usecase/account/type";
import { AccountModel } from "../../../../domain/usecase/model";
import { Account } from "../entity/account";

export class AddAccountAdapter implements AddAccountRepository{
    private repository: Repository<Account>;
    constructor(connection: DataSource){
        this.repository =  connection.getRepository(Account);
    }
    add = async (account: AccountData): Promise<AccountModel | null> => {
        const newAccount = this.repository.create({...account})
        const insertedAccount = await this.repository.save(newAccount)
        const accountModel: AccountModel = {...insertedAccount}
        return accountModel;
    }
}