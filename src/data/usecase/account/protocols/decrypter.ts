export interface Decrypter{
    descrypt: (hash: string) => Promise<{id: number} | null>
}