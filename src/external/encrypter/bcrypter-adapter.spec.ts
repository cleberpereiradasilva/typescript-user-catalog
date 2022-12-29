import bcrypt from 'bcrypt'

import { BcrypterAdapter } from "./bcrypter-adapter";

describe('Bcrypter Adapter', () => {
    it('should call bcrypter with correct password', async () => {
        const sutBcrypterAdapter = new BcrypterAdapter();
        const bcryptSpy = jest.spyOn(bcrypt, 'hash');

        await sutBcrypterAdapter.encrypt('valid_password');

        expect(bcryptSpy).toBeCalledWith('valid_password', 12)
        
    });

    it('should bcrypter return a hash on success', async () => {
        const sutBcrypterAdapter = new BcrypterAdapter();
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.resolve('hash'))

        const hashedValue = await sutBcrypterAdapter.encrypt('valid_password');

        expect(hashedValue).toBe('hash')
        
    });


    it('should throw if bcrypter throw', async () => {
        const sutBcrypterAdapter = new BcrypterAdapter();
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.reject(new Error()))

        const resultThrow = sutBcrypterAdapter.encrypt('valid_password');

        await expect(resultThrow).rejects.toThrow()
        
    });
});