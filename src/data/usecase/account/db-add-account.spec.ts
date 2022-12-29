import { AccountData } from "../../../domain/usecase/account/type";
import { DbAddAccount } from "./db-add-account";
import { Encrypter } from "./protocols/encrypter";

describe('DbAddAccount', () => {
    it('Should password is encrypted', async () => {
        class EncrypterStub implements Encrypter{
            encrypt = (value: string): Promise<string> => Promise.resolve('encripted_password')
        }
        const encrypterStub = new EncrypterStub();
        const sutDbAddAccount = new DbAddAccount(encrypterStub);
        const accountData: AccountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }

        const encryptSpyOn = jest.spyOn(encrypterStub, 'encrypt')
        await sutDbAddAccount.add(accountData);

        expect(encryptSpyOn).toBeCalledWith(accountData.password)


    });
});