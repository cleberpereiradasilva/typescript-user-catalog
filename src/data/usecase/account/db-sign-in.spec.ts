import { AccountModel } from "../../../domain/usecase/model";
import { GetAccountRepository, GetData } from "./protocols";
import { DbSignIn } from './db-sign-in'
import { SignIn } from "../../../domain/usecase/account";
import { SignInData } from "../../../domain/usecase/account/type";

type TypeSut={
    sutDbSignIn: SignIn,
    getAccountRepositorySub: GetAccountRepository
}
const makeSut = (): TypeSut => {
    class GetAccountRepositorySub implements GetAccountRepository{
        getAccount = (getData: GetData): Promise<AccountModel | null> => {
            return Promise.resolve(null)
        }
    }

    const getAccountRepositorySub = new GetAccountRepositorySub()
    const sutDbSignIn = new DbSignIn(getAccountRepositorySub)

    return {
        sutDbSignIn,
        getAccountRepositorySub
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
});