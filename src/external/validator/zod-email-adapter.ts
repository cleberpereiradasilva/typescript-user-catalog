import { z } from "zod";
import { EmailValidator } from '../../presentation/controller/protocols/interface';

export class ZodEmailAdapter implements EmailValidator{
    isValid(email: string): boolean {
        return z.string().email().safeParse(email).success;
    }
}