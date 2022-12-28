import { AddAccount } from "../../../usecase/account";
import { BadRequest, ServerError, ResponseOk } from "../helper/http-response";
import { Controller, EmailValidator, PasswordValidator } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class SignupController implements Controller{
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount,
        private readonly passwordValidator: PasswordValidator
    ){}

    handle = (httpRequest: HttpRequest): HttpResponse => {
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
        const account = this.addAccount.add({name, email, password})

        if(!account) return ServerError('Error on create account.')

        return ResponseOk()
    }
}