export class SignupController{

    handler = (requestData: any) => {
        if(requestData.body.name === undefined){
            return {
                statusCode: 400
            }
        }
        return {
            statusCode: 200
        }

    }
}