import { SignIn } from "../../../domain/usecase/account";
import { SignInData } from "../../../domain/usecase/account/type";
import { AccountModel } from "../../../domain/usecase/model";
import { GetAccountRepository } from "./protocols";

export class DbSignIn implements SignIn{
    constructor(
        private readonly getAccountRepository: GetAccountRepository,
    ){}
    
    login = async (signInData: SignInData): Promise<AccountModel | null> => {
        await this.getAccountRepository.getAccount({field: 'email', value: signInData.email})
        return Promise.resolve(null)
    }

}