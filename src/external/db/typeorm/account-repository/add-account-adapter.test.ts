import { faker } from "@faker-js/faker";
import { DataSource } from "typeorm";
import { AccountData } from "../../../../domain/usecase/account/type";
import { AppDataSource } from "../db/sqlite-data-source";
import { Account } from "../entity/account";
import { Group } from "../entity/group";
import { AddAccountAdapter } from "./add-account-adapter";
import { AddGroupAdapter } from "./add-group-adapter";

const accountData: AccountData = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password:  faker.internet.password()
}

describe('AddAccount Repository', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        await connection.getRepository(Account).delete({})
        await connection.getRepository(Group).delete({})
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('should insert a account in database', async () => {
        const sutAddAccountAdapter = new AddAccountAdapter(connection)
        const sutAddGroupAdapter = new AddGroupAdapter(connection)
        const newGroup = await sutAddGroupAdapter.insert({description: faker.commerce.department()});
        accountData.group = newGroup || undefined
        const newAccount = await sutAddAccountAdapter.insert(accountData);
        expect(newAccount?.id).toBeTruthy()
        expect(newAccount?.uuid).toBeTruthy()     
        expect(newAccount?.groups[0].uuid).toBeTruthy()      
        
    });


    it('should throw if Data Base throw', async () => {
        const sutAddAccountAdapter = new AddAccountAdapter(connection)
        jest.spyOn(connection.getRepository(Account), "save").mockImplementationOnce(() => Promise.reject(new Error()))
        const newAccount = sutAddAccountAdapter.insert(accountData);
        await expect(newAccount).rejects.toThrow()
    });
});
