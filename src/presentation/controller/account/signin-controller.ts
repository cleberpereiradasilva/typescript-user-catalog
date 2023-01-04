import { httpMissingParameter } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class SigninController implements Controller{
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const { body } = httpRequest;
        const required = ['email', 'password'];
        for (const field of required){
            if(!body[field]){
                return httpMissingParameter(`${field}`)
            }
        } 
        
        return {statusCode: 400}
    }
}