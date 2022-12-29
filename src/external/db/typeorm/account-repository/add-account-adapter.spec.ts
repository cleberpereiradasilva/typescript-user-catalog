import { DataSource } from "typeorm";
import { AccountData } from "../../../../domain/usecase/account/type";
import { AppDataSource } from "../db/jest-pg-data-source";
import { Account } from "../entity/account";
import { AddAccountAdapter } from "./add-account-adapter";

describe('AddAccount Repository', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    afterAll(async () => {
        await connection.getRepository(Account).clear()
        await connection.destroy()
    })

    it('should insert a account in database', async () => {
        const sutAddAccountAdapter = new AddAccountAdapter(connection)

        const accountData: AccountData = {
            name: 'valid_name',
            email: 'valid_email',
            password:  'valid_password', 
        }

        const newAccount = await sutAddAccountAdapter.add(accountData);
        expect(newAccount?.id).toBeTruthy()
        expect(newAccount?.uuid).toBeTruthy()               
        
    });


    it('should throw if Data Base throw', async () => {
        const sutAddAccountAdapter = new AddAccountAdapter(connection)
        jest.spyOn(connection.getRepository(Account), "save").mockImplementationOnce(() => Promise.reject(new Error()))

        const accountData: AccountData = {
            name: 'valid_name',
            email: 'valid_email',
            password:  'valid_password', 
        }

        const newAccount = sutAddAccountAdapter.add(accountData);
        await expect(newAccount).rejects.toThrow()
        
    });
});