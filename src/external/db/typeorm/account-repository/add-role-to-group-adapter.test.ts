import { faker } from "@faker-js/faker";
import { DataSource } from "typeorm";
import { GroupData, RoleData } from "../../../../domain/usecase/account/type";
import { GroupModel, RoleModel } from "../../../../domain/usecase/model";
import { AppDataSource } from "../db/sqlite-data-source";
import { Group } from "../entity/group";
import { Role } from "../entity/role";
import { AddGroupAdapter } from "./add-group-adapter";
import { AddRoleAdapter } from "./add-role-adapter";
import { AddRoleToGroupAdapter } from "./add-role-to-group-adapter";
import { GetGroupByIdAdapter } from "./get-group-by-id-adapter";

describe('Add Role Group Repository', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        await connection.getRepository(Group).delete({})
        await connection.getRepository(Role).delete({})
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('should insert a role in group in database', async () => {
        const sutAddRoleToGroupAdapter = new AddRoleToGroupAdapter(connection)
        const sutAddGroupAdapter = new AddGroupAdapter(connection)
        const sutAddRoleAdapter = new AddRoleAdapter(connection)
        const groupData: GroupData = {
            description: faker.commerce.department(),
        }
        const newGroup = await sutAddGroupAdapter.insert(groupData);

        const roleData: RoleData = {
            description: faker.commerce.productName(),
        }
        const newRole = await sutAddRoleAdapter.insert(roleData)

        const newGroupWithRole = await sutAddRoleToGroupAdapter.addRole(newGroup, [newRole])

        expect(newGroup?.id).toBeTruthy()
        expect(newGroup?.uuid).toBeTruthy()  
        expect(newGroupWithRole?.roles?.[0].description).toBe(roleData.description)
        
    });



    it('should throw if Data Base throw', async () => {
        const sutAddRoleToGroupAdapter = new AddRoleToGroupAdapter(connection)
        jest.spyOn(connection.getRepository(Group), "save").mockImplementationOnce(() => Promise.reject(new Error()))
        const roleMode: RoleModel = {
            id: 1,
            uuid: 'valid_uuid',
            description: faker.commerce.product() 
        }

        const groupModel: GroupModel = {
            id: 1,
            uuid: 'valid_uuid',
            description: faker.commerce.product() 
        }
        const newGroupWithRole = sutAddRoleToGroupAdapter.addRole(groupModel, [roleMode]);
        await expect(newGroupWithRole).rejects.toThrow()
        
    });
});