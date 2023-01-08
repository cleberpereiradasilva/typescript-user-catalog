import { Express } from "express"
import { routeAdapter } from "../../../../main/adapters/route-adapter"
import { makeSignInController } from "../../../../main/factories/sign-in"

export default (app: Express): void => {
    const signInController = makeSignInController()
    app.post('/sign-in', routeAdapter(signInController))
}