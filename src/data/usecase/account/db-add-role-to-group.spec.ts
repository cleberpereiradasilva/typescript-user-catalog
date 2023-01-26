import { faker } from "@faker-js/faker";
import { GroupData } from "../../../domain/usecase/account/type";
import { GroupModel, RoleModel } from "../../../domain/usecase/model";
import { DbAddRoleToGroup } from "./db-add-role-to-group";
import { AddRoleToGroupRepository } from "./protocols";

type SutType = {
    sutDbAddRoleToGroup: DbAddRoleToGroup
    addRoleToGroupRepositoryStub: AddRoleToGroupRepository
}

const makeSut = (): SutType => {
    class AddRoleToGroupRepositoryStub implements AddRoleToGroupRepository{
        addRole = (group: GroupModel, roles: RoleModel[]) : Promise<GroupModel> => {
            const newArrayRoles: RoleModel[] = (group?.roles || []).concat(roles)
            group.roles = newArrayRoles
            return Promise.resolve(group)
        }
    }

    const addRoleToGroupRepositoryStub = new AddRoleToGroupRepositoryStub()
    const sutDbAddRoleToGroup = new DbAddRoleToGroup(addRoleToGroupRepositoryStub);

    return {
        sutDbAddRoleToGroup,
        addRoleToGroupRepositoryStub
    }
}

describe('DbAddGroup', () => {
    it('Should call AddRoleToGroupRepository with correct values', async () => {
        const {addRoleToGroupRepositoryStub, sutDbAddRoleToGroup} = makeSut()

        const groupModel: GroupModel = {
            id: 1,
            uuid: 'valid_uuid',
            description: faker.commerce.product() 
        }

        const fakeRole: RoleModel = {
            id: 1,
            uuid: 'valid_uuid',
            description: faker.commerce.product()
        }

        const addSpyOn = jest.spyOn(addRoleToGroupRepositoryStub, 'addRole')
        const newGroup = await sutDbAddRoleToGroup.addRole(groupModel, [fakeRole]);

        expect(addSpyOn).toBeCalledWith(groupModel, [fakeRole])
        expect(newGroup).toEqual({...groupModel, id: 1, uuid: 'valid_uuid', roles: [fakeRole]})
            
    });


    it('Should throws if AddRoleToGroupRepository throws', async () => {
        const {addRoleToGroupRepositoryStub, sutDbAddRoleToGroup} = makeSut()
        const groupModel: GroupModel = {
            id: 1,
            uuid: 'valid_uuid',
            description: faker.commerce.product() 
        }

        const fakeRole: RoleModel = {
            id: 1,
            uuid: 'valid_uuid',
            description: faker.commerce.product()
        }

        jest.spyOn(addRoleToGroupRepositoryStub, 'addRole').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
        const account = sutDbAddRoleToGroup.addRole(groupModel, [fakeRole]);

        expect(account).rejects.toThrow()
    });


});