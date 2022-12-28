import { EmailValidator } from "./helper/email-validator";
import { HttpRequest, HttpResponse } from "./types/http-response";

export class SignupController{
    constructor(private readonly emailValidator: EmailValidator){}

    handler = (httpRequest: HttpRequest): HttpResponse => {
        const { body } = httpRequest;
        const required = ['name', 'email', 'password', 'confirmation'];
        for (const field of required){
            if(!body[field]){
                return {
                    statusCode: 400,
                    message: `Parameter '${field}' is required`
                }
            }
        }

        if(body.confirmation !== body.password){
            return {
                statusCode: 400,
                message: `Parameter 'confirmation' is invalid`
            }
        }

        if(!this.emailValidator.isValid(body.email)){
            return {
                statusCode: 400,
                message: `Parameter 'email' is invalid`
            }
        }

        return {
            statusCode: 200            
        }
    }
}