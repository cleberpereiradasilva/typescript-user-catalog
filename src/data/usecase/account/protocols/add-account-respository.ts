import { AccountData } from "../../../../domain/usecase/account/type";
import { AccountModel } from "../../../../domain/usecase/model";

export interface AddAccountRepository{
    add: (account: AccountData) => Promise<AccountModel | null>
}