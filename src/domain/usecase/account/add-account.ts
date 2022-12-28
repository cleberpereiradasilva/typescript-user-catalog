export type AccountData = {
    name: string;
    email: string;
    password: string; 
}

export type AccountDTO = {
    id: number;
    uuid: string;
    name: string;
    email: string;
}

export interface AddAccount{
    add: (accountData: AccountData) => AccountDTO | undefined
}