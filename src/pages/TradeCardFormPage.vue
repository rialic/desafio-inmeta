<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { notifySuccess, notifyError } from '@/helpers'

import ChoicerCard from '@/components/TradeCard/ChoicerCard.vue'

import type { TradeCard } from '@/types/tradeCardTypes'
import type { Card } from '@/types/cardTypes'

import { useTradeCardStore } from '@/stores/tradeCardStore'

/* States */
const tradeCardStore = useTradeCardStore()

const router = useRouter()

const isLoading = ref<boolean>(false)
const selectedOfferingCards = ref<Array<Card>>([])
const selectedReceivingCards = ref<Array<Card>>([])

/* Computed */
const enableTradeCardStore = computed(() => {
    return selectedOfferingCards.value.length === 0 || selectedReceivingCards.value.length === 0
})

/* Functions */
async function saveTradeCard() {
    const tradeCards = generateTradeCards(selectedOfferingCards.value, selectedReceivingCards.value)
    isLoading.value = true

    try {
        const { status } = await tradeCardStore.store({ cards: tradeCards })

        if (status === 200 || status === 201) {
            notifySuccess('Solicitação de troca criada com sucesso')
        }
    } catch (error) {
        console.error('Erro ao adicionar cartão:', error)
        notifyError(`Ops... ocorreu um erro ao solicitação de troca. ${String(error)}`)
    } finally {
        isLoading.value = false

        clearOfferingCards()
        clearReceivingCards()
    }
}

function generateTradeCards(selectedOfferingCards: Card[], selectedReceivingCards: Card[]): TradeCard[] {
    const offeringCards = selectedOfferingCards.map(card => ({ cardId: card.id, type: 'OFFERING' as const }))
    const receivingCards = selectedReceivingCards.map(card => ({ cardId: card.id, type: 'RECEIVING' as const }))

    return [...offeringCards, ...receivingCards]
}

function clearOfferingCards() {
    selectedOfferingCards.value = []
}

function clearReceivingCards() {
    selectedReceivingCards.value = []
}
</script>

<template>
    <div class="flex items-center justify-between q-pa-md">
        <div class="text-h6 text-grey-9 text-weight-medium">
            Nova solicitações de troca
        </div>

        <div class="flex q-gutter-md">
            <q-btn
                dense
                no-caps
                unelevated
                :ripple="false"
                color="grey-9"
                @click="router.back()"
            >
                <div class="flex items-center q-gutter-sm q-px-sm">
                    <div class="text-center">
                        <span class="text-weight-medium">
                            Voltar
                        </span>
                    </div>
                </div>
            </q-btn>
        </div>
    </div>

    <div class="flex justify-center q-px-md q-pt-lg">
        <q-card-section class="q-pt-sm full-width">
            <q-card
                flat
                class="q-px-sm"
            >
                <div class="flex justify-center q-mb-md">
                    <span class="text-weight-medium text-grey-9">
                        Escolha um cartão que aceita oferecer e outro cartão que aceita
                        em troca para criar uma solicitação
                    </span>
                </div>

                <div class="row q-col-gutter-xl justify-center q-mb-xl">
                    <ChoicerCard
                        :is-loading="isLoading"
                        :selected-offering-cards=selectedOfferingCards
                        :selected-receiving-cards=selectedReceivingCards
                        :clear-offering-cards="clearOfferingCards"
                        :clear-receiving-cards="clearReceivingCards"
                    />
                </div>

                <div class="flex justify-center q-gutter-md q-mt-xl">
                    <q-btn
                        no-caps
                        unelevated
                        color="grey-9"
                        :disable="enableTradeCardStore || isLoading"
                        @click="saveTradeCard"
                    >
                        <div class="flex items-center q-gutter-sm q-px-sm">
                            <i class="fa-solid fa-exchange-alt"></i>

                            <span class="text-weight-medium">Criar Solicitação de Troca</span>
                        </div>
                    </q-btn>
                </div>
            </q-card>
        </q-card-section>
    </div>
</template>