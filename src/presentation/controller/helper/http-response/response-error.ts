import { HttpResponse } from "../../protocols/types"

export const BadRequest = (message: string): Promise<HttpResponse> => Promise.resolve({
        statusCode: 400, 
        body: new Error(message),
})

export const ServerError = (): Promise<HttpResponse> => Promise.resolve({
        statusCode: 500, 
        body: new Error('Internal server error')
})