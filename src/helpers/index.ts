import { Notify } from 'quasar'

export const {
    notifySuccess,
    notifyError
} = (() => {
    function success(message: string) {
        Notify.create({
            color: 'positive',
            message: message,
            icon: 'fa-solid fa-circle-check',
        })
    }

    function error(message: string) {
        Notify.create({
            color: 'negative',
            message: message,
            icon: 'fa-solid fa-exclamation-circle',
        })
    }

    return {
        notifySuccess: success,
        notifyError: error
    }
})()