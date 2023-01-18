import { AccountModel } from "../../../../domain/usecase/model";
export interface GetAccountByIdRepository{
    getAccountById: (id: number) => Promise<AccountModel | null>
}