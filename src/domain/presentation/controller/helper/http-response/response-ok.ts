import { HttpResponse } from "../../protocols/types"

export const ResponseOk = (): HttpResponse => ({
        statusCode: 200, 
})
