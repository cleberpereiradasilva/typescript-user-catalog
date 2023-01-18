import { httpForbidden, httpResponseOk, httpServerError } from '../helper/http-response';
import { AuthMiddleware } from './auth-middleware'
import { GetAccountByToken } from '../../../domain/usecase/account'
import { AccountModel } from '../../../domain/usecase/model';

type SutTypes = {
    getAccountByTokenStub: GetAccountByToken
    sutAuthMiddleware: AuthMiddleware
}
const makeFakeAccount = (): AccountModel => ({
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
})
const makeSut = (): SutTypes => {
    class GetAccountByTokenStub implements GetAccountByToken{
        getAccount = async (token: string): Promise<AccountModel> => {
            return await Promise.resolve(makeFakeAccount())
        }
    }

    const getAccountByTokenStub = new GetAccountByTokenStub()
    const sutAuthMiddleware = new AuthMiddleware(getAccountByTokenStub)
    return {
        sutAuthMiddleware,
        getAccountByTokenStub,
    }
}

describe('Auth Middleware', () => {
    it('should return httpForbidden(403) if token in header is not provider', async () => {
        const { sutAuthMiddleware } = makeSut()
        const httpRequest = {
            headers: {}
        }
        const response = await sutAuthMiddleware.handle(httpRequest)
        expect(response).toEqual(await httpForbidden())
    });

    it('should call getAccountByToken with correct token', async () => {
        const { sutAuthMiddleware, getAccountByTokenStub } = makeSut()
        const getAccountSpy = jest.spyOn(getAccountByTokenStub, 'getAccount')
        const httpRequest = {
            headers: {
                'x-access-token': 'valid_token'
            }
        }
        await sutAuthMiddleware.handle(httpRequest)
        expect(getAccountSpy).toBeCalledWith('valid_token')
    });

    it('should return httpForbidden(403) when can not find a account', async () => {
        const { sutAuthMiddleware, getAccountByTokenStub } = makeSut()
        jest.spyOn(getAccountByTokenStub, 'getAccount').mockImplementationOnce(() => Promise.resolve(null))
        const httpRequest = {
            headers: {
                'x-access-token': 'in_valid_token'
            }
        }
        const response = await sutAuthMiddleware.handle(httpRequest)
        expect(response).toEqual(await httpForbidden())
    });

    it('should return httpResponseOk(AccountModel) when find a account', async () => {
        const { sutAuthMiddleware } = makeSut()
        const httpRequest = {
            headers: {
                'x-access-token': 'in_valid_token'
            }
        }
        const response = await sutAuthMiddleware.handle(httpRequest)
        expect(response).toEqual(await httpResponseOk(makeFakeAccount()))
    });


    it('should return a error 500 when getAccountByToken throw', async () => {
        const { sutAuthMiddleware, getAccountByTokenStub } = makeSut()
        jest.spyOn(getAccountByTokenStub, 'getAccount').mockRejectedValueOnce(httpServerError())
        const httpRequest = {
            headers: {
                'x-access-token': 'in_valid_token'
            }
        }
        const response = await sutAuthMiddleware.handle(httpRequest)
        expect(response).toEqual(await httpServerError())
        expect(response.statusCode).toBe(500)
    });

});