import { HttpResponse } from "../../protocols/types"

export const BadRequest = (message: string): Promise<HttpResponse> => Promise.resolve({
        statusCode: 400, 
        body: message,
})

export const ServerError = (message?: string): Promise<HttpResponse> => Promise.resolve({
        statusCode: 500, 
        body: message || new Error('Internal server error')
})