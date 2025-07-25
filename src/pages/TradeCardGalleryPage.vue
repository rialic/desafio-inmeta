<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { notifyError } from '@/helpers'

import CardImage from '@/components/Card/CardImage.vue'

import type { Card } from '@/types/cardTypes'
import type { User, TradeCard, TradeCardRequests } from '@/types/tradeCardGalleryTypes'

import { useAuthStore } from '@/stores/authStore'
import { useTradeCardStore } from '@/stores/tradeCardStore'

/* State */
const authStore = useAuthStore()
const tradeStore = useTradeCardStore()

const router = useRouter()
const isLoading = ref<boolean>()
const tradeCardRequests = ref<Array<TradeCardRequests>>([])
const carouselSlides = ref<Record<string, number>>({})

/* onMounted */
onMounted(async () => {
    await loadTradeCards(1)
})

/* Functions */
async function loadTradeCards(page: number) {
    isLoading.value = true

    try {
        const { status, data } = await tradeStore.index({ page, rpp: 100 })

        if (status && status === 200) {
            tradeCardRequests.value = data.list
                .filter((tradeCardRequest: any) => tradeCardRequest.tradeCards.length)
                .map((tradeCardRequest: any) => {
                    const tradeCards: TradeCard[] = tradeCardRequest.tradeCards.map((tradeCard: any) => presetTradeCards(tradeCard))
                    carouselSlides.value[tradeCardRequest.id] = 0

                    return generateTradeCards(tradeCardRequest, tradeCards)
                })
        }
    } catch (error) {
        console.error('Erro ao carregar cartões:', error)
        notifyError(`Ops... ocorreu um erro ao carregar os cartões. ${String(error)}`)
    } finally {
        isLoading.value = false
    }
}

function presetTradeCards(tradeCard: any): TradeCard {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, ...rest } = tradeCard.card

    return { ...rest, type: tradeCard.type }
}

function generateTradeCards(tradeCardRequest: any, tradeCards: TradeCard[]): TradeCardRequests {
    return {
        id: tradeCardRequest.id,
        user: {
            id: tradeCardRequest.userId,
            name: tradeCardRequest.user.name
        } as User,
        createdAt: tradeCardRequest.createdAt,
        tradeCards,
        card: {
            id: tradeCardRequest.id,
            name: tradeCardRequest.user.name,
            createdAt: tradeCardRequest.createdAt,
            tradeCards: tradeCards
        } as Card
    }
}
</script>

<template>
    <div
        class="flex items-center justify-center q-pa-lg"
        style="min-height: 100vh; background-color: #f5f5f5;"
    >
        <q-card
            flat
            bordered
            style="width: 100%; max-width: 1200px;"
        >
            <div class="flex justify-between q-pa-md">
                <div class="text-h5 text-grey-9 text-weight-medium">
                    Galeria de cartas
                </div>

                <div class="flex q-gutter-md">
                    <q-btn
                        v-if="!authStore.token"
                        dense
                        no-caps
                        unelevated
                        :ripple="false"
                        color="grey-9 q-px-sm"
                        @click="router.push({ name: 'guest.auth' })"
                    >
                        <div class="flex items-center q-gutter-sm">
                            <div class="text-center">
                                <span class="text-weight-medium">
                                    Login
                                </span>
                            </div>

                            <i class="fa-solid fa-arrow-right-to-bracket fa-md" />
                        </div>
                    </q-btn>

                    <q-btn
                        v-else
                        dense
                        no-caps
                        unelevated
                        :ripple="false"
                        color="grey-9 q-px-sm"
                        @click="router.push({ name: 'private.cards' })"
                    >
                        <div class="flex items-center q-gutter-sm">
                            <div class="text-center">
                                <span class="text-weight-medium">
                                    Área privada
                                </span>
                            </div>
                        </div>
                    </q-btn>
                </div>
            </div>

            <div class="flex column items-center q-gutter-sm q-mb-lg">
                <div class="text-h6 text-center text-grey-9 text-weight-medium">
                    Melhor site de trocas de cartas para completar seu deck
                </div>

                <div class="text-body2 text-center text-grey-7">
                    Descubra o prazer de trocar, colecionar e conectar-se com outros entusiastas. Aqui, cada carta tem
                    valor e cada troca conta uma história. Encontre exatamente o que procura e surpreenda-se com
                    descobertas inesperadas.
                </div>
            </div>

            <div class="row q-col-gutter-md q-pa-md">
                <div class="col-12 col-md-4">
                    <div class="flex column q-gutter-sm">
                        <div class="flex items-center">
                            <i class="fa-solid fa-magnifying-glass"></i>

                            <span class="q-ml-sm text-grey-9 text-weight-medium">Cartões verificados</span>
                        </div>

                        <small class="text-left text-grey-7">
                            Cada carta passa por nossa análise de autenticidade antes de entrar na plataforma,
                            garantimos que você sempre saiba exatamente o que está trocando.
                        </small>
                    </div>
                </div>

                <div class="col-12 col-md-4">
                    <div class="flex column q-gutter-sm">
                        <div class="flex items-center">
                            <i class="fa-solid fa-globe"></i>

                            <span class="q-ml-sm text-grey-9 text-weight-medium">Rede global de colecionadores</span>
                        </div>

                        <small class="text-left text-grey-7">
                            Conecte-se com milhares de entusiastas ao redor do mundo em busca das mesmas paixões. Nossa
                            comunidade ativa facilita encontros entre colecionadores com interesses complementares.
                        </small>
                    </div>
                </div>

                <div class="col-12 col-md-4">
                    <div class="flex column q-gutter-sm">
                        <div class="flex items-center">
                            <i class="fa-solid fa-lightbulb"></i>

                            <span class="q-ml-sm text-grey-9 text-weight-medium">Trocas inteligentes</span>
                        </div>

                        <small class="text-left text-grey-7">
                            Nosso algoritmo encontra automaticamente as melhores oportunidades de troca baseadas no seu
                            perfil e em saus pesquisa anteriores
                        </small>
                    </div>
                </div>
            </div>

            <q-card-section>
                <q-card
                    flat
                    bordered
                    class="q-pa-sm"
                    style="width: 100%; max-width: 1200px;"
                >
                    <div
                        v-if="isLoading && tradeCardRequests.length === 0"
                        class="flex justify-center q-py-xl"
                    >
                        <q-spinner-dots
                            size="50px"
                            color="grey-9"
                        />
                    </div>

                    <div
                        v-else
                        class="row q-col-gutter-md"
                    >
                        <div
                            class="col-12 col-sm-6 col-md-3"
                            v-for="request in tradeCardRequests"
                            :key="request.id"
                        >

                            <CardImage
                                :card="request!.card"
                                :is-carousel="true"
                                :is-trade-card="true"
                                :carousel-slides="carouselSlides"
                            />
                        </div>
                    </div>
                </q-card>
            </q-card-section>
        </q-card>
    </div>
</template>