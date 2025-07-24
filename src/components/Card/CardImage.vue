<script setup lang="ts">
import { computed } from 'vue'
import { format, parseISO } from 'date-fns'
import CardImageButtons from '@/components/Card/CardImageButtons.vue'
import type { Card } from '@/types/cardTypes'

const props = withDefaults(defineProps<{
    card: Card | undefined
    isCarousel?: boolean
    carouselSlides?: Record<string, number>
    typeList: string
    selectedCards?: Array<{ id: string, name: string }>
    showRemoveButton?: boolean
    hideEssentialButtons?: boolean
    isCardSelected?(cardId: string): boolean
    addCardToCollection?(id: string | Array<string>): Promise<void>
    removeFn?(id: string): Promise<void>
}>(), {
    isCarousel: false,
    hideEssentialButtons: false,
    showRemoveButton: false,
    isCardSelected: () => false,
    addCardToCollection: async () => { },
    removeFn: async () => { }
})

const emit = defineEmits<{
    (e: 'addCard', value: Pick<Card, 'id' | 'name'>): void
    (e: 'removeCard', value: number): void
}>()


const tradeTypes = new Map([['OFFERING', 'Oferecendo'], ['RECEIVING', 'Aceitando']])

/* Computed */
const toggleCardSelectionStyle = computed(() => {
    if (props.isCarousel) return () => undefined

    return (card: Card) => ({ border: props.isCardSelected(card.id) ? '2px solid currentColor' : undefined })
})

/* Functions */
function toggleCardSelection(card: Card) {
    if (props.typeList !== 'all' || props.isCarousel) return

    const existingIndex = props.selectedCards!.findIndex(item => item.id === card.id)

    if (existingIndex > -1) {
        return emit('removeCard', existingIndex)
    } else {
        return emit('addCard', { id: card.id, name: card.name })
    }
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
            :class="{ 'cursor-pointer': props.typeList === 'all' && !props.isCarousel }"
            @click="props.typeList === 'all' ? toggleCardSelection(card as Card) : undefined"
        >
            <div
                class="relative-position"
                :style="{ 'height': !props.isCarousel ? '300px' : undefined }"
            >
                <template v-if="props.isCarousel">
                    <q-carousel
                        v-model="props.carouselSlides![props.card!.id]"
                        arrows
                        :padding="false"
                        control-color="grey-10"
                        height="300px"
                        class="bg-grey-1"
                    >
                        <q-carousel-slide
                            v-for="(crd, index) in props.card!.tradeCards"
                            :key="crd.id"
                            :name="index"
                            class="q-pa-none"
                        >
                            <q-img
                                :src="crd.imageUrl"
                                fit="contain"
                                class="full-width full-height bg-grey-1 rounded-borders"
                            >
                                <template #loading>
                                    <q-skeleton height="300px" />
                                </template>
                            </q-img>

                            <div
                                class="absolute-top-right q-pa-sm rounded-borders"
                                :class="crd.type === 'OFFERING' ? 'bg-green-8' : 'bg-blue-8'"
                                style="opacity: .8;"
                            >
                                <span class="text-white text-weight-medium text-caption">
                                    {{ tradeTypes.get(crd.type) }}
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

        <q-card-section class="text-center">
            <div class="text-body2 q-mb-sm">
                <i class="fa-solid fa-user"></i>
                {{ truncateText(props.card!.name) }}
            </div>

            <div class="text-body2 q-mb-sm">
                Criado em:
                {{ format(parseISO(props.card!.createdAt.slice(0, -1)), 'dd/MM/yyyy HH:mm') }}
            </div>

            <CardImageButtons
                :card="props.card"
                :type-list="props.typeList"
                :is-carousel="props.isCarousel"
                :hide-essential-buttons="props.hideEssentialButtons"
                :show-remove-button="props.showRemoveButton"
                :add-card-to-collection="props.addCardToCollection!"
                :remove-fn="props.removeFn!"
            />
        </q-card-section>
    </q-card>
</template>