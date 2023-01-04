import { HttpResponse } from "../../protocols/types"

export const httpResponseOk = (body: any): Promise<HttpResponse> => Promise.resolve({
        statusCode: 200, 
        body
})
