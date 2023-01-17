import { SignIn } from "../../../domain/usecase/account";
import { SignInData } from "../../../domain/usecase/account/type";
import { Compare, Encrypter, GetAccountByEmailRepository } from "./protocols";

export class DbSignIn implements SignIn{
    constructor(
        private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
        private readonly decrypter: Compare,
        private readonly tokenGenerator: Encrypter
    ){}
    
    login = async (signInData: SignInData): Promise<string | null> => {
        const account = await this.getAccountByEmailRepository.getAccountByEmail(signInData.email)
        if(!account){
            return null
        }
        const isValid = await this.decrypter.compare(signInData.password, account.password )
        if(!isValid){
            return null
        }

        return this.tokenGenerator.encrypt({userAccountId: account.uuid})
    }

}