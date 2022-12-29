import { AccountModel } from "../model";
import { AccountData } from "./type";
export interface AddAccount{
    add: (accountData: AccountData) => Promise<AccountModel | null>
}