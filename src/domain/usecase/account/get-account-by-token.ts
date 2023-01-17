import { AccountModel } from "../model";
export interface GetAccountByToken{
    getAccount: (token: string) => Promise<AccountModel | null>
}