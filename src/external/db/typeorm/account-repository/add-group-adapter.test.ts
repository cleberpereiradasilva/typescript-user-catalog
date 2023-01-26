import { faker } from "@faker-js/faker";
import { DataSource } from "typeorm";
import { GroupData } from "../../../../domain/usecase/account/type";
import { AppDataSource } from "../db/jest-pg-data-source";
import { Group } from "../entity/group";
import { AddGroupAdapter } from "./add-group-adapter";



describe('Add User Group Repository', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        await connection.getRepository(Group).delete({})
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('should insert a account group in database', async () => {
        const sutAddGroupAdapter = new AddGroupAdapter(connection)
        const groupData: GroupData = {
            description: faker.commerce.department(),
        }
        const newGroup = await sutAddGroupAdapter.insert(groupData);
        expect(newGroup?.id).toBeTruthy()
        expect(newGroup?.uuid).toBeTruthy()               
        
    });

    it('should throw if Data Base throw', async () => {
        const sutAddGroupAdapter = new AddGroupAdapter(connection)
        jest.spyOn(connection.getRepository(Group), "save").mockImplementationOnce(() => Promise.reject(new Error()))
        const groupData: GroupData = {
            description: faker.commerce.department(),
        }
        const newGroup = sutAddGroupAdapter.insert(groupData);
        await expect(newGroup).rejects.toThrow()
        
    });
});