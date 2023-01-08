import { DbSignIn } from "../../data/usecase/account/db-sign-in";
import { GetAccountAdapter } from "../../external/db/typeorm/account-repository/get-account-adapter";
import { AppDataSource } from "../../external/db/typeorm/db";
import { BcrypterAdapter } from "../../external/encrypter/bcrypt/bcrypter-adapter";
import { JwtAdapter } from "../../external/encrypter/jwt/jwt-adapter";
import { SignInController } from "../../presentation/controller/account/sign-in-controller";
import { Controller } from "../../presentation/controller/protocols/interface";


export const makeSignInController = (): Controller => {
    const getAccountByEmailRepository = new GetAccountAdapter(AppDataSource.manager.connection)
    const encrypter = new BcrypterAdapter()
    const tokenGenerator = new JwtAdapter('123123')
    const signIn = new DbSignIn(getAccountByEmailRepository, encrypter, tokenGenerator)
    const signInController = new SignInController(signIn)
    return signInController
}