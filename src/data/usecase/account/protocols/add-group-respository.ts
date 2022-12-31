import { GroupData } from "../../../../domain/usecase/account/type";
import { GroupModel } from "../../../../domain/usecase/model";

export interface AddGroupRepository{
    insert: (group: GroupData) => Promise<GroupModel | null>
}