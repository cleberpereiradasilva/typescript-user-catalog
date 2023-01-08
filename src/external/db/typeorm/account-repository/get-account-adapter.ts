import { DataSource, Repository } from "typeorm";
import { GetAccountByEmailRepository } from "../../../../data/usecase/account/protocols";
import { AccountModel } from "../../../../domain/usecase/model";
import { Account } from "../entity/account";

export class GetAccountAdapter implements GetAccountByEmailRepository{
    private repository: Repository<Account>;
    constructor(connection: DataSource){
        this.repository =  connection.getRepository(Account);
    }
    getAccountByEmail = (email: string): Promise<AccountModel> => {
        return this.repository.findOneBy({ email})
    }
    
}