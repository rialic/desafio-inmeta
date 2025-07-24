<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import TradeCardListDialog from '@/components/TradeCard/TradeCardListDialog.vue'
import TradeCardRemoveDialog from 'src/components/TradeCard/TradeCardRemoveDialog.vue'

import type { TradeCard } from '@/types/tradeCardTypes'
import type { Card } from '@/types/cardTypes'

import { useTradeCardStore } from '@/stores/tradeCardStore'

/* States */
const tradeCardStore = useTradeCardStore()

const quasar = useQuasar()
const router = useRouter()

const isLoading = ref<boolean>(false)
const typeList = ref<'my' | 'all'>('my')

const showTradeCardRemoveDialog = ref<boolean>(false)
const showTradeCardListDialog = ref<boolean>(false)

const selectedOfferingCards = ref<Array<Card>>([])
const selectedReceivingCards = ref<Array<Card>>([])
const selectedCardsToRemove = ref<Array<Card>>([])

/* Computed */
const getChoiceOpenDialogFn = computed(() => {
    return (index: number) => (index === 0) ? openTradeCardListDialog('my') : openTradeCardListDialog('all')
})

const getChoiceComponentTitle = computed(() => {
    return (index: number) => (index === 0) ? 'Meus Cartões' : 'Todos os Cartões'
})

const getChoiceComponentSubtitle = computed(() => {
    return (index: number) => (index === 0) ? 'Escolha os cartões para oferecer' : 'Escolha os cartões que aceita em troca'
})

const isChoiceComponentListNotEmpty = computed(() => {
    return (index: number) => (index === 0) ? selectedOfferingCards.value.length > 0 : selectedReceivingCards.value.length > 0
})

const getChoiceRemoveDialogFn = computed(() => {
    return (index: number) => (index === 0) ? openTradeCardRemoveDialog(selectedOfferingCards.value) : openTradeCardRemoveDialog(selectedReceivingCards.value)
})

const getChoiceRemoveFn = computed(() => {
    return (index: number) => (index === 0) ? clearOfferingCards() : clearReceivingCards()
})

const getChoiceRemoveTextLink = computed(() => {
    return (index: number) => (index === 0) ? `Cartões Oferecidos (${selectedOfferingCards.value.length})` : `Cartões Aceitos (${selectedReceivingCards.value.length})`
})

const enableTradeCardStore = computed(() => {
    return selectedOfferingCards.value.length === 0 || selectedReceivingCards.value.length === 0
})

/* Functions */
function openTradeCardListDialog(type: 'my' | 'all') {
    typeList.value = type
    showTradeCardListDialog.value = true
}

function openTradeCardRemoveDialog(list: Array<Card>) {
    showTradeCardRemoveDialog.value = true
    selectedCardsToRemove.value = list
}

function addOCards(cards: Array<Card>) {
    const selectedCards = typeList.value === 'my' ? selectedOfferingCards : selectedReceivingCards
    showTradeCardListDialog.value = false

    cards.forEach((card) => {
        const isCardInList = selectedCards.value.find((selectedCard) => selectedCard.id === card.id)

        if (!isCardInList) {
            selectedCards.value.push(card)
        }
    })
}

async function saveTradeCard() {
    isLoading.value = true
    const tradeCards = generateTradeCards(selectedOfferingCards.value, selectedReceivingCards.value)

    try {
        const { status } = await tradeCardStore.store({ cards: tradeCards })

        if (status === 200 || status === 201) {
            quasar.notify({
                color: 'positive',
                message: 'Solicitação de troca criada com sucesso',
                icon: 'fa-solid fa-circle-check',
            })
        }
    } catch (error) {
        console.error('Erro ao adicionar cartão:', error)

        quasar.notify({
            color: 'negative',
            message: `Ops... ocorreu um erro ao solicitação de troca. ${String(error)}`,
            icon: 'fa-solid fa-exclamation-circle',
        })
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

function clearAll(length: number) {
    showTradeCardRemoveDialog.value = false

    Array.from({ length }).forEach(() => selectedCardsToRemove.value.pop())
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
                    <div
                        v-for="(_, index) in Array.from({ length: 2 })"
                        :key="index"
                        class="col-12 col-md-6 col-lg-4"
                    >
                        <div
                            class="border-dashed border-grey-6 rounded-borders cursor-pointer q-pa-xl text-center"
                            style="border-width: 2px; min-height: 200px;"
                            @click="getChoiceOpenDialogFn(index)"
                        >
                            <div class="flex column items-center justify-center full-height q-gutter-md">
                                <i class="fa-solid fa-plus fa-2x text-grey-6"></i>
                                <div class="text-h6 text-grey-9 text-weight-medium">
                                    {{ getChoiceComponentTitle(index) }}
                                </div>
                                <div class="text-body2 text-grey-7">
                                    {{ getChoiceComponentSubtitle(index) }}
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="isChoiceComponentListNotEmpty(index)"
                            class="q-mt-xs"
                        >
                            <div class="flex items-center justify-between">
                                <div class="text-subtitle2 text-grey-9 text-weight-medium">
                                    <q-btn
                                        flat
                                        no-caps
                                        style="text-decoration: underline;"
                                        color="primary"
                                        class="q-ma-none"
                                        :disable="isLoading"
                                        @click="getChoiceRemoveDialogFn(index)"
                                    >
                                        {{ getChoiceRemoveTextLink(index) }}
                                    </q-btn>
                                </div>

                                <q-btn
                                    dense
                                    no-caps
                                    flat
                                    color="negative"
                                    size="md"
                                    :disable="isLoading"
                                    @click="getChoiceRemoveFn(index)"
                                >
                                    <div class="flex items-center q-gutter-sm q-px-sm">
                                        <i class="fa-solid fa-trash"></i>

                                        <div class="text-center">
                                            Limpar todos
                                        </div>
                                    </div>
                                </q-btn>
                            </div>
                        </div>
                    </div>
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

    <TradeCardListDialog
        v-model="showTradeCardListDialog"
        :typeList="typeList"
        @add-cards="addOCards"
    />

    <TradeCardRemoveDialog
        v-model="showTradeCardRemoveDialog"
        :selected-cards="selectedCardsToRemove"
        @remove-card="(index) => selectedCardsToRemove.splice(index, 1)"
        @clear-all="clearAll"
    />
</template>

<style scoped>
.border-dashed {
    border-style: dashed;
}

.border-grey-6 {
    border-color: #9e9e9e;
}
</style>