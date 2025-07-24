<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CardInfoDialog from '@/components/Card/CardInfoDialog.vue'
import CardAddDialog from '@/components/Card/CardAddDialog.vue'
import TradeCardViewDialog from '@/components/TradeCard/TradeCardViewDialog.vue'
import CardRemoveDialog from '@/components/CardRemoveDialog.vue'
import type { Card } from '@/types/cardTypes'

const props = withDefaults(defineProps<{
    card: Card | undefined
    typeList: string
    isCarousel?: boolean
    hideEssentialButtons?: boolean
    showRemoveButton?: boolean
    addCardToCollection?(id: string | Array<string>): Promise<void>
    removeFn?(id: string): Promise<void>
}>(), {
    isCarousel: false,
    showRemoveButton: false
})

const router = useRouter()
const isLoading = ref<boolean>(false)
const shownCardInfoDialog = ref<boolean>(false)
const shownCardAddDialog = ref<boolean>(false)
const showTradeCardViewDialog = ref<boolean>(false)
const showRemoveCardDialog = ref<boolean>(false)
const selectedCard = ref<Card | null>(null)

const selectedCardRequest = ref<Card | null>(null)
const selectedId = ref<string | null>(null)

/* Functions */
function openCardDialog(card: Card, typeDialog: string) {
    if (typeDialog === 'info') {
        shownCardInfoDialog.value = true
    }

    if (typeDialog === 'add') {
        shownCardAddDialog.value = true
    }

    selectedCard.value = card
}

function openTradeDialog(card: Card) {
    showTradeCardViewDialog.value = true
    selectedCardRequest.value = card
}

function openRemoveDialog(card: Card) {
    showRemoveCardDialog.value = true
    selectedId.value = card.id
}
</script>

<template>
    <div class="flex justify-center q-gutter-md">
        <template v-if="!props.isCarousel">
            <q-btn
                v-if="props.typeList === 'all' && !props.hideEssentialButtons"
                dense
                no-caps
                color="grey-9"
                unelevated
                @click="openCardDialog(card as Card, 'add')"
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
                v-if="!props.hideEssentialButtons"
                dense
                no-caps
                color="grey-9"
                unelevated
                @click="router.push({ name: 'private.cards-form', params: { id: card!.id } })"
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
                dense
                no-caps
                color="grey-9"
                unelevated
                @click="openCardDialog(card as Card, 'info')"
            >
                <div class="flex items-center q-px-sm">
                    <i class="fa-solid fa-arrow-up-right-from-square fa-sm" />
                </div>
            </q-btn>
        </template>

        <q-btn
            v-else
            dense
            no-caps
            color="grey-9"
            unelevated
            @click="openTradeDialog(card!)"
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
            v-if="showRemoveButton"
            dense
            no-caps
            color="negative"
            unelevated
            @click="openRemoveDialog(card!)"
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

    <CardAddDialog
        v-model="shownCardAddDialog"
        :selected-card="selectedCard"
        :add-fn="addCardToCollection!"
        :is-loading="isLoading"
    />

    <TradeCardViewDialog
        v-model="showTradeCardViewDialog"
        :selected-card="selectedCardRequest!"
    />

    <CardRemoveDialog
        v-model="showRemoveCardDialog"
        :id="selectedId!"
        :remove-fn="removeFn!"
        :is-loading="isLoading"
    />
</template>
