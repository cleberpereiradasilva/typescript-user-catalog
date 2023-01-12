import { AddAccount } from "../../../domain/usecase/account";
import { httpBadRequest, httpServerError, httpResponseOk, httpMissingParameter } from "../helper/http-response";
import { Controller, EmailValidator, PasswordValidator } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class SignupController implements Controller{
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount,
        private readonly passwordValidator: PasswordValidator
    ){}

    handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
        try{
            const { body } = httpRequest;
            const required = ['name', 'email', 'password', 'confirmation'];
            for (const field of required){
                if(!body[field]){
                    return httpMissingParameter(`${field}`)
                }
            }

            if(body.confirmation !== body.password){
                return httpBadRequest(`Parameter 'confirmation' is invalid`)
            }

            if(!this.emailValidator.isValid(body.email)){
                return httpBadRequest(`Parameter 'email' is invalid`)
            }

            if(!this.passwordValidator.isValid(body.password)){
                return httpBadRequest(`Parameter 'password' is invalid`)
            }

            const {name, email, password, group} = body

            const account = await this.addAccount.add({name, email, password, group})

            return httpResponseOk(account)
        }catch(error){
            return httpServerError(error as unknown as Error)
        }
    }
}