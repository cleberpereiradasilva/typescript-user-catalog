require('dotenv').config();
import { DbSignIn } from "../../data/usecase/account/db-sign-in";
import { GetAccountByEmailAdapter } from "../../external/db/typeorm/account-repository/get-account-by-email-adapter";
import { AppDataSource } from "../../external/db/typeorm/db";
import { BcrypterAdapter } from "../../external/encrypter/bcrypt/bcrypter-adapter";
import { JwtAdapter } from "../../external/encrypter/jwt/jwt-adapter";
import { SignInController } from "../../presentation/controller/account/sign-in-controller";
import { Controller } from "../../presentation/controller/protocols/interface";


export const makeSignInController = (): Controller => {
    const getAccountByEmailRepository = new GetAccountByEmailAdapter(AppDataSource.manager.connection)
    const encrypter = new BcrypterAdapter()
    const tokenGenerator = new JwtAdapter(process.env.SWT_TOKEN)
    const signIn = new DbSignIn(getAccountByEmailRepository, encrypter, tokenGenerator)
    const signInController = new SignInController(signIn)
    return signInController
}