import { SignIn } from "../../../domain/usecase/account";
import { httpMissingParameter, httpServerError } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class SignInController implements Controller{
    constructor(private readonly signIn: SignIn){}
    
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try{
            const { body } = httpRequest;
            const required = ['email', 'password'];
            for (const field of required){
                if(!body[field]){
                    return httpMissingParameter(`${field}`)
                }
            } 
            const account = await this.signIn.login(body)
            if(!account){
                return {
                    statusCode: 404, 
                }
            }
            return {
                statusCode: 200, 
                body: account
            }
        }catch(error){
            return httpServerError(error as unknown as Error)
        }
    }
}