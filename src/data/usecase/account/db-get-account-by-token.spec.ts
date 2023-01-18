import { AccountModel } from '../../../domain/usecase/model';
import { DbGetAccountByToken } from './db-get-account-by-token'
import { Decrypter, GetAccountByTokenRepository } from './protocols';


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


type SutType = {
    sut: DbGetAccountByToken,
    decrypterStub: Decrypter,
    dbGetAccountByTokenRepositoryStub: GetAccountByTokenRepository
}

const makeSut = (): SutType => {
    class DecrypterStub implements Decrypter{
        descrypt = async (hash: string): Promise<Object> => {
            return Promise.resolve('valid_decrypted')
        }
    }
    class GetAccountByTokenStub implements GetAccountByTokenRepository{
        getAccountByToken = async (token: string): Promise<AccountModel> => {
            return Promise.resolve(makeFakeAccount())
        }
    }

    const decrypterStub = new DecrypterStub()
    const dbGetAccountByTokenRepositoryStub = new GetAccountByTokenStub()
    const sut = new DbGetAccountByToken(decrypterStub, dbGetAccountByTokenRepositoryStub)
    return {
        sut,
        decrypterStub,
        dbGetAccountByTokenRepositoryStub
    }
}

describe('DbGetAccountByToken', () => {
    
    it('should call Decrypter with correct value', async () => {
        const { sut, decrypterStub } = makeSut()
        const decrypterSpy = jest.spyOn(decrypterStub, 'descrypt')
        await sut.getAccount('valid_token')
        expect(decrypterSpy).toBeCalledWith('valid_token')
    });

    it('should return null if Decrypter return null', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'descrypt').mockResolvedValue(Promise.resolve(null))
        const response = await sut.getAccount('valid_token')
        expect(response).toBeNull()
    });

    it('should call DbGetAccountByTokenRepository with correct value', async () => {
        const { sut, dbGetAccountByTokenRepositoryStub } = makeSut()
        const getByTokenSpy = jest.spyOn(dbGetAccountByTokenRepositoryStub, 'getAccountByToken')
        await sut.getAccount('valid_token')
        expect(getByTokenSpy).toBeCalledWith('valid_token')
    });

    it('should return null if DbGetAccountByTokenRepository return null', async () => {
        const { sut, dbGetAccountByTokenRepositoryStub } = makeSut()
        jest.spyOn(dbGetAccountByTokenRepositoryStub, 'getAccountByToken').mockResolvedValue(Promise.resolve(null))
        const response = await sut.getAccount('valid_token')
        expect(response).toBeNull()
    });

    it('should return a AccountModel on success', async () => {
        const { sut } = makeSut()
        const response = await sut.getAccount('valid_token')
        expect(response).toEqual(makeFakeAccount())
    });
});