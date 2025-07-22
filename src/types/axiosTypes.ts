export type ErrorData = {
    ok: boolean,
    status: number,
    data: any,
    errors?: Record<string, any>
    message: string | undefined
}