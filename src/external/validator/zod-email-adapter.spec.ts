import { z } from "zod";

import { ZodEmailAdapter } from "./zod-email-adapter";

describe('Zod email Adapter', () => {
    it('should call zod and return true', () => {
        const sutZodEmailAdapter = new ZodEmailAdapter();
        const isValid = sutZodEmailAdapter.isValid('email@email.com');
        expect(isValid).toBe(true)
    });

    it('should call zod and return false', () => {
        const sutZodEmailAdapter = new ZodEmailAdapter();
        const isValid = sutZodEmailAdapter.isValid('invalid_email');
        expect(isValid).toBe(false)
    });

    
});