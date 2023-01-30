import { RoleModel } from "../../../../domain/usecase/model";

export interface GetRoleByidRepository{
    getById: (id: number) => Promise<RoleModel | null>
}