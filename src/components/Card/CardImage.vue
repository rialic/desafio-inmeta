<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Card } from '@/types/cardTypes'
import { format, parseISO } from 'date-fns'
import CardInfoDialog from '@/components/Card/CardInfoDialog.vue'
import CardAddDialog from '@/components/Card/CardAddDialog.vue'

const props = defineProps<{
    card: Card
    typeList: string
    selectedCards: Array<{ id: string, name: string }>
    isCardSelected(cardId: string): boolean
    addCardToCollection(id: string | Array<string>): Promise<void>
}>()

const emit = defineEmits<{
    (e: 'addCard', value: Pick<Card, 'id' | 'name'>): void
    (e: 'removeCard', value: number): void
}>()

const router = useRouter()
const isLoading = ref<boolean>(false)
const shownCardInfoDialog = ref<boolean>(false)
const shownCardAddDialog = ref<boolean>(false)
const selectedCard = ref<Card | null>(null)

/* Computed */
const toggleCardSelectionStyle = computed(() => {
    return (card: any) => ({ border: props.isCardSelected(card.id) ? '2px solid currentColor' : undefined })
})

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

function toggleCardSelection(card: Card) {
    if (props.typeList !== 'all') return

    const existingIndex = props.selectedCards.findIndex(item => item.id === card.id)

    if (existingIndex > -1) {
        return emit('removeCard', existingIndex)
    } else {
        return emit('addCard', { id: card.id, name: card.name })
    }
}
</script>

<template>
    <q-card
        flat
        bordered
        :style="toggleCardSelectionStyle(card)"
    >
        <div
            class="q-py-sm q-px-md"
            :class="{ 'cursor-pointer': props.typeList === 'all' }"
            @click="props.typeList === 'all' ? toggleCardSelection(card) : undefined"
        >
            <div
                class="relative-position"
                style="height: 300px;"
            >
                <q-img
                    :src="card.imageUrl"
                    fit="contain"
                    class="full-width full-height bg-grey-1 rounded-borders"
                >
                    <template v-slot:loading>
                        <q-skeleton height="300px" />
                    </template>
                </q-img>
            </div>
        </div>

        <q-card-section class="text-center">
            <div class="text-body2 q-mb-sm">
                <i class="fa-solid fa-user"></i>
                {{ card.name }}
            </div>

            <div class="text-body2 q-mb-sm">
                Criado em:
                {{ format(parseISO(card.createdAt.slice(0, -1)), 'dd/MM/yyyy HH:mm') }}
            </div>

            <div class="flex justify-center q-gutter-md">
                <q-btn
                    v-if="props.typeList === 'all'"
                    dense
                    no-caps
                    color="grey-9"
                    unelevated
                    @click="openCardDialog(card, 'add')"
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
                    dense
                    no-caps
                    color="grey-9"
                    unelevated
                    @click="router.push({ name: 'private.cards-form', params: { id: card.id } })"
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
                    @click="openCardDialog(card, 'info')"
                >
                    <div class="flex items-center q-px-sm">
                        <i class="fa-solid fa-arrow-up-right-from-square fa-sm" />
                    </div>
                </q-btn>
            </div>
        </q-card-section>
    </q-card>

    <CardInfoDialog
        v-model="shownCardInfoDialog"
        :selected-card="selectedCard"
    />

    <CardAddDialog
        v-model="shownCardAddDialog"
        :selected-card="selectedCard"
        :add-fn="addCardToCollection"
        :is-loading="isLoading"
    />
</template>