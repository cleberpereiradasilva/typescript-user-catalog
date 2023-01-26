import { GroupModel } from "../../../../domain/usecase/model";

export interface GetGroupByidRepository{
    getById: (id: number) => Promise<GroupModel | null>
}