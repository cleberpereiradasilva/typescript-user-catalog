import { Request, Response, Express } from "express"
import { makeSignupController } from "../../../../main/factories/signup"

export default (app: Express): void => {
    app.post('/signup', async (req: Request, res: Response) => {
        const signupController = makeSignupController()
        console.log(req.body)
        const newAccount = await signupController.handle({body: req.body })
        console.log(newAccount)
        res.send(newAccount.body.message).status(newAccount.body.statusCode)
    })
}