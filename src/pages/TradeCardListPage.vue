<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import CardImage from '@/components/Card/CardImage.vue'

import type { Card } from '@/types/cardTypes'
import type { User, TradeCard, TradeCardRequests } from '@/types/tradeCardGalleryTypes'

import { useAuthStore } from '@/stores/authStore'
import { useTradeCardStore } from '@/stores/tradeCardStore'

/* State */
const authStore = useAuthStore()
const tradeCardStore = useTradeCardStore()

const quasar = useQuasar()
const router = useRouter()

const isLoading = ref<boolean>(false)
const tradeCardRequests = ref<Array<TradeCardRequests>>([])
const carouselSlides = ref<Record<string, number>>({})

/* onMounted */
onMounted(async () => {
    await loadTradeCards(1)
})

/* Functions */
async function loadTradeCards(page: number) {
    const user = authStore.user
    isLoading.value = true

    try {
        const { status, data } = await tradeCardStore.index({ page: page, rpp: 100 })

        if (status && status === 200) {
            tradeCardRequests.value = data.list
                .filter((tradeCardRequest: any) => tradeCardRequest.tradeCards.length && tradeCardRequest.userId === user!.id)
                .map((tradeCardRequest: any) => {
                    const tradeCards: TradeCard[] = tradeCardRequest.tradeCards.map((tradeCard: any) => presetTradeCards(tradeCard))
                    carouselSlides.value[tradeCardRequest.id] = 0

                    return generateTradeCards(tradeCardRequest, tradeCards)
                })
        }
    } catch (error) {
        console.error('Erro ao carregar cartões:', error)

        quasar.notify({
            color: 'negative',
            message: `Ops... ocorreu um erro ao carregar os cartões. ${String(error)}`,
            icon: 'fa-solid fa-exclamation-circle',
        })
    } finally {
        isLoading.value = false
    }
}

async function removeTradeCard(id: string) {
    isLoading.value = true

    try {
        const { status } = await tradeCardStore.delete(id)

        if (status === 200) {
            quasar.notify({
                color: 'positive',
                message: 'Solicitação de troca excluída com sucesso.',
                icon: 'fa-solid fa-circle-check',
            })

            await loadTradeCards(1)
        }
    } catch (error) {
        console.error('Erro ao adicionar cartão:', error)

        quasar.notify({
            color: 'negative',
            message: `Ops... ocorreu um erro ao adicionar o cartão. ${String(error)}`,
            icon: 'fa-solid fa-exclamation-circle',
        })
    } finally {
        isLoading.value = false
    }
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

function presetTradeCards(tradeCard: any): TradeCard {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, ...rest } = tradeCard.card

    return { ...rest, type: tradeCard.type }
}
</script>

<template>
    <div class="flex items-center justify-between q-pa-md">
        <div class="text-h6 text-grey-9 text-weight-medium">
            Solicitações de troca
        </div>

        <div class="flex q-gutter-md">
            <q-btn
                dense
                no-caps
                unelevated
                :ripple="false"
                color="grey-9"
                @click="router.push({ name: 'private.trade-cards-form' })"
            >
                <div class="flex items-center q-gutter-sm q-px-sm">
                    <div class="text-center">
                        <span class="text-weight-medium">
                            Criar solicitação
                        </span>
                    </div>
                </div>
            </q-btn>
        </div>
    </div>

    <div class="flex justify-center q-px-md q-pt-none">
        <q-card-section class="q-pt-sm">
            <q-card
                flat
                class="q-px-sm"
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

                <div class="row q-col-gutter-md">
                    <div
                        class="relative-position"
                        :class="[tradeCardRequests.length > 4 ? 'col-12 col-sm-6 col-md-4 col-lg-3' : 'col']"
                        v-for="request in tradeCardRequests"
                        :key="request.id"
                    >
                        <CardImage
                            :type-list="'all'"
                            :card="request.card"
                            :is-carousel="true"
                            :carousel-slides="carouselSlides"
                            :show-remove-button="true"
                            :remove-fn="removeTradeCard"
                        />
                    </div>
                </div>
            </q-card>
        </q-card-section>
    </div>
</template>
