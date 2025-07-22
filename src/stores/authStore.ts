import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { api } from '@/boot/axios'
import type { AxiosResponse } from 'axios'

export const useAuthStore = defineStore('authStore', () => {
    const user = ref<Record<string, any> | null>(null)
    const token = ref<string | null>('')

    watch([token, user], ([newToken, newUser]: [string | null, Record<string, any> | null]) => {
        if (newToken) {
            localStorage.setItem('token', newToken)
        }

        if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser))
        }
    })

    function init() {
        if (localStorage.getItem('user')) {
            user.value = JSON.parse(localStorage.getItem('user')!)
        }

        if (localStorage.getItem('token')) {
            token.value = localStorage.getItem('token')!
        }
    }

    async function register(payload: Record<string, any>) {
        const response: AxiosResponse = await api.post('register', payload)

        return response
    }

    async function login(payload: Record<string, any>) {
        const response: AxiosResponse = await api.post('login', payload)

        if (response.status === 200) {
            const data = response.data
            token.value = data.token
            user.value = data.user
        }


        return response
    }

    function logout() {
        token.value = null
        user.value = null

        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    init()

    return {
        token,
        user,
        register,
        login,
        logout
    }
})