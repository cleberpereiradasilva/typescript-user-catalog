import { faker } from "@faker-js/faker";
import { DataSource, EntityMetadataNotFoundError } from "typeorm";
import { AccountData } from "../../../../domain/usecase/account/type";
import { AppDataSource } from "../db/sqlite-data-source";
import { Account } from "../entity/account";
import { Group } from "../entity/group";
import { AddAccountAdapter } from "./add-account-adapter";
import { AddGroupAdapter } from "./add-group-adapter";
import { GetAccountByIdAdapter } from "./get-account-by-id-adapter";

const accountData: AccountData = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password:  faker.internet.password()
}

describe('GetAccount Repository by Id', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        await connection.getRepository(Account).delete({})
        await connection.getRepository(Group).delete({})
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('should get a account in database using id', async () => {
        const sutAddAccountAdapter = new AddAccountAdapter(connection)
        const sutAddGroupAdapter = new AddGroupAdapter(connection)
        const newGroup = await sutAddGroupAdapter.insert({description: faker.commerce.department()});
        accountData.group = newGroup || undefined
        const accountInserted = await sutAddAccountAdapter.insert(accountData);

        const sutGetAccountAdapter = new GetAccountByIdAdapter(connection)
        const accountById = await sutGetAccountAdapter.getAccountById(accountInserted.id)
        expect(accountById.id).toBeTruthy()
    });


    it('should throw if Data Base throw', async () => {
        jest.spyOn(connection.getRepository(Account), 'findOne').mockImplementationOnce(() =>  Promise.reject(new Error()) )
        const sutGetAccountAdapter = new GetAccountByIdAdapter(connection)
        const accountById =  sutGetAccountAdapter.getAccountById(1)
        expect(await accountById).toEqual(new Error())
    });


    it('should throw if Data Base throw with instance EntityMetadataNotFoundError return', async () => {
        jest.spyOn(connection.getRepository(Account), 'findOne').mockImplementationOnce(() =>  Promise.reject(new EntityMetadataNotFoundError(Account)) )
        const sutGetAccountAdapter = new GetAccountByIdAdapter(connection)
        const accountById =  await sutGetAccountAdapter.getAccountById(1)
        expect(accountById).not.toBeTruthy()
    });
});