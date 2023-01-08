import { SignInData } from "./type";
export interface SignIn{
    login: (signInData: SignInData) => Promise<String | null>
}