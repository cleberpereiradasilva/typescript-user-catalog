import { SignIn } from "../../../domain/usecase/account";
import { SignInData } from "../../../domain/usecase/account/type";
import { Decrypter, Encrypter, GetAccountRepository } from "./protocols";

export class DbSignIn implements SignIn{
    constructor(
        private readonly getAccountRepository: GetAccountRepository,
        private readonly decrypter: Decrypter,
        private readonly encrypter: Encrypter
    ){}
    
    login = async (signInData: SignInData): Promise<string | null> => {
        const account = await this.getAccountRepository.getAccount({field: 'email', value: signInData.email})
        if(!account){
            return null
        }
        const isValid = await this.decrypter.compare(signInData.password, account.password )
        if(!isValid){
            return null
        }

        return this.encrypter.encrypt(account.uuid)
    }

}