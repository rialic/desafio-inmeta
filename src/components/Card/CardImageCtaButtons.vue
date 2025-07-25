<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import BasicCtaDialog from '@/components/BasicCtaDialog.vue'
import CardInfoDialog from '@/components/Card/CardInfoDialog.vue'
import TradeCardViewDialog from '@/components/TradeCard/TradeCardViewDialog.vue'

import type { CtaData } from '@/types/ctaDialogTypes'
import type { Card } from '@/types/cardTypes'

const props = withDefaults(defineProps<{
    card: Card | undefined
    isTradeCard?: boolean
    showViewButton?: boolean
    showAddButton?: boolean
    showRemoveButton?: boolean
    addFn?(id: string | Array<string>): Promise<void>
    removeFn?(id: string): Promise<void>
}>(), {
    isTradeCard: false,
    showViewButton: true,
    showAddButton: false,
    showRemoveButton: false
})

/* State */
const router = useRouter()
const shownCardInfoDialog = ref<boolean>(false)
const showTradeCardViewDialog = ref<boolean>(false)
const showCallToActionDialog = ref<boolean>(false)
const selectedCard = ref<Card | null>(null)

const selectedCardRequest = ref<Card | null>(null)
const selectedCtaCard = ref<CtaData | null>()

/* Functions */
function openInfoDialog(card: Card) {
    shownCardInfoDialog.value = true
    selectedCard.value = card
}

function openAddDialog(card: Card) {
    showCallToActionDialog.value = true
    selectedCtaCard.value = { id: card.id, title: 'Adicionar?', message: `Tem certeza que deseja adicionar o cartão ${card.name}`, ctaFn: props.addFn! }
}

function openRemoveDialog(card: Card) {
    showCallToActionDialog.value = true
    selectedCtaCard.value = { id: card.id, title: 'Excluir?', message: 'Tem certeza que deseja excluir o cartão', ctaFn: props.removeFn! }
}

function openTradeDialog(card: Card) {
    showTradeCardViewDialog.value = true
    selectedCardRequest.value = card
}
</script>

<template>
    <div class="flex justify-center q-gutter-md">
        <q-btn
            v-if="props.showAddButton"
            dense
            no-caps
            color="grey-9"
            unelevated
            @click="openAddDialog(card as Card)"
        >
            <div class="flex items-center q-gutter-sm q-px-sm">
                <div class="text-center">
                    <span class="text-weight-medium">
                        Adicionar
                    </span>
                </div>

                <i class="fa-solid fa-circle-plus fa-md" />
            </div>
        </q-btn>

        <q-btn
            v-if="showViewButton && card"
            dense
            no-caps
            color="grey-9"
            unelevated
            @click="isTradeCard ? openTradeDialog(card!) : router.push({ name: 'private.cards-form', params: { id: card.id } })"
        >
            <div class="flex items-center q-gutter-sm q-px-sm">
                <div class="text-center">
                    <span class="text-weight-medium">
                        Visualizar
                    </span>
                </div>

                <i class="fa-regular fa-eye fa-sm" />
            </div>
        </q-btn>

        <q-btn
            v-if="!isTradeCard"
            dense
            no-caps
            color="grey-9"
            unelevated
            @click="openInfoDialog(card as Card)"
        >
            <div class="flex items-center q-px-sm">
                <i class="fa-solid fa-arrow-up-right-from-square fa-sm" />
            </div>
        </q-btn>

        <q-btn
            v-if="showRemoveButton && card"
            dense
            no-caps
            color="negative"
            unelevated
            @click="openRemoveDialog(card)"
        >
            <div class="flex items-center q-gutter-sm q-px-sm">
                <i class="fa-solid fa-trash fa-sm" />
            </div>
        </q-btn>
    </div>

    <CardInfoDialog
        v-model="shownCardInfoDialog"
        :selected-card="selectedCard"
    />

    <TradeCardViewDialog
        v-if="selectedCardRequest"
        v-model="showTradeCardViewDialog"
        :selected-card="selectedCardRequest"
    />

    <BasicCtaDialog
        v-if="selectedCtaCard"
        v-model="showCallToActionDialog"
        :id="selectedCtaCard.id"
        :title="selectedCtaCard.title"
        :message="selectedCtaCard.message"
        :cta-fn="selectedCtaCard.ctaFn"
    />
</template>
