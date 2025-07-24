<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CardImage from '@/components/Card/CardImage.vue'
import { useRouter } from 'vue-router'
import type { Card } from '@/types/cardTypes'
import type { User, TradeCard, TradeCardRequests } from '@/types/cardsGalleryTypes'
import { useQuasar } from 'quasar'

import { useAuthStore } from '@/stores/authStore'
import { useTradeCardStore } from '@/stores/tradeCardStore'

const authStore = useAuthStore()
const tradeCardStore = useTradeCardStore()

const quasar = useQuasar()
const router = useRouter()
const tradeCardRequests = ref<Array<TradeCardRequests>>([])
const carouselSlides = ref<Record<string, number>>({})
const isLoading = ref<boolean>(false)

/* onMounted */
onMounted(async () => {
    await loadTradeCards(1)
})

/* Functions */
async function loadTradeCards(page: number) {
    const { status, data } = await tradeCardStore.index({ page: page, rpp: 100 })
    const user = authStore.user

    if (status && status === 200) {
        tradeCardRequests.value = data.list
            .filter((tradeCardRequest: any) => tradeCardRequest.tradeCards.length && tradeCardRequest.userId === user!.id)
            .map((tradeCardRequest: any) => {
                const tradeCards: TradeCard[] = tradeCardRequest.tradeCards.map((tradeCard: any) => presetTradeCards(tradeCard))
                carouselSlides.value[tradeCardRequest.id] = 0

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
                } as TradeCardRequests
            })
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
                <div class="row q-col-gutter-md">
                    <div
                        class="relative-position"
                        :class="[tradeCardRequests.length > 4 ? 'col-12 col-sm-6 col-md-4 col-lg-3' : 'col']"
                        v-for="request in tradeCardRequests"
                        :key="request.id"
                    >
                        <CardImage
                            :type-list="'all'"
                            :card="request!.card"
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
