import { DbGetAccountByToken } from './db-get-account-by-token'
import { Decrypter } from './protocols';



const makeObject = () => {
    return {id: 1}
}
type SutType = {
    sut: DbGetAccountByToken,
    decrypterStub: Decrypter
}

const makeSut = (): SutType => {
    class DecrypterStub implements Decrypter{
        descrypt = async (hash: string): Promise<Object> => {
            return Promise.resolve('valid_decrypted')
        }
    }
    const decrypterStub = new DecrypterStub()
    const sut = new DbGetAccountByToken(decrypterStub)
    return {
        sut,
        decrypterStub
    }
}

describe('DbGetAccountByToken', () => {
    const { sut, decrypterStub } = makeSut()
    it('should call Decrypter with correct value', async () => {
        const decrypterSpy = jest.spyOn(decrypterStub, 'descrypt')
        await sut.getAccount('valid_token')
        expect(decrypterSpy).toBeCalledWith('valid_token')
    });

    it('should return null if Decrypter return null', async () => {
        jest.spyOn(decrypterStub, 'descrypt').mockResolvedValue(Promise.resolve(null))
        const response = await sut.getAccount('valid_token')
        expect(response).toBeNull()
    });
});