import { PasswordValidator } from "../../presentation/controller/protocols/interface";

export class PasswordAdapter implements PasswordValidator{
    isValid(password: string): boolean {
        const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
        return password.length >=10 && (mediumRegex.test(password) || password.split(' ').length > 5)
    }
}