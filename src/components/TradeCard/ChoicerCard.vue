<script setup lang="ts">
import { computed, ref } from 'vue'

import TradeCardListDialog from '@/components/TradeCard/TradeCardListDialog.vue'
import TradeCardRemoveDialog from 'src/components/TradeCard/TradeCardRemoveDialog.vue'

import type { Card } from '@/types/cardTypes'

const props = defineProps<{
    isLoading: boolean
    selectedOfferingCards: Array<Card>
    selectedReceivingCards: Array<Card>
    clearOfferingCards(): void
    clearReceivingCards(): void
}>()

/* State */
const typeList = ref<'my' | 'all'>('my')
const showTradeCardRemoveDialog = ref<boolean>(false)
const showTradeCardListDialog = ref<boolean>(false)
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
    return (index: number) => (index === 0) ? props.selectedOfferingCards.length > 0 : props.selectedReceivingCards.length > 0
})

const getChoiceRemoveDialogFn = computed(() => {
    return (index: number) => (index === 0) ? openTradeCardRemoveDialog(props.selectedOfferingCards) : openTradeCardRemoveDialog(props.selectedReceivingCards)
})

const getChoiceRemoveFn = computed(() => {
    return (index: number) => (index === 0) ? props.clearOfferingCards() : props.clearReceivingCards()
})

const getChoiceRemoveTextLink = computed(() => {
    return (index: number) => (index === 0) ? `Cartões Oferecidos (${props.selectedOfferingCards.length})` : `Cartões Aceitos (${props.selectedReceivingCards.length})`
})

/* Functions */
function addOCards(cards: Array<Card>) {
    const selectedCards = typeList.value === 'my' ? props.selectedOfferingCards : props.selectedReceivingCards
    showTradeCardListDialog.value = false

    cards.forEach((card) => {
        const isCardInList = selectedCards.find((selectedCard) => selectedCard.id === card.id)

        if (!isCardInList) {
            selectedCards.push(card)
        }
    })
}

function openTradeCardListDialog(type: 'my' | 'all') {
    typeList.value = type
    showTradeCardListDialog.value = true
}

function openTradeCardRemoveDialog(list: Array<Card>) {
    selectedCardsToRemove.value = list
    showTradeCardRemoveDialog.value = true
}

function clearAll(length: number) {
    showTradeCardRemoveDialog.value = false

    Array.from({ length }).forEach(() => selectedCardsToRemove.value.pop())
}
</script>

<template>
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
                        :disable="props.isLoading"
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
                    :disable="props.isLoading"
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
