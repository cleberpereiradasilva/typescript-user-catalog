import request from 'supertest'
import app  from '../';
import { Controller } from '../../../../presentation/controller/protocols/interface';
import { HttpRequest, HttpResponse } from '../../../../presentation/controller/protocols/types';
import { httpResponseOk } from '../../../../presentation/controller/helper/http-response';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../db/typeorm/db/sqlite-data-source'
import { Account } from '../../../db/typeorm/entity/account';
import { Group } from '../../../db/typeorm/entity/group';
import { AddAccountAdapter } from '../../../db/typeorm/account-repository/add-account-adapter';
import { faker } from '@faker-js/faker';
import { DbAddAccount} from './../../../../data/usecase/account/db-add-account';

import { BcrypterAdapter } from "../../../../external/encrypter/bcrypt/bcrypter-adapter";
import { ZodEmailAdapter, PasswordAdapter } from "../../../../external/validator";
import { SignupController } from "../../../../presentation/controller/account/signup-controller";
import { GetAccountByEmailAdapter } from '../../../db/typeorm/account-repository/get-account-by-email-adapter';
import { JwtAdapter } from '../../../encrypter/jwt/jwt-adapter';
import { DbSignIn } from '../../../../data/usecase/account/db-sign-in';
import { SignInController } from '../../../../presentation/controller/account/sign-in-controller';
import { GetAccountByToken } from '../../../../domain/usecase/account';
import { RoleModel } from '../../../../domain/usecase/model';

class AuthMiddleware implements Controller{
    constructor(
        private readonly getAccountByToken: GetAccountByToken,
        private readonly roles: RoleModel[]){}
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return httpResponseOk('')
    }
}

jest.mock('../../../../presentation/controller/middleware/auth-middleware.ts', () => ({AuthMiddleware}))

class MakeGroupControllerStub implements Controller{
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return httpResponseOk('')
    }
}

const makeGroupControllerStub = new MakeGroupControllerStub()
jest.mock('../../../../main/factories/group.ts', () => ({
    makeAddGroupController: () => makeGroupControllerStub
}))

describe('AddGroup route test', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        await connection.getRepository(Account).delete({})
        await connection.getRepository(Group).delete({})
    })

    afterAll(async () => {
        await connection.destroy()
    })
    
    it('should create a user group using correct route', async () => {
        const fakePassword = faker.internet.password()
        const accountData: HttpRequest = {
            body: {
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password: fakePassword,
                confirmation: fakePassword
            }
        }

        const validatorEmail = new ZodEmailAdapter()
        const validatorPassword = new PasswordAdapter()
        const addAccountRepository = new AddAccountAdapter(AppDataSource.manager.connection)
        const encrypter = new BcrypterAdapter()
        const addAccount = new DbAddAccount(encrypter, addAccountRepository)
        const signupController = new SignupController(validatorEmail, addAccount, validatorPassword)
        await signupController.handle(accountData)

        const getAccountByEmailRepository = new GetAccountByEmailAdapter(AppDataSource.manager.connection)
        //@ts-ignore
        const tokenGenerator = new JwtAdapter(process.env.SWT_TOKEN)
        const signIn = new DbSignIn(getAccountByEmailRepository, encrypter, tokenGenerator)
        const signInController = new SignInController(signIn)
        const {body} = await signInController.handle(accountData)
       
        await request(app)
            .post('/api/user-group')
            .set('x-access-token', body)
            .send({
                description: 'valid_description'
            })
            .expect(200)
    });
});