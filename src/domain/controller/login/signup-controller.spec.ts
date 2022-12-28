import { SignupController } from "./signup-controller";

const makeSutSigunupController = (): SignupController => {
    return new SignupController()
}


describe('Test signup Controller', () => {
    it('Should return status 200 when name is provided', () => {
        const sutSignupController = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name': 'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handler(requestData);
        expect(response.statusCode).toBe(200)
    });

    it('Should return status 400 when name is not provided', () => {
        const sutSignupController = makeSutSigunupController();
        const requestData: any = {
            body: {
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handler(requestData);
        expect(response.statusCode).toBe(400);
        expect(response.message).toBe(`Parameter 'name' is required`)
    });

    it('Should return status 400 when email is not provided', () => {
        const sutSignupController = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handler(requestData);
        expect(response.statusCode).toBe(400);
        expect(response.message).toBe(`Parameter 'email' is required`)
    });

    it('Should return status 400 when password is not provided', () => {
        const sutSignupController = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'valid_email',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handler(requestData);
        expect(response.statusCode).toBe(400);
        expect(response.message).toBe(`Parameter 'password' is required`)
    });

    it('Should return status 400 when confirmation is not provided', () => {
        const sutSignupController = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'valid_email',
                'password': 'valid_password'
            }
        }
        const response = sutSignupController.handler(requestData);
        expect(response.statusCode).toBe(400);
        expect(response.message).toBe(`Parameter 'confirmation' is required`)
    });

    it('Should return status 400 when confirmation is diferent to password', () => {
        const sutSignupController = makeSutSigunupController();
        const requestData: any = {
            body: {
                'name':'valid_name',
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'invvalid_password'
            }
        }
        const response = sutSignupController.handler(requestData);
        expect(response.statusCode).toBe(400);
        expect(response.message).toBe(`Parameter 'confirmation' is invalid`)
    });

    

});