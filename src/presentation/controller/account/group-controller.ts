import { AddGroup } from "../../../domain/usecase/account";
import { httpBadRequest, httpServerError, httpResponseOk, httpMissingParameter } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class AddGroupController implements Controller{
    constructor(
        private readonly addGroup: AddGroup,
    ){}

    handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
        try{
            const { body } = httpRequest;
            const required = ['description'];
            for (const field of required){
                if(!body[field]){
                    return httpMissingParameter(`${field}`)
                }
            }

            if(body.description.length < 10){
                return httpBadRequest(`Parameter 'description' is required with more than 10 chars`)
            }

            const {description} = body
            const group = await this.addGroup.add({description})

            return httpResponseOk(group)
        }catch(error){
            const message = error as unknown as string
            if(message?.toString().indexOf('duplicate key') > 0){
                return httpServerError('Duplicate key')
            }
            return httpServerError(error as unknown as Error)
        }
    }
}