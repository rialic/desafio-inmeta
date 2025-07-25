<script setup lang="ts">
import { computed } from 'vue'
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
const tradeTypes = new Map([['OFFERING', 'Oferecendo'], ['RECEIVING', 'Aceitando']])

/* Computed */
const toggleCardSelectionStyle = computed(() => {
    if (props.isCarousel) return () => undefined

    return (card: Card) => ({ border: props.isCardSelected(card.id) ? '2px solid currentColor' : undefined })
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

                            <div
                                class="absolute-top-right q-pa-sm rounded-borders"
                                :class="card.type === 'OFFERING' ? 'bg-green-8' : 'bg-blue-8'"
                                style="opacity: .8;"
                            >
                                <span class="text-white text-weight-medium text-caption">
                                    {{ tradeTypes.get(card.type) }}
                                </span>
                            </div>
                        </q-carousel-slide>
                    </q-carousel>
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