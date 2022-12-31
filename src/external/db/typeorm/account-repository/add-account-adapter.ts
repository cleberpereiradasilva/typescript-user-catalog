import { DataSource, Repository } from "typeorm";
import { AddAccountRepository } from "../../../../data/usecase/account/protocols";
import { AccountData } from "../../../../domain/usecase/account/type";
import { AccountModel } from "../../../../domain/usecase/model";
import { Account } from "../entity/account";
import { Group } from "../entity/group";

export class AddAccountAdapter implements AddAccountRepository{
    private repository: Repository<Account>;
    constructor(connection: DataSource){
        this.repository =  connection.getRepository(Account);
    }
    insert = async (account: AccountData): Promise<AccountModel | null> => {
        const {group, ...accountData} = account
        const newAccount = this.repository.create({...accountData})
        const groups = [group as unknown as Group]
        newAccount.groups = groups
        const insertedAccount = await this.repository.save(newAccount)
        const accountModel: AccountModel = {...insertedAccount}
        return accountModel;
    }
}