import { faker } from "@faker-js/faker";
import { DataSource, EntityMetadataNotFoundError } from "typeorm";
import { AccountData } from "../../../../domain/usecase/account/type";
import { AppDataSource } from "../db/jest-pg-data-source";
import { Account } from "../entity/account";
import { Group } from "../entity/group";
import { AddAccountAdapter } from "./add-account-adapter";
import { AddGroupAdapter } from "./add-group-adapter";
import { GetAccountByEmaiAdapter } from "./get-account-by-email-adapter";

const accountData: AccountData = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password:  faker.internet.password()
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

        const sutGetAccountAdapter = new GetAccountByEmaiAdapter(connection)
        const accountByEmail = await sutGetAccountAdapter.getAccountByEmail(accountData.email)
        expect(accountByEmail?.id).toBeTruthy()
    });


    it('should throw if Data Base throw', async () => {
        jest.spyOn(connection.getRepository(Account), 'findOne').mockImplementationOnce(() =>  Promise.reject(new Error()) )
        const sutGetAccountAdapter = new GetAccountByEmaiAdapter(connection)
        const accountByEmail =  sutGetAccountAdapter.getAccountByEmail(accountData.email)
        expect(await accountByEmail).toEqual(new Error())
    });


    it('should throw if Data Base throw with instance EntityMetadataNotFoundError return', async () => {
        jest.spyOn(connection.getRepository(Account), 'findOne').mockImplementationOnce(() =>  Promise.reject(new EntityMetadataNotFoundError(Account)) )
        const sutGetAccountAdapter = new GetAccountByEmaiAdapter(connection)
        const accountByEmail =  await sutGetAccountAdapter.getAccountByEmail(accountData.email)
        expect(accountByEmail).not.toBeTruthy()
    });
});