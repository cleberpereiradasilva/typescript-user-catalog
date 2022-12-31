import { AddGroup } from "../../../domain/usecase/account";
import { BadRequest, ServerError, ResponseOk } from "../helper/http-response";
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
                    return BadRequest(`Parameter '${field}' is required`)
                }
            }

            if(body.description.length < 10){
                return BadRequest(`Parameter 'description' is required with more than 10 chars`)
            }

            const {description} = body
            const group = await this.addGroup.add(description)

            return ResponseOk(group)
        }catch(error){
            return ServerError()
        }
    }
}