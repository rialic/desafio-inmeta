import { defineStore } from 'pinia'
import { api } from '@/boot/axios'
import type { AxiosResponse } from 'axios'

export const useCardsStore = defineStore('cardsStore', {
    state: () => ({}),

    actions: {
        async show(id: string) {
            const { data, status }: AxiosResponse = await api.get(`cards/${id}`)

            return { data, status }
        },
        async index(payload: Record<string, any>) {
            const query: URLSearchParams | undefined = new URLSearchParams(payload)
            const { data, status }: AxiosResponse = await api.get(`cards?${query}`)

            return { data, status }
        },
        async store(payload: Record<string, any>) {
            const { data, status }: AxiosResponse = await api.post('me/cards', payload)

            return { data, status }
        },
        async myCards(payload: Record<string, any>) {
            const query: URLSearchParams | undefined = new URLSearchParams(payload)
            const { data, status }: AxiosResponse = await api.get(`me/cards?${query}`)

            return { data, status }
        }
    },
});
