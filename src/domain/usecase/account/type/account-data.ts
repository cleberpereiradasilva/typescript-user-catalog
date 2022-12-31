import { GroupModel } from "../../model";

export type AccountData = {
    name: string;
    email: string;
    password: string; 
    group?: GroupModel | undefined
}
