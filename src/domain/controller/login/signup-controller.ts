import { EmailValidator } from "./helper/email-validator";
import { BadRequest } from "./types/http-error";
import { HttpRequest, HttpResponse } from "./types/http-response";

export class SignupController{
    constructor(private readonly emailValidator: EmailValidator){}

    handler = (httpRequest: HttpRequest): HttpResponse => {
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