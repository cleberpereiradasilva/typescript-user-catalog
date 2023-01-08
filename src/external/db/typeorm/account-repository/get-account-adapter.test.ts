import { DataSource } from "typeorm";
import { AccountData } from "../../../../domain/usecase/account/type";
import { AppDataSource } from "../db/jest-pg-data-source";
import { Account } from "../entity/account";
import { Group } from "../entity/group";
import { AddAccountAdapter } from "./add-account-adapter";
import { AddGroupAdapter } from "./add-group-adapter";
import { GetAccountAdapter } from "./get-account-adapter";


const accountData: AccountData = {
    name: 'valid_name',
    email: 'valid_email_b@mail.com',
    password:  'valid_password_1Q#', 
}

describe('GetAccount Repository', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        await connection.getRepository(Account).delete({})
        await connection.getRepository(Group).delete({})
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('should get a account in database using email', async () => {
        const sutAddAccountAdapter = new AddAccountAdapter(connection)
        const sutAddGroupAdapter = new AddGroupAdapter(connection)
        const newGroup = await sutAddGroupAdapter.insert({description: 'group with valid namegroup b'});
        accountData.group = newGroup || undefined
        await sutAddAccountAdapter.insert(accountData);

        const sutGetAccountAdapter = new GetAccountAdapter(connection)
        const accountByEmail = await sutGetAccountAdapter.getAccountByEmail('valid_email_b@mail.com')
        expect(accountByEmail?.id).toBeTruthy()
    });


    it('should throw if Data Base throw', async () => {
        jest.spyOn(connection.getRepository(Account), 'findOneBy').mockImplementationOnce(() => Promise.reject(new Error()))
        const sutGetAccountAdapter = new GetAccountAdapter(connection)
        const accountByEmail =  sutGetAccountAdapter.getAccountByEmail('valid_email_b@mail.com')
        await expect(accountByEmail).rejects.toThrow()
        
    });
});