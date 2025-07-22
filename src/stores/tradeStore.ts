import { defineStore } from 'pinia'
import { api } from '@/boot/axios'
import type { AxiosResponse } from 'axios'

export const useTradeStore = defineStore('tradeStore', {
    state: () => ({}),

    actions: {
        async index(payload: Record<string, any>) {
            const query: URLSearchParams | undefined = new URLSearchParams(payload)
            const { data, status }: AxiosResponse = await api.get(`trades?${query}`)

            return { data, status }
        }
    },
});
