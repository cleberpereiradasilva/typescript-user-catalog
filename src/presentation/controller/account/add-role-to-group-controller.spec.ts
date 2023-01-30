import { AddGroup, AddRoleToGroup, GetGroupById, GetRoleById } from "../../../domain/usecase/account";
import { GroupData, RoleData } from "../../../domain/usecase/account/type";
import { GroupModel, RoleModel } from "../../../domain/usecase/model";
import { httpBadRequest, httpMissingParameter } from "../helper/http-response";
import { AddRoleToGroupController } from "./add-role-to-group-controller";

type SutType = {
    sutAddRoleToGroupController: AddRoleToGroupController;
    getRoleByIdStub: GetRoleById;
    getGroupByIdStub: GetGroupById;
    addRoleToGroupStub: AddRoleToGroup

}

const fakeGroup: GroupModel = {
    id: 1,
    uuid: 'valid_uuid',
    description: 'valid_description',
    roles: []            
}
const fakeRole: RoleModel = {
    id: 1,
    uuid: 'valid_uuid',
    description: 'valid_description'               
}

const makeSut = (): SutType => {

    class GetRoleByIdStub implements GetRoleById{
        getById(id: number): Promise<RoleModel | null> {
            return Promise.resolve(fakeRole)
        }
    }

    class GetGroupByIdStub implements GetGroupById{
        getById(id: number): Promise<GroupModel | null> {
            return new Promise(resolve => resolve(fakeGroup))
        }
    }

    class AddRoleToGroupStub implements AddRoleToGroup{
        addRole(groupModel: GroupModel, roles: RoleModel[]): Promise<GroupModel | null> {
            return new Promise(resolve => resolve(fakeRole))
        }
    }

    const getRoleByIdStub = new GetRoleByIdStub()
    const getGroupByIdStub = new GetGroupByIdStub()
    const addRoleToGroupStub = new AddRoleToGroupStub()

    const sutAddRoleToGroupController = new AddRoleToGroupController(
        getRoleByIdStub,
        getGroupByIdStub,
        addRoleToGroupStub
    )

    return {
        sutAddRoleToGroupController,
        getRoleByIdStub,
        getGroupByIdStub,
        addRoleToGroupStub     
    }
}

describe('Test account group Controller', () => {
    it('Should dependencies with correct values', async () => {
        const { sutAddRoleToGroupController, getGroupByIdStub, addRoleToGroupStub, getRoleByIdStub } = makeSut();
        const requestData: any = {
            body: {
                'groupId': 1,
                'roles': [1,2]
            }
        }
        const getGroupByIdSpy = jest.spyOn(getGroupByIdStub, 'getById')
        const getRolesByIdSpy = jest.spyOn(getRoleByIdStub, 'getById')
        const addRoleSpy = jest.spyOn(addRoleToGroupStub, 'addRole')
        
        await sutAddRoleToGroupController.handle(requestData);
        expect(getGroupByIdSpy).toBeCalledWith(requestData.body.groupId)
        expect(getRolesByIdSpy).toBeCalledWith(requestData.body.roles[0])
        expect(getRolesByIdSpy).toBeCalledWith(requestData.body.roles[1])
        expect(addRoleSpy).toBeCalledWith(fakeGroup, [fakeRole, fakeRole])
    });

    it('Should return status 400 when groupId is not provided', async () => {
        const { sutAddRoleToGroupController } = makeSut();
        const requestData: any = {
            body: {
                'roles': [1,2]
            }
        }
        
        
        const response = await sutAddRoleToGroupController.handle(requestData);
        expect(response.statusCode).toBe(400)
    });

    it('Should return status 400 when roles is not provided', async () => {
        const { sutAddRoleToGroupController } = makeSut();
        const requestData: any = {
            body: {
                'groupId': 1,
            }
        }
        
        const response = await sutAddRoleToGroupController.handle(requestData);
        expect(response.statusCode).toBe(400)
    });

    it('Should return status 400 when group is not found', async () => {
        const { sutAddRoleToGroupController, getGroupByIdStub } = makeSut();
        const requestData: any = {
            body: {
                'groupId': 1,
                'roles': [1,2]
            }
        }

        jest.spyOn(getGroupByIdStub, 'getById').mockImplementationOnce(() => Promise.resolve(null))
        const response = await sutAddRoleToGroupController.handle(requestData);
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({
            'message': 'Group not found'
        })
    });

    it('Should return status 400 when roles are not found', async () => {
        const { sutAddRoleToGroupController, getRoleByIdStub } = makeSut();
        const requestData: any = {
            body: {
                'groupId': 1,
                'roles': [1]
            }
        }

        jest.spyOn(getRoleByIdStub, 'getById').mockImplementationOnce(() => Promise.resolve(null))
        const response = await sutAddRoleToGroupController.handle(requestData);
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({
            'message': 'No roles found'
        })
    });

    it('Should return status 500 if getGroupById throw', async () => {
        const { sutAddRoleToGroupController, getGroupByIdStub } = makeSut();
        const requestData: any = {
            body: {
                'groupId': 1,
                'roles': [1]
            }
        }
        jest.spyOn(getGroupByIdStub, 'getById').mockImplementation(() => Promise.reject(new Error()))

        const httpResponse = await sutAddRoleToGroupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new Error())
    });

});