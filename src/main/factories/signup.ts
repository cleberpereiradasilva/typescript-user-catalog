import { DbAddAccount } from "../../data/usecase/account/db-add-account";
import { AddAccountAdapter } from "../../external/db/typeorm/account-repository/add-account-adapter";
import { AppDataSource } from "../../external/db/typeorm/db";
import { BcrypterAdapter } from "../../external/encrypter/bcrypter-adapter";
import { ZodEmailAdapter, PasswordAdapter } from "../../external/validator";
import { SignupController } from "../../presentation/controller/account/signup-controller";
import { Controller } from "../../presentation/controller/protocols/interface";


export const makeSignupController = (): Controller => {
    const validatorEmail = new ZodEmailAdapter()
    const validatorPassword = new PasswordAdapter()
    const addAccountRepository = new AddAccountAdapter(AppDataSource.manager.connection)
    const encrypter = new BcrypterAdapter()
    const addAccount = new DbAddAccount(encrypter, addAccountRepository)
    const signupController = new SignupController(validatorEmail, addAccount, validatorPassword)
    return signupController
}