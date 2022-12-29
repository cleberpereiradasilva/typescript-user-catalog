import { AccountData } from "../../../domain/usecase/account/type";
import { DbAddAccount } from "./db-add-account";
import { Encrypter } from "./protocols/encrypter";

type StutType = {
    encrypterStub: Encrypter
    sutDbAddAccount: DbAddAccount
}

const makeSut = (): StutType => {
    class EncrypterStub implements Encrypter{
        encrypt = (value: string): Promise<string> => Promise.resolve('encrypted_password')
    }
    const encrypterStub = new EncrypterStub();
    const sutDbAddAccount = new DbAddAccount(encrypterStub);

    return {
        encrypterStub,
        sutDbAddAccount
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
});