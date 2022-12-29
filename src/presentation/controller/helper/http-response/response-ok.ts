import { HttpResponse } from "../../protocols/types"

export const ResponseOk = (body: any): Promise<HttpResponse> => Promise.resolve({
        statusCode: 200, 
        body
})
