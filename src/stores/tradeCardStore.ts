import { defineStore } from 'pinia'
import { api } from '@/boot/axios'
import type { AxiosResponse } from 'axios'

export const useTradeCardStore = defineStore('tradeCardStore', {
    state: () => ({}),

    actions: {
        async index(payload: Record<string, any>) {
            const query: URLSearchParams | undefined = new URLSearchParams(payload)
            const { data, status }: AxiosResponse = await api.get(`trades?${query}`)

            return { data, status }
        },
        async store(payload: Record<string, any>) {
            const { data, status }: AxiosResponse = await api.post('trades', payload)

            return { data, status }
        },
        async delete(id: string) {
            const { data, status }: AxiosResponse = await api.delete(`trades/${id}`)

            return { data, status }
        },
    },
});
