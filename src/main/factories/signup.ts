import { DbAddAccount } from "../../data/usecase/account/db-add-account";
import { AddAccountAdapter } from "../../external/db/typeorm/account-repository/add-account-adapter";
import { AppDataSource } from "../../external/db/typeorm/db";
import { BcrypterAdapter } from "../../external/encrypter/bcrypter-adapter";
import { SignupController } from "../../presentation/controller/account/signup-controller";
import { Controller, EmailValidator, PasswordValidator } from "../../presentation/controller/protocols/interface";

class ValidatorEmail implements EmailValidator{
    isValid = (value: string) => true 
}

class ValidatorPassword implements PasswordValidator{
    isValid = (value: string) => true 
}

export const makeSignupController = (): Controller => {
    const validatorEmail = new ValidatorEmail()
    const validatorPassword = new ValidatorPassword()
    const addAccountRepository = new AddAccountAdapter(AppDataSource.manager.connection)
    const encrypter = new BcrypterAdapter()
    const addAccount = new DbAddAccount(encrypter, addAccountRepository)
    const signupController = new SignupController(validatorEmail, addAccount, validatorPassword)
    return signupController
}