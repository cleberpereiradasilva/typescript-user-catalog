import { AddAccount } from "../../../domain/usecase/account";
import { AccountData } from "../../../domain/usecase/account/type";
import { AccountModel } from "../../../domain/usecase/model";
import { BadRequest } from "../helper/http-response";
import { Controller, EmailValidator, PasswordValidator } from "../protocols/interface";
import { SignupController } from "./signup-controller";

type SutType = {
    emailValidatorStub: EmailValidator;
    sutSignupController: Controller;
    addAcountStub: AddAccount;
    passwordValidatorStub: PasswordValidator;
}

const makeSut = (): SutType => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }

    class PasswordValidatorStub implements PasswordValidator{
        isValid(email: string): boolean {
            return true
        }
    }

    class AddAcountStub implements AddAccount{
        add(accountData: AccountData): Promise<AccountModel> {
            return new Promise(resolve => resolve({
                id: 1,
                uuid: 'valid_uuid',
                name: 'valid_name',
                email: 'valid_email',
                password: 'valid_password',
                groups: [{
                    id: 1,
                    uuid: 'valid_uuid',
                    description: 'valid_description',
                }]
            }))
        }
    }

    const emailValidatorStub = new EmailValidatorStub();
    const addAcountStub = new AddAcountStub();
    const passwordValidatorStub = new PasswordValidatorStub();
    const sutSignupController = new SignupController(
        emailValidatorStub, 
        addAcountStub, 
        passwordValidatorStub
    )

    return {
        emailValidatorStub, 
        sutSignupController,
        addAcountStub,
        passwordValidatorStub
    }
}


describe('Test signup Controller', () => {
    it('Should return status 200 when all data is provided', async () => {
        const { sutSignupController, addAcountStub } = makeSut();
        const requestData: any = {
            body: {
                'name': 'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        jest.spyOn(addAcountStub, 'add').mockImplementationOnce(() => new Promise(resolve => resolve({
            id: 1,
            uuid: 'valid_uuid',
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
            groups: [{
                id: 1,
                uuid: 'valid_uuid',
                description: 'valid_description',
            }]
        })))

        const response = await sutSignupController.handle(requestData);
        expect(addAcountStub.add).toBeCalledWith({
            'name': 'valid_name',
            'email':'valid_email',
            'password': 'valid_password'            
        })
        expect(response.statusCode).toBe(200)
    });

    it('Should return status 500 if account not created', async () => {
        const { sutSignupController, addAcountStub } = makeSut();
        const requestData: any = {
            body: {
                'name': 'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        jest.spyOn(addAcountStub, 'add').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))

        const response = await sutSignupController.handle(requestData);
      
        expect(response.statusCode).toBe(500)
    });

    it('Should return status 500', async () => {
        const { sutSignupController, addAcountStub } = makeSut();
        const requestData: any = {
            body: {
                'name': 'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        jest.spyOn(addAcountStub, 'add').mockImplementationOnce(() => { throw new Error() })
        const response = await sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(500)
    });

    it('Should return status 400 when name is not provided', async () => {
        const { sutSignupController } = makeSut();
        const requestData: any = {
            body: {
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = await sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(await BadRequest(`Parameter 'name' is required`))
    });

    it('Should return status 400 when email is not provided', async () => {
        const { sutSignupController } = makeSut();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = await sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(await BadRequest(`Parameter 'email' is required`))
    });

    it('Should return status 400 when password is not provided', async () => {
        const { sutSignupController } = makeSut();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'valid_email',
                'confirmation': 'valid_password'
            }
        }
        const response = await sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(await BadRequest(`Parameter 'password' is required`))
    });

    it('Should return status 400 when confirmation is not provided', async () => {
        const { sutSignupController } = makeSut();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'valid_email',
                'password': 'valid_password'
            }
        }
        const response = await sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(await BadRequest(`Parameter 'confirmation' is required`))
    });

    it('Should return status 400 when confirmation is diferent to password', async () => {
        const { sutSignupController } = makeSut();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'invvalid_password'
            }
        }
        const response = await sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(await BadRequest(`Parameter 'confirmation' is invalid`))
    });


    it('Should return status 400 when email is invalid', async () => {
        const { sutSignupController, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => false)

        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'invalid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = await sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(emailValidatorStub.isValid).toBeCalledWith(requestData.body.email);
        expect(response).toEqual(await BadRequest(`Parameter 'email' is invalid`))
    });

    it('Should return status 400 when password is invalid', async () => {
        const { sutSignupController, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, 'isValid').mockImplementationOnce(() => false)

        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'invalid_email',
                'password': 'invalid_password',
                'confirmation': 'invalid_password'
            }
        }
        const response = await sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(await BadRequest(`Parameter 'password' is invalid`))
    });

});