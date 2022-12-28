import { AccountData, AccountDTO } from "./type";
export interface AddAccount{
    add: (accountData: AccountData) => AccountDTO | undefined
}