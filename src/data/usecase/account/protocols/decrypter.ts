export interface Decrypter{
    descrypt: (hash: string) => Promise<{userAccountId: number} | null>
}