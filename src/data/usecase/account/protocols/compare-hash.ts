export interface Compare{
    compare: (value: string, hash: string) => Promise<boolean>
}