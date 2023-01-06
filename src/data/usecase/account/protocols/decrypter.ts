export interface Decrypter{
    compare: (value: string, hash: string) => Promise<boolean>
}