import { AddAccount } from "../../../domain/usecase/account";
import { AccountData } from "../../../domain/usecase/account/type";
import { AccountModel } from "../../../domain/usecase/model";
import { httpBadRequest, httpMissingParameter } from "../helper/http-response";
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

        const httpResponse = await sutSignupController.handle(requestData);
        expect(addAcountStub.add).toBeCalledWith({
            'name': 'valid_name',
            'email':'valid_email',
            'password': 'valid_password'            
        })
        expect(httpResponse.statusCode).toBe(200)
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
        jest.spyOn(addAcountStub, 'add').mockImplementationOnce(() => { throw new Error() })

        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new Error())
    });

    it('Should error 500 with message if Account throw without Error', async () => {
        const { sutSignupController, addAcountStub } = makeSut();
        const requestData: any = {
            body: {
                'name': 'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        jest.spyOn(addAcountStub, 'add').mockImplementation(() => Promise.reject())

        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new Error('Internal Server Error'))
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
        jest.spyOn(addAcountStub, 'add').mockImplementation(() => Promise.reject(new Error()))
        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(500)
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
        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(await httpMissingParameter('name'))
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
        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(await httpMissingParameter('email'))
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
        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(await httpMissingParameter('password'))
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
        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(await httpMissingParameter('confirmation'))
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
        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(await httpBadRequest(`Parameter 'confirmation' is invalid`))
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
        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(400);
        expect(emailValidatorStub.isValid).toBeCalledWith(requestData.body.email);
        expect(httpResponse).toEqual(await httpBadRequest(`Parameter 'email' is invalid`))
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
        const httpResponse = await sutSignupController.handle(requestData);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(await httpBadRequest(`Parameter 'password' is invalid`))
    });

});