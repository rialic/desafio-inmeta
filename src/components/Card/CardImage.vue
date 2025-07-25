<script setup lang="ts">
import { computed, ref } from 'vue'
import { format, parseISO } from 'date-fns'

import CardImageCtaButtons from '@/components/Card/CardImageCtaButtons.vue'

import type { Card } from '@/types/cardTypes'

const props = withDefaults(defineProps<{
    card: Card | undefined
    isCarousel?: boolean
    isTradeCard?: boolean
    carouselSlides?: Record<string, number>
    isClickable?: boolean
    selectedCards?: Array<{ id: string, name: string }>
    showViewButton?: boolean
    showAddButton?: boolean
    showRemoveButton?: boolean
    isCardSelected?(cardId: string): boolean
    addFn?(id: string | Array<string>): Promise<void>
    removeFn?(id: string): Promise<void>
}>(), {
    isCarousel: false,
    isClickable: false,
    isTradeCard: false,
    showViewButton: true,
    showAddButton: false,
    showRemoveButton: false,
    isCardSelected: () => false,
    addFn: async () => { },
    removeFn: async () => { }
})

const emit = defineEmits<{
    (e: 'addCard', value: Pick<Card, 'id' | 'name'>): void
    (e: 'removeCard', value: number): void
}>()

/* State */
const tradeTypes = new Map([['OFFERING', 'Ofertando'], ['RECEIVING', 'Aceitando']])

const tradeTypeText = ref<string | null>(null)
const tradeTypeColor = ref<string | null>(null)

/* Computed */
const toggleCardSelectionStyle = computed(() => {
    if (props.isCarousel) return () => undefined

    return (card: Card) => ({ border: props.isCardSelected(card.id) ? '2px solid currentColor' : undefined })
})

const toggleTradeTypes = computed(() => {
    return (type: string) => {
        tradeTypeText.value = tradeTypes.get(type)!
        tradeTypeColor.value = type === 'OFFERING' ? 'teal-8' : 'light-blue-9'
    }
})

/* Functions */
function toggleCardSelection(card: Card) {
    if (props.isCarousel) return

    const existingIndex = props.selectedCards!.findIndex(item => item.id === card.id)

    if (existingIndex > -1) {
        return emit('removeCard', existingIndex)
    }

    return emit('addCard', { id: card.id, name: card.name })
}

function truncateText(text: string, maxLength: number = 23): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
</script>

<template>
    <q-card
        flat
        bordered
        :style="toggleCardSelectionStyle(card as Card)"
    >
        <div
            class="q-py-sm q-px-md"
            :class="{ 'cursor-pointer': props.isClickable && !props.isCarousel }"
            @click="props.isClickable ? toggleCardSelection(card as Card) : undefined"
        >
            <div
                class="relative-position"
                :style="{ 'height': !props.isCarousel ? '300px' : undefined }"
            >
                <template v-if="props.isCarousel">
                    <q-carousel
                        v-model="props.carouselSlides![props.card!.id]"
                        :control-type="'unelevated'"
                        arrows
                        :padding="false"
                        control-color="grey-9"
                        height="300px"
                    >
                        <q-carousel-slide
                            v-for="(card, index) in props.card!.tradeCards"
                            :key="card.id"
                            :name="index"
                            class="q-pa-none"
                        >
                            <q-img
                                :src="card.imageUrl"
                                fit="contain"
                                class="full-width full-height bg-grey-1 rounded-borders"
                            >
                                <template #loading>
                                    <q-skeleton height="300px" />
                                </template>
                            </q-img>

                            {{ toggleTradeTypes(card.type) }}
                        </q-carousel-slide>
                    </q-carousel>
                    <div
                        class="absolute-top-right rounded-borders"
                        style="top: -16px; right: -22px;"
                    >
                        <q-badge
                            :color="tradeTypeColor!"
                            class="q-px-sm q-py-xs text-body2 text-weight-medium"
                        >
                            {{ tradeTypeText }}
                        </q-badge>
                    </div>
                </template>

                <q-img
                    v-else
                    :src="props.card!.imageUrl"
                    fit="contain"
                    class="full-width full-height bg-grey-1 rounded-borders"
                >
                    <template #loading>
                        <q-skeleton height="300px" />
                    </template>
                </q-img>
            </div>
        </div>

        <q-card-section class="text-center q-pt-none">
            <div class="text-body2 q-mb-sm">
                <i class="fa-solid fa-user"></i>

                {{ truncateText(props.card!.name) }}
            </div>

            <div class="text-body2 q-mb-sm">
                Criado em:

                {{ format(parseISO(props.card!.createdAt.slice(0, -1)), 'dd/MM/yyyy HH:mm') }}
            </div>

            <CardImageCtaButtons
                :card="props.card"
                :is-trade-card="props.isTradeCard"
                :show-view-button="props.showViewButton"
                :show-add-button="props.showAddButton"
                :show-remove-button="props.showRemoveButton"
                :add-fn="props.addFn!"
                :remove-fn="props.removeFn!"
            />
        </q-card-section>
    </q-card>
</template>