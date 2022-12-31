import { Express } from "express"
import { routeAdapter } from "../../../../main/adapters/route-adapter"
import { makeSignupController } from "../../../../main/factories/signup"

export default (app: Express): void => {
    const signupController = makeSignupController()
    app.post('/signup', routeAdapter(signupController))
}