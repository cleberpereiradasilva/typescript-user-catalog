import { SignIn } from "../../../domain/usecase/account";
import { SignInData } from "../../../domain/usecase/account/type";
import { AccountModel } from "../../../domain/usecase/model";
import { Decrypter, GetAccountRepository } from "./protocols";

export class DbSignIn implements SignIn{
    constructor(
        private readonly getAccountRepository: GetAccountRepository,
        private readonly decrypter: Decrypter
    ){}
    
    login = async (signInData: SignInData): Promise<AccountModel | null> => {
        const account = await this.getAccountRepository.getAccount({field: 'email', value: signInData.email})
        if(!account){
            return null
        }
        await this.decrypter.compare(signInData.password, account.password )
        return null
    }

}