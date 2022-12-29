import bcrypt from 'bcrypt'

import { BcrypterAdapter } from "./bcrypter-adapter";

describe('Bcrypter Adapter', () => {
    it('should call bcrypter with correct password', async () => {
        
        const sutBcrypterAdapter = new BcrypterAdapter();
        const bcryptSpy = jest.spyOn(bcrypt, 'hash');

        await sutBcrypterAdapter.encrypt('valid_password');

        expect(bcryptSpy).toBeCalledWith('valid_password', 12)
        
    });
});