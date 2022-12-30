import { AccountData } from "../../../domain/usecase/account/type";
import { AccountModel } from "../../../domain/usecase/model";
import { DbAddAccount } from "./db-add-account";
import { Encrypter, AddAccountRepository } from "./protocols";

type SutType = {
    encrypterStub: Encrypter
    sutDbAddAccount: DbAddAccount
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutType => {
    class EncrypterStub implements Encrypter{
        encrypt = (value: string): Promise<string> => Promise.resolve('encrypted_password')
    }

    class AddAccountRepositoryStub implements AddAccountRepository{
        insert = (account: AccountData): Promise<AccountModel> => Promise.resolve({
            id: 1,
            uuid: 'valid_uuid',
            name: 'valid_name',
            email: 'valid_email',
            password: 'encrypted_password'
        })
    }

    const addAccountRepositoryStub = new AddAccountRepositoryStub()
    const encrypterStub = new EncrypterStub();
    const sutDbAddAccount = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

    return {
        encrypterStub,
        sutDbAddAccount,
        addAccountRepositoryStub
    }
}

describe('DbAddAccount', () => {
    it('Should password is encrypted', async () => {
        const {encrypterStub, sutDbAddAccount} = makeSut()
        const accountData: AccountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }

        const encryptSpyOn = jest.spyOn(encrypterStub, 'encrypt')
        await sutDbAddAccount.add(accountData);

        expect(encryptSpyOn).toBeCalledWith(accountData.password)
    });

    it('Should encrypted return a throws', async () => {
        const {encrypterStub, sutDbAddAccount} = makeSut()

        const accountData: AccountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }

        jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
        const account = sutDbAddAccount.add(accountData);

        expect(account).rejects.toThrow()
    });

    it('Should call AddAccountRepository with correct values', async () => {
        const {addAccountRepositoryStub, sutDbAddAccount} = makeSut()
        const accountData: AccountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }

        const addSpyOn = jest.spyOn(addAccountRepositoryStub, 'insert')
        const newAccount = await sutDbAddAccount.add(accountData);

        expect(addSpyOn).toBeCalledWith({...accountData, password: 'encrypted_password'})
        expect(newAccount).toEqual({...accountData, password: 'encrypted_password', id: 1, uuid: 'valid_uuid'})
            
    });



    it('Should throws if  AddAccountRepository throws', async () => {
        const {addAccountRepositoryStub, sutDbAddAccount} = makeSut()
        const accountData: AccountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }

        jest.spyOn(addAccountRepositoryStub, 'insert').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
        const account = sutDbAddAccount.add(accountData);

        expect(account).rejects.toThrow()
      
            
    });


});