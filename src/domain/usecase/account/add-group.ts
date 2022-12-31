import { GroupModel } from "../model";
export interface AddGroup{
    add: (description: string) => Promise<GroupModel | null>
}