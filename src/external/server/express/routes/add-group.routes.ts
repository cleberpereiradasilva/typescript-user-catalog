import { Express } from "express"
import { routeAdapter } from "../../../../main/adapters/route-adapter"
import { makeAuthenticator } from "../../../../main/factories/auth"
import { makeAddGroupController } from "../../../../main/factories/group"

export default (app: Express): void => {
    const addGroupController = makeAddGroupController()
    const authMiddleware = makeAuthenticator(['admin', 'manager'])
    app.post('/user-group', authMiddleware, routeAdapter(addGroupController))
}