import { SignIn } from '../../../domain/usecase/account';
import { SignInData } from '../../../domain/usecase/account/type';
import { httpMissingParameter } from '../helper/http-response';
import { HttpRequest } from '../protocols/types';
import { SignInController } from './sign-in-controller'



const makeSut = () => {
    class SignInStub implements SignIn{
        login = (signInData: SignInData): Promise<string | null> => {
            return Promise.resolve(null)   
        }
    }

    const signInStub= new SignInStub()
    const sutSignInController = new SignInController(signInStub)
    return {
        sutSignInController, 
        signInStub
    }
}

describe('signIn Controller', () => {
    it('Ensure controller return 400 if email not provided', async () => {
        const { sutSignInController} = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                password: 'valid_password'
            }
        }
        const httpResponse = await sutSignInController.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse).toEqual(await httpMissingParameter('email'))
    });

    it('Ensure controller return 400 if password not provided', async () => {
        const { sutSignInController} = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                email: 'vali_email@email.com'
            }
        }
        const httpResponse = await sutSignInController.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse).toEqual(await httpMissingParameter('password'))
    });

    it('Should call SignIn usecase with correct values', async () => {
        const {sutSignInController, signInStub} = makeSut()
        const encryptSpy = jest.spyOn(signInStub, 'login')
        const httpRequest: HttpRequest = {
            body: {
                email: 'vali_email@email.com',
                password: 'valid_password'
            }
        }
        await sutSignInController.handle(httpRequest)
        expect(encryptSpy).toBeCalledWith(httpRequest.body)
    });


    it('Should get correct return from usecase', async () => {
        const {sutSignInController, signInStub} = makeSut()
        jest.spyOn(signInStub, 'login').mockResolvedValue('hashed_account')
        const httpRequest: HttpRequest = {
            body: {
                email: 'vali_email@email.com',
                password: 'valid_password'
            }
        }
        const httpResponse = await sutSignInController.handle(httpRequest)
        expect(httpResponse.body).toBeTruthy()
        expect(httpResponse.statusCode).toBe(200)
    });

    it('Should get status 401 when account not found', async () => {
        const {sutSignInController, signInStub} = makeSut()
        jest.spyOn(signInStub, 'login').mockResolvedValue(null)
        const httpRequest: HttpRequest = {
            body: {
                email: 'vali_email@email.com',
                password: 'valid_password'
            }
        }
        const httpResponse = await sutSignInController.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(401)
    });


    it('Should throw if SignIn throw', async () => {
        const {sutSignInController, signInStub} = makeSut()
        jest.spyOn(signInStub, 'login').mockImplementation(() => Promise.reject(new Error()))
        const httpRequest: HttpRequest = {
            body: {
                email: 'vali_email@email.com',
                password: 'valid_password'
            }
        }
        const httpResponse = await sutSignInController.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new Error())
    });


    it('Should error 500 with message if SignIn throw without Error', async () => {
        const {sutSignInController, signInStub} = makeSut()
        jest.spyOn(signInStub, 'login').mockImplementation(() => Promise.reject())
        const httpRequest: HttpRequest = {
            body: {
                email: 'vali_email@email.com',
                password: 'valid_password'
            }
        }
        const httpResponse = await sutSignInController.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new Error('Internal Server Error'))
    });

   

});