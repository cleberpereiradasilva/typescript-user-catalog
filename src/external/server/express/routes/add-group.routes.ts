import { Express } from "express"
import { routeAdapter } from "../../../../main/adapters/route-adapter"
import { makeAddGroupController } from "../../../../main/factories/group"

export default (app: Express): void => {
    const addGroupController = makeAddGroupController()
    app.post('/user-group', routeAdapter(addGroupController))
}