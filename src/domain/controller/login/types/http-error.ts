import { HttpResponse } from "./http-response"

export const BadRequest = (message: string): HttpResponse => ({
        statusCode: 400, 
        body: new Error(message),
})