export interface Decrypter{
    descrypt: (hash: string) => Promise<Object>
}