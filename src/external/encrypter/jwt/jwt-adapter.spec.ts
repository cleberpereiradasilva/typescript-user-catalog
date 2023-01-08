import jwt from 'jsonwebtoken'

import { JwtAdapter } from "./jwt-adapter";

const secret = '123'
const makeJwtAdapter = () => {
    return new JwtAdapter(secret)
}

describe('Bcrypter Adapter', () => {
    it('should call bcrypter with correct password', async () => {
        const sutJwtAdapter = makeJwtAdapter();
        const signSpy = jest.spyOn(jwt, 'sign');
        await sutJwtAdapter.encrypt({payload: 'any_payload'});
        expect(signSpy).toBeCalledWith({payload: 'any_payload'}, secret, { expiresIn: 30000})
        
    });

    it('should bcrypter return a hash on success', async () => {
        const sutJwtAdapter = makeJwtAdapter();
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => Promise.resolve('hash'))

        const hashedValue = await sutJwtAdapter.encrypt({payload: 'any_payload'});

        expect(hashedValue).toBe('hash')
        
    });


    it('should throw if bcrypter throw', async () => {
        const sutJwtAdapter = makeJwtAdapter();
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => Promise.reject(new Error()))

        const resultThrow = sutJwtAdapter.encrypt({payload: 'any_payload'});

        await expect(resultThrow).rejects.toThrow()
        
    });
   

});