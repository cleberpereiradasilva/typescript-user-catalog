import { AddAccount } from "../../../domain/usecase/account";
import { BadRequest, ServerError, ResponseOk } from "../helper/http-response";
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
                    return BadRequest(`Parameter '${field}' is required`)
                }
            }

            if(body.confirmation !== body.password){
                return BadRequest(`Parameter 'confirmation' is invalid`)
            }

            if(!this.emailValidator.isValid(body.email)){
                return BadRequest(`Parameter 'email' is invalid`)
            }

            if(!this.passwordValidator.isValid(body.password)){
                return BadRequest(`Parameter 'password' is invalid`)
            }

            const {name, email, password} = body

            const account = await this.addAccount.add({name, email, password})

            return ResponseOk(account)
        }catch(error){
            console.error(error)
            return ServerError()
        }
    }
}