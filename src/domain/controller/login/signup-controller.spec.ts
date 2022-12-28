import { BadRequest } from "../helper/error";
import { Controller, EmailValidator } from "../helper/interface";
import { SignupController } from "./signup-controller";

type SutType = {
    emailValidatorStub: EmailValidator;
    sutSignupController: Controller;
}

const makeSutSigunupController = (): SutType => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub();
    const sutSignupController = new SignupController(emailValidatorStub)

    return {
        emailValidatorStub, 
        sutSignupController
    }
}


describe('Test signup Controller', () => {
    it('Should return status 200 when name is provided', () => {
        const { sutSignupController } = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name': 'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handle(requestData);
        expect(response.statusCode).toBe(200)
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