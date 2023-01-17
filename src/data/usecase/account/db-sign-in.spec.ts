import { AccountModel } from "../../../domain/usecase/model";
import { Compare, Decrypter, Encrypter, GetAccountByEmailRepository } from "./protocols";
import { DbSignIn } from './db-sign-in'
import { SignIn } from "../../../domain/usecase/account";
import { SignInData } from "../../../domain/usecase/account/type";

type TypeSut={
    sutDbSignIn: SignIn,
    getAccountByEmailRepositoryStub: GetAccountByEmailRepository,
    compareStub: Compare,
    resolvedValues: AccountModel,
    tokenGeneratorStub: Encrypter
}
const makeSut = (): TypeSut => {
    class CompareStub implements Compare{
        compare = (value: string, hash: string): Promise<boolean> => Promise.resolve(true)
    }
    class TokenGeneratorStub implements Encrypter{
        encrypt = (value: string): Promise<string> => Promise.resolve('encrypted_password')
    }
    class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository{
        getAccountByEmail = (email: string): Promise<AccountModel | null> => {
            return Promise.resolve(null)
        }
    }
    const compareStub = new CompareStub()
    const getAccountByEmailRepositoryStub = new GetAccountByEmailRepositoryStub()
    const tokenGeneratorStub = new TokenGeneratorStub()
    const sutDbSignIn = new DbSignIn(getAccountByEmailRepositoryStub, compareStub, tokenGeneratorStub)
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
        getAccountByEmailRepositoryStub,
        compareStub,
        resolvedValues,
        tokenGeneratorStub
    }
}

describe('SignIn data account', () => {
    it('Should call repository with correct values', async () => {
        const {sutDbSignIn, getAccountByEmailRepositoryStub }  = makeSut()
        const getSpy = jest.spyOn(getAccountByEmailRepositoryStub, 'getAccountByEmail')
        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }

        await sutDbSignIn.login(signInData)
        expect(getSpy).toBeCalledWith(signInData.email)       
    });

    it('Should return null when account not found', async () => {
        const {sutDbSignIn, getAccountByEmailRepositoryStub }  = makeSut()

        jest.spyOn(getAccountByEmailRepositoryStub, 'getAccountByEmail').mockResolvedValue(null)
        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }
        const isValid = await sutDbSignIn.login(signInData)
        expect(isValid).toBe(null)
    });

    it('Should call decrypter with correct values', async () => {
        const {sutDbSignIn, compareStub, getAccountByEmailRepositoryStub, resolvedValues }  = makeSut()
        jest.spyOn(getAccountByEmailRepositoryStub, 'getAccountByEmail').mockResolvedValue(resolvedValues)

        const compareSpy = jest.spyOn(compareStub, 'compare')
        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }
        await sutDbSignIn.login(signInData)
        expect(compareSpy).toBeCalledWith(signInData.password, 'encrypted_password')       
    });

    it('Should null when pasword is not correct', async () => {
        const {sutDbSignIn, getAccountByEmailRepositoryStub, compareStub, resolvedValues }  = makeSut()
        jest.spyOn(getAccountByEmailRepositoryStub, 'getAccountByEmail').mockResolvedValue(resolvedValues)
        jest.spyOn(compareStub, 'compare').mockResolvedValue(false)
        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }
        const accountModelHased = await sutDbSignIn.login(signInData)
        expect(accountModelHased).not.toBeTruthy()
    });


    it('Should a valid token when email and pasword are correct', async () => {
        const {sutDbSignIn, getAccountByEmailRepositoryStub, compareStub, tokenGeneratorStub, resolvedValues }  = makeSut()
        jest.spyOn(getAccountByEmailRepositoryStub, 'getAccountByEmail').mockResolvedValue(resolvedValues)
        jest.spyOn(compareStub, 'compare').mockResolvedValue(true)
        const encryptSpy = jest.spyOn(tokenGeneratorStub, 'encrypt')

        const signInData: SignInData = {
            email: 'valid_email@email.com',
            password: 'valid_password',
        }
        const accountModelHased = await sutDbSignIn.login(signInData)
        expect(encryptSpy).toHaveBeenCalled()
        expect(accountModelHased).toBeTruthy()
    });


});