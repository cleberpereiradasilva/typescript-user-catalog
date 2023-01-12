import { SignIn } from "../../../domain/usecase/account";
import { httpMissingParameter, httpResponseOk, httpServerError, httpUnAuthorized } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class SignInController implements Controller{
    constructor(private readonly signIn: SignIn){
        
    }
    
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try{
            const { body } = httpRequest;
            const required = ['email', 'password'];
            for (const field of required){
                if(!body[field]){
                    return httpMissingParameter(`${field}`)
                }
            } 
            const token = await this.signIn.login(body)
            if(!token){
                return httpUnAuthorized()
            }
            return httpResponseOk(token)
        }catch(error){
            return httpServerError(error as unknown as Error)
        }
    }
}