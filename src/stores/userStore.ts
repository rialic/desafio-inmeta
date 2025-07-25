import { defineStore } from 'pinia'
import { api } from '@/boot/axios'
import type { AxiosResponse } from 'axios'

export const useUserStore = defineStore('userStore', {
    state: () => ({}),

    actions: {
        async me() {
            const { data, status }: AxiosResponse = await api.get('me')

            return { data, status }
        },
    }
});
