import { AddGroup } from "../../../domain/usecase/account";
import { GroupData } from "../../../domain/usecase/account/type";
import { GroupModel } from "../../../domain/usecase/model";
import { httpBadRequest, httpMissingParameter } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { AddGroupController } from "./group-controller";

type SutType = {
    sutAddGroupController: Controller;
    addGroupStub: AddGroup;
}

const makeSut = (): SutType => {

    class AddGroupStub implements AddGroup{
        add(groupData: GroupData): Promise<GroupModel> {
            return new Promise(resolve => resolve({
                id: 1,
                uuid: 'valid_uuid',
                description: 'valid_description'               
            }))
        }
    }

    const addGroupStub = new AddGroupStub();
    const sutAddGroupController = new AddGroupController(
        addGroupStub
    )

    return {
        addGroupStub,
        sutAddGroupController      
    }
}


describe('Test account group Controller', () => {
    it('Should return status 200 when all data is provided', async () => {
        const { sutAddGroupController, addGroupStub } = makeSut();
        const requestData: any = {
            body: {
                'description': 'valid_description',
            }
        }
        jest.spyOn(addGroupStub, 'add').mockImplementationOnce(() => new Promise(resolve => resolve({
            id: 1,
            uuid: 'valid_uuid',
            description: 'valid_description',
        })))

        const httpResponse = await sutAddGroupController.handle(requestData);
        expect(addGroupStub.add).toBeCalledWith({'description': 'valid_description'})
        expect(httpResponse.statusCode).toBe(200)
    });

    it('Should return status 500 if group not created', async () => {
        const { sutAddGroupController, addGroupStub } = makeSut();
        const requestData: any = {
            body: {
                'description': 'valid_description',
            }
        }
        jest.spyOn(addGroupStub, 'add').mockImplementation(() => Promise.reject(new Error()))

        const httpResponse = await sutAddGroupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new Error())
    });

    it('Should return status 500 if group throw without Error', async () => {
        const { sutAddGroupController, addGroupStub } = makeSut();
        const requestData: any = {
            body: {
                'description': 'valid_description',
            }
        }
        jest.spyOn(addGroupStub, 'add').mockImplementation(() => Promise.reject())

        const httpResponse = await sutAddGroupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new Error('Internal Server Error'))
    });

    it('Should return status 500 duplicate key', async () => {
        const { sutAddGroupController, addGroupStub } = makeSut();
        const requestData: any = {
            body: {
                'description': 'valid_description',
            }
        }
        jest.spyOn(addGroupStub, 'add').mockImplementation(() => Promise.reject(new Error('duplicate key')))

        const httpResponse = await sutAddGroupController.handle(requestData);
      
        expect(httpResponse.statusCode).toBe(500)
        
    });


    it('Should return status 400 when description is not provided', async () => {
        const { sutAddGroupController } = makeSut();
        const requestData: any = {
            body: {
                'descriptions': 'valid_description',
            }
        }
        const httpResponse = await sutAddGroupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(await httpMissingParameter('description'))
    });
   

    it('Should return status 400 when description is very short', async () => {
        const { sutAddGroupController } = makeSut();
        const requestData: any = {
            body: {
                'description': 'v',
            }
        }
        const httpResponse = await sutAddGroupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(await httpBadRequest(`Parameter 'description' is required with more than 10 chars`))
    });

});