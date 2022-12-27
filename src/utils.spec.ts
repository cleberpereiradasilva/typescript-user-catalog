import { sum } from "./utils";

describe('Test Utils', () => {
    
    it('Sum', () => {
        const sutSum = sum(10,10);
        expect(sutSum).toBe(20)
    })
});