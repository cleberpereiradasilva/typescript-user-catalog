import { DataSource } from "typeorm";
import { RoleData } from "../../../../domain/usecase/account/type";
import { AppDataSource } from "../db/jest-pg-data-source";
import { Role } from "../entity/role";
import { AddRoleAdapter } from "./add-role-adapter";

describe('Add User Role Repository', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        await connection.getRepository(Role).delete({})
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('should insert a account role in database', async () => {
        const sutAddRoleAdapter = new AddRoleAdapter(connection)
        const roleData: RoleData = {
            description: 'valid_description_a',
        }
        const newGroup = await sutAddRoleAdapter.insert(roleData);
        expect(newGroup?.id).toBeTruthy()
        expect(newGroup?.uuid).toBeTruthy()               
        
    });

    it('should throw if Data Base throw', async () => {
        const sutAddRoleAdapter = new AddRoleAdapter(connection)
        jest.spyOn(connection.getRepository(Role), "save").mockImplementationOnce(() => Promise.reject(new Error()))
        const roleData: RoleData = {
            description: 'valid_description_b',
        }
        const newGroup = sutAddRoleAdapter.insert(roleData);
        await expect(newGroup).rejects.toThrow()
        
    });
});