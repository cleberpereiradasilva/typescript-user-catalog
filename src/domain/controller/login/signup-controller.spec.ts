import { EmailValidator, BadRequest } from "./helper";
import { SignupController } from "./signup-controller";

type SutType = {
    emailValidatorMock: EmailValidator;
    sutSignupController: SignupController;
}

const makeSutSigunupController = (): SutType => {
    class EmailValidatorMock implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    const emailValidatorMock = new EmailValidatorMock();
    const sutSignupController = new SignupController(emailValidatorMock)

    return {
        emailValidatorMock, 
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
        const { sutSignupController, emailValidatorMock } = makeSutSigunupController();
        jest.spyOn(emailValidatorMock, 'isValid').mockImplementationOnce(() => false)

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