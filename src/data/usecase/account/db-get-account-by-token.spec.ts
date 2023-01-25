import { AccountModel } from '../../../domain/usecase/model';
import { DbGetAccountByToken } from './db-get-account-by-token'
import { Decrypter, GetAccountByIdRepository } from './protocols';


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
    getAccountByIdStub: GetAccountByIdRepository
}

const makeSut = (): SutType => {
    class DecrypterStub implements Decrypter{
        descrypt = async (hash: string): Promise<{userAccountId: number}> => {
            return Promise.resolve({userAccountId: 1})
        }
    }
    class GetAccountByIdStub implements GetAccountByIdRepository{
        getAccountById = async (id: number): Promise<AccountModel> => {
            return Promise.resolve(makeFakeAccount())
        }
    }

    const decrypterStub = new DecrypterStub()
    const getAccountByIdStub = new GetAccountByIdStub()
    const sut = new DbGetAccountByToken(decrypterStub, getAccountByIdStub)
    return {
        sut,
        decrypterStub,
        getAccountByIdStub
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
        const { sut, getAccountByIdStub } = makeSut()
        const getByTokenSpy = jest.spyOn(getAccountByIdStub, 'getAccountById')
        await sut.getAccount('valid_token')
        expect(getByTokenSpy).toBeCalledWith(1)
    });

    it('should return null if DbGetAccountByTokenRepository return null', async () => {
        const { sut, getAccountByIdStub } = makeSut()
        jest.spyOn(getAccountByIdStub, 'getAccountById').mockResolvedValue(Promise.resolve(null))
        const response = await sut.getAccount('valid_token')
        expect(response).toBeNull()
    });

    it('should return a AccountModel on success', async () => {
        const { sut } = makeSut()
        const response = await sut.getAccount('valid_token')
        expect(response).toEqual(makeFakeAccount())
    });

    it('should throw if DbGetAccountByTokenRepository throw', async () => {
        const { sut, getAccountByIdStub } = makeSut()
        jest.spyOn(getAccountByIdStub, 'getAccountById').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
        const response = sut.getAccount('valid_token')
        await expect(response).rejects.toThrow()
    });

    it('should throw if Decrypter throw', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'descrypt').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
        const response = sut.getAccount('valid_token')
        await expect(response).rejects.toThrow()
    });


});