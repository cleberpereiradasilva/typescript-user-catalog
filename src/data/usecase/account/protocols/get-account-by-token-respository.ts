import { AccountModel } from "../../../../domain/usecase/model";
export interface GetAccountByTokenRepository{
    getAccountByToken: (token: string) => Promise<AccountModel | null>
}