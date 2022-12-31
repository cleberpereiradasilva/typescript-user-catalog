import { AddGroup } from "../../../domain/usecase/account";
import { GroupModel } from "../../../domain/usecase/model";
import { BadRequest } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { AddGroupController } from "./group-controller";

type SutType = {
    sutAddGroupController: Controller;
    addGroupStub: AddGroup;
}

const makeSut = (): SutType => {

    class AddGroupStub implements AddGroup{
        add(group: string): Promise<GroupModel> {
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

        const response = await sutAddGroupController.handle(requestData);
        expect(addGroupStub.add).toBeCalledWith('valid_description')
        expect(response.statusCode).toBe(200)
    });

    it('Should return status 500 if group not created', async () => {
        const { sutAddGroupController, addGroupStub } = makeSut();
        const requestData: any = {
            body: {
                'description': 'valid_description',
            }
        }
        jest.spyOn(addGroupStub, 'add').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))

        const response = await sutAddGroupController.handle(requestData);
      
        expect(response.statusCode).toBe(500)
    });


    it('Should return status 400 when description is not provided', async () => {
        const { sutAddGroupController } = makeSut();
        const requestData: any = {
            body: {
                'descriptions': 'valid_description',
            }
        }
        const response = await sutAddGroupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(await BadRequest(`Parameter 'description' is required`))
    });
   

    it('Should return status 400 when description is very short', async () => {
        const { sutAddGroupController } = makeSut();
        const requestData: any = {
            body: {
                'description': 'v',
            }
        }
        const response = await sutAddGroupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(await BadRequest(`Parameter 'description' is required with more than 10 chars`))
    });

});