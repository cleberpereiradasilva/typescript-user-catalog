import { faker } from "@faker-js/faker";
import { DataSource, EntityMetadataNotFoundError } from "typeorm";
import { GroupData } from "../../../../domain/usecase/account/type";
import { AppDataSource } from "../db/jest-pg-data-source";
import { Group } from "../entity/group";
import { GetGroupByIdAdapter } from "./get-group-by-id-adapter";
import { AddGroupAdapter } from "./add-group-adapter";


describe('GetAccount Repository by Id', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        await connection.getRepository(Group).delete({})
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('should get a account in database using id', async () => {
        const sutGetGroupByIdAdapter = new GetGroupByIdAdapter(connection)
        const sutAddGroupAdapter = new AddGroupAdapter(connection)
        const groupData: GroupData = {
            description: faker.commerce.department()
        }

        const newGroup = await sutAddGroupAdapter.insert({...groupData});
        const savedGroup = await sutGetGroupByIdAdapter.getById(newGroup.id)

        expect(savedGroup.id).toBeTruthy()
    });


    it('should throw if Data Base throw', async () => {
        jest.spyOn(connection.getRepository(Group), 'findOne').mockImplementationOnce(() =>  Promise.reject(new Error()) )
        const sutGetGroupByIdAdapter = new GetGroupByIdAdapter(connection)
        const accountById =  sutGetGroupByIdAdapter.getById(1)
        expect(await accountById).toEqual(new Error())
    });


    it('should throw if Data Base throw with instance EntityMetadataNotFoundError return', async () => {
        jest.spyOn(connection.getRepository(Group), 'findOne').mockImplementationOnce(() =>  Promise.reject(new EntityMetadataNotFoundError(Group)) )
        const sutGetAccountAdapter = new GetGroupByIdAdapter(connection)
        const accountById =  await sutGetAccountAdapter.getById(1)
        expect(accountById).not.toBeTruthy()
    });
});