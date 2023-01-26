import { GroupModel } from "../model";
export interface GetGroupById{
    getById: (id: number) => Promise<GroupModel | null>
}