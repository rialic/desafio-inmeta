export const {
    required,
    email
} = (() => {
    function required(val: any, message: string = 'Campo obrigatório'): string | boolean {
        return !!val || message
    }

    function email(email: string): string | boolean {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) || 'Email inválido'
    }

    return {
        required,
        email
    }
})()