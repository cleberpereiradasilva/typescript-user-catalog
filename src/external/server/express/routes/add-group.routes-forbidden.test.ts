import request from 'supertest'
import app  from '../';
import { HttpRequest, HttpResponse } from '../../../../presentation/controller/protocols/types';
import { AppDataSource } from '../../../db/typeorm/db/sqlite-data-source'
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
import { AccountModel } from '../../../../domain/usecase/model';

const fakeAccount: AccountModel = {
    id: 1,
    uuid: 'valid_uuid',
    name: 'valid_name',
    email: 'valid_email',
    password: 'encrypted_password',
    groups: [{
        id: 1,
        uuid: 'valid_uuid',
        description: 'valid_description',
        roles: [{
            id: 1,
            description: 'user',
            uuid: '123-123-123-123'
        },{
            id: 2,
            description: 'customer',
            uuid: '123-123-123-123'
        },{
            id: 3,
            description: 'seler',
            uuid: '123-123-123-123'
        }]
    }]
}
class DbGetAccountByToken implements GetAccountByToken{
    getAccount = (token: string): Promise<AccountModel | null> => {
        return Promise.resolve(fakeAccount)
    }
}

jest.mock('../../../../data/usecase/account/db-get-account-by-token', () => ({DbGetAccountByToken}))

describe('AddGroup route test', () => {
    it('should return forbiden on create a user group using correct route', async () => {
        await request(app)
            .post('/api/user-group')
            .send({
                description: 'valid_description'
            })
            .expect(403)
    });


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
            .expect(401)
    });
});


