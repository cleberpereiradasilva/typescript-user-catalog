import { GroupData } from "../../../domain/usecase/account/type";
import { GroupModel } from "../../../domain/usecase/model";
import { DbAddGroup } from "./db-add-group";
import { AddGroupRepository } from "./protocols";

type SutType = {
    sutDbAddGroup: DbAddGroup
    addGroupRepositoryStub: AddGroupRepository
}

const makeSut = (): SutType => {
    class AddGroupRepositoryStub implements AddGroupRepository{
        insert = (groupData: GroupData): Promise<GroupModel> => Promise.resolve({
            id: 1,
            uuid: 'valid_uuid',
            description: groupData.description  
        })
    }

    const addGroupRepositoryStub = new AddGroupRepositoryStub()
    const sutDbAddGroup = new DbAddGroup(addGroupRepositoryStub);

    return {
        sutDbAddGroup,
        addGroupRepositoryStub
    }
}

describe('DbAddGroup', () => {
    it('Should call AddGroupRepository with correct values', async () => {
        const {addGroupRepositoryStub, sutDbAddGroup} = makeSut()

        const groupData: GroupData = {
            description: 'valid_description'
        }

        const addSpyOn = jest.spyOn(addGroupRepositoryStub, 'insert')
        const newGroup = await sutDbAddGroup.add(groupData);

        expect(addSpyOn).toBeCalledWith(groupData)
        expect(newGroup).toEqual({...groupData, id: 1, uuid: 'valid_uuid'})
            
    });


    it('Should throws if AddGroupRepository throws', async () => {
        const {addGroupRepositoryStub, sutDbAddGroup} = makeSut()
        const groupData: GroupData = {
            description: 'valid_description'
        }

        jest.spyOn(addGroupRepositoryStub, 'insert').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
        const account = sutDbAddGroup.add(groupData);

        expect(account).rejects.toThrow()
    });


});