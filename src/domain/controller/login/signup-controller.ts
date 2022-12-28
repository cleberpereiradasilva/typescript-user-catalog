import { EmailValidator } from "./helper/email-validator";
import { BadRequest } from "./helper/http-error";
import { Controller } from "./interface/Controller";
import { HttpRequest, HttpResponse } from "./types";

export class SignupController implements Controller{
    constructor(private readonly emailValidator: EmailValidator){}

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

        return {
            statusCode: 200            
        }
    }
}