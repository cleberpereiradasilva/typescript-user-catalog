import { GroupModel } from "../model";
import { GroupData } from "./type";
export interface AddGroup{
    add: (groupData: GroupData) => Promise<GroupModel | null>
}