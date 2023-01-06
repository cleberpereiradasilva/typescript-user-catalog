import { AccountModel } from "../../../domain/usecase/model";
import { Decrypter, Encrypter, GetAccountRepository, GetData } from "./protocols";
import { DbSignIn } from './db-sign-in'
import { SignIn } from "../../../domain/usecase/account";
import { SignInData } from "../../../domain/usecase/account/type";

type TypeSut={
    sutDbSignIn: SignIn,
    getAccountRepositorySub: GetAccountRepository,
    decrypterStub: Decrypter,
    resolvedValues: AccountModel,
    encrypterStub: Encrypter
}
const makeSut = (): TypeSut => {
    class DecrypterStub implements Decrypter{
        compare = (value: string, hash: string): Promise<boolean> => Promise.resolve(true)
    }
    class EncrypterStub implements Encrypter{
        encrypt = (value: string): Promise<string> => Promise.resolve('encrypted_password')
    }
    class GetAccountRepositorySub implements GetAccountRepository{
        getAccount = (getData: GetData): Promise<AccountModel | null> => {
            return Promise.resolve(null)
        }
    }
    const decrypterStub = new DecrypterStub()
    const getAccountRepositorySub = new GetAccountRepositorySub()
    const encrypterStub = new EncrypterStub()
    const sutDbSignIn = new DbSignIn(getAccountRepositorySub, decrypterStub, encrypterStub)
    const resolvedValues = {
        id: 1,
        uuid: 'valid_uuid',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'encrypted_password',
        groups: [{
            id: 1,
            uuid: 'valid_uuid',
            description: 'valid_description',
        }]
    }

    return {
        sutDbSignIn,
        getAccountRepositorySub,
        decrypterStub,
        resolvedValues,
        encrypterStub
    }
}

describe('SignIn data account', () => {
    it('Should call repository with correct values', async () => {
        const {sutDbSignIn, getAccountRepositorySub }  = makeSut()
        const getSpy = jest.spyOn(getAccountRepositorySub, 'getAccount')
        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }

        await sutDbSignIn.login(signInData)
        expect(getSpy).toBeCalledWith({field: 'email', value: signInData.email})       
    });

    it('Should return null when account not found', async () => {
        const {sutDbSignIn, getAccountRepositorySub }  = makeSut()

        jest.spyOn(getAccountRepositorySub, 'getAccount').mockResolvedValue(null)
        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }
        const isValid = await sutDbSignIn.login(signInData)
        expect(isValid).toBe(null)
    });

    it('Should call decrypter with correct values', async () => {
        const {sutDbSignIn, decrypterStub, getAccountRepositorySub, resolvedValues }  = makeSut()
        jest.spyOn(getAccountRepositorySub, 'getAccount').mockResolvedValue(resolvedValues)

        const compareSpy = jest.spyOn(decrypterStub, 'compare')
        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }
        await sutDbSignIn.login(signInData)
        expect(compareSpy).toBeCalledWith(signInData.password, 'encrypted_password')       
    });

    it('Should null when pasword is not correct', async () => {
        const {sutDbSignIn, getAccountRepositorySub, decrypterStub, resolvedValues }  = makeSut()
        jest.spyOn(getAccountRepositorySub, 'getAccount').mockResolvedValue(resolvedValues)
        jest.spyOn(decrypterStub, 'compare').mockResolvedValue(false)
        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }
        const accountModelHased = await sutDbSignIn.login(signInData)
        expect(accountModelHased).not.toBeTruthy()
    });


    it('Should a valid token when email and pasword are correct', async () => {
        const {sutDbSignIn, getAccountRepositorySub, decrypterStub, encrypterStub, resolvedValues }  = makeSut()
        jest.spyOn(getAccountRepositorySub, 'getAccount').mockResolvedValue(resolvedValues)
        jest.spyOn(decrypterStub, 'compare').mockResolvedValue(true)
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }
        const accountModelHased = await sutDbSignIn.login(signInData)
        expect(encryptSpy).toHaveBeenCalled()
        expect(accountModelHased).toBeTruthy()
    });


});