import { AccountModel } from "../../../../domain/usecase/model";
export interface GetAccountByEmailRepository{
    getAccountByEmail: (email: string) => Promise<AccountModel | null>
}