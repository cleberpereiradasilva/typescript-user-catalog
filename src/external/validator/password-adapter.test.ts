import { PasswordAdapter } from "./password-adapter";

describe('Password validator Adapter', () => {
    it('should call PasswordAdapter and return true by regex', () => {
        const sutPasswordAdapter = new PasswordAdapter();
        const isValid = sutPasswordAdapter.isValid('abc!E1asdfaasdf');
        expect(isValid).toBe(true)
    });

    it('should call PasswordAdapter and return false by regex', () => {
        const sutPasswordAdapter = new PasswordAdapter();
        const isValid = sutPasswordAdapter.isValid('abcsdf');
        expect(isValid).toBe(false)
    });

    it('should call PasswordAdapter and return false by size', () => {
        const sutPasswordAdapter = new PasswordAdapter();
        const isValid = sutPasswordAdapter.isValid('abcs!#df');
        expect(isValid).toBe(false)
    });

    it('should call PasswordAdapter and return true by pass phrase', () => {
        const sutPasswordAdapter = new PasswordAdapter();
        const isValid = sutPasswordAdapter.isValid('asdf asdf asdf asdf asdf asdf');
        expect(isValid).toBe(true)
    });



   

    
});