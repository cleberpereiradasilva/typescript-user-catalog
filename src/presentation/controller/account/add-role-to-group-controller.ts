import { GetGroupById, GetRoleById, AddRoleToGroup } from "../../../domain/usecase/account";
import { RoleModel } from "../../../domain/usecase/model";
import { httpBadRequest, httpServerError, httpResponseOk, httpMissingParameter } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class AddRoleToGroupController implements Controller{
    constructor(
        private readonly getRoleById: GetRoleById,
        private readonly getGroupById: GetGroupById,
        private readonly addRoleToGroup: AddRoleToGroup
    ){}

    handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
        try{
            const { body } = httpRequest;
            const required = ['groupId', 'roles'];
            for (const field of required){
                if(!body[field]){
                    return httpMissingParameter(`${field}`)
                }
            }

            const {groupId, roles} = body
            const rolesId: number[] = roles
            const groupModel = await this.getGroupById.getById(groupId)

            if(!groupModel){
                return httpBadRequest('Group not found')
            }

            const rolesModel = await Promise.all(
                rolesId.map(async (roleId) => await this.getRoleById.getById(roleId))
            )
            if(rolesModel.filter(role => role !== null).length === 0){
                return httpBadRequest('No roles found')
            }

            await this.addRoleToGroup.addRole(groupModel, rolesModel)
            return httpResponseOk('')

        }catch(error){
            return httpServerError(error as unknown as Error)
        }
    }
}