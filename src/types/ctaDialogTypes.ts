export interface CtaData {
    id: string
    title: string
    message: string
    ctaFn: ((id: string) => Promise<void>) | ((id: string | Array<string>) => Promise<void>)
}