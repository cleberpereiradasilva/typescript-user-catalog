import { AccountData, AccountDTO, AddAccount } from "../../../usecase/account";
import { AccountModel } from "../../../usecase/model";
import { BadRequest } from "../helper/http-response";
import { Controller, EmailValidator } from "../helper/interface";
import { SignupController } from "./signup-controller";

type SutType = {
    emailValidatorStub: EmailValidator;
    sutSignupController: Controller;
    addAcountStub: AddAccount;
}

const makeSutSigunupController = (): SutType => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }

    class AddAcountStub implements AddAccount{
        add(accountData: AccountData): AccountDTO {
            return {
                id: 1,
                uuid: 'valid_uuid',
                name: 'valid_name',
                email: 'valid_email',
            }
        }
    }

    const emailValidatorStub = new EmailValidatorStub();
    const addAcountStub = new AddAcountStub();
    const sutSignupController = new SignupController(emailValidatorStub, addAcountStub)

    return {
        emailValidatorStub, 
        sutSignupController,
        addAcountStub
    }
}


describe('Test signup Controller', () => {
    it('Should return status 200 when all data is provided', () => {
        const { sutSignupController, addAcountStub } = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name': 'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        jest.spyOn(addAcountStub, 'add').mockImplementationOnce(() => ({
            id: 1,
            uuid: 'valid_uuid',
            name: 'valid_name',
            email: 'valid_email',
        }))

        const response = sutSignupController.handle(requestData);
        expect(addAcountStub.add).toBeCalledWith({
            'name': 'valid_name',
            'email':'valid_email',
            'password': 'valid_password'            
        })
        expect(response.statusCode).toBe(200)
    });

    it('Should return status 500', () => {
        const { sutSignupController, addAcountStub } = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name': 'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        jest.spyOn(addAcountStub, 'add').mockImplementationOnce(() => undefined)
        const response = sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(500)
    });

    it('Should return status 400 when name is not provided', () => {
        const { sutSignupController } = makeSutSigunupController();
        const requestData: any = {
            body: {
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(BadRequest(`Parameter 'name' is required`))
    });

    it('Should return status 400 when email is not provided', () => {
        const { sutSignupController } = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(BadRequest(`Parameter 'email' is required`))
    });

    it('Should return status 400 when password is not provided', () => {
        const { sutSignupController } = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'valid_email',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(BadRequest(`Parameter 'password' is required`))
    });

    it('Should return status 400 when confirmation is not provided', () => {
        const { sutSignupController } = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'valid_email',
                'password': 'valid_password'
            }
        }
        const response = sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(BadRequest(`Parameter 'confirmation' is required`))
    });

    it('Should return status 400 when confirmation is diferent to password', () => {
        const { sutSignupController } = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'invvalid_password'
            }
        }
        const response = sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(BadRequest(`Parameter 'confirmation' is invalid`))
    });


    it('Should return status 400 when email is invalid', () => {
        const { sutSignupController, emailValidatorStub } = makeSutSigunupController();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => false)

        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'invvalid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(400);
        expect(response).toEqual(BadRequest(`Parameter 'email' is invalid`))
    });

});