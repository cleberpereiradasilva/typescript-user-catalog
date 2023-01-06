import { AccountModel } from "../../../../domain/usecase/model";
export type GetData={
    field: string
    value: string
}

export interface GetAccountRepository{
    getAccount: (getData: GetData) => Promise<AccountModel | null>
}