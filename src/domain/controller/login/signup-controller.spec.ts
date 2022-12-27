import { SignupController } from "./signup-controller";

describe('Test signup Controller', () => {
    it('Should return status 400 when name is not provided', () => {
        const sutSignupController = new SignupController();
        const requestData: any = {
            body: {
                'email':'valid_email',
                'password': 'valid_password',
                'confirmation': 'valid_password'
            }
        }
        const response = sutSignupController.handler(requestData);
        expect(response.statusCode).toBe(400)
    });

    it('Should return status 200 when name is provided', () => {
        const sutSignupController = new SignupController();
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

});