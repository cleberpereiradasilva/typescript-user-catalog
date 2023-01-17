import { httpForbidden } from '../helper/http-response';
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
            return Promise.resolve(makeFakeAccount())
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
    it('should return httpForbidden(403) if token in header is not provider', () => {
        const { sutAuthMiddleware } = makeSut()
        const httpRequest = {
            headers: {}
        }
        const response = sutAuthMiddleware.handle(httpRequest)
        expect(response).toEqual(httpForbidden())
    });

    it('should call getAccountByToken with correct token', () => {
        const { sutAuthMiddleware, getAccountByTokenStub } = makeSut()
        const getAccountSpy = jest.spyOn(getAccountByTokenStub, 'getAccount')
        const httpRequest = {
            headers: {
                'x-access-token': 'valid_token'
            }
        }
        sutAuthMiddleware.handle(httpRequest)
        expect(getAccountSpy).toBeCalledWith('valid_token')
    });


});