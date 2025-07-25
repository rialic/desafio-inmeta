<script setup lang="ts">
import { onUpdated, ref } from 'vue'
import { useRouter } from 'vue-router'
import { notifyError } from '@/helpers'

import BasicPaginator from '@/components/BasicPaginator.vue'
import CardImage from '@/components/Card/CardImage.vue'

import type { StoreMethod } from '@/types/tradeCardTypes'
import type { Card } from '@/types/cardTypes'

import { useCardsStore } from '@/stores/cardsStore'


const props = defineProps<{
    typeList: 'my' | 'all'
}>()

const emit = defineEmits<{
    (e: 'addCards', cards: Array<Card>): void
}>()

/* State */
const cardsStore = useCardsStore()

const showAllCardsDialog = defineModel<boolean>({ default: false })

const router = useRouter()

const isLoading = ref<boolean>(false)
const hasMore = ref<boolean>(false)
const cards = ref<Array<Card>>([])
const selectedCards = ref<Array<{ id: string, name: string }>>([])
const currentPage = ref<number>(1)
const typeFetch: Record<string, StoreMethod> = { my: 'myCards', all: 'index' }

/* onUpdated */
onUpdated(async () => {
    if (showAllCardsDialog.value) {
        await loadCards(1)
    }
})

/* Functions */
async function loadCards(page: number) {
    const method: StoreMethod = typeFetch[props.typeList]!
    cards.value = []
    isLoading.value = true

    try {
        const { status, data } = await cardsStore[method]({ page, rpp: method === 'myCards' ? 100 : 12 })

        if (status === 200 && data) {
            cards.value = data.list || data as Card[]
            currentPage.value = data.page
            hasMore.value = data.more
        }
    } catch (error) {
        cards.value = []
        hasMore.value = false

        console.error('Erro ao carregar cartões:', error)
        notifyError(`Ops... ocorreu um erro ao carregar os cartões. ${String(error)}`)
    } finally {
        isLoading.value = false
    }
}

function isCardSelected(cardId: string): boolean {
    return selectedCards.value.some(item => item.id === cardId)
}

function addCard(card: Pick<Card, 'id' | 'name'>) {
    selectedCards.value.push(card)
}

function removeCard(index: number) {
    selectedCards.value.splice(index, 1)
}

function addSelectedCards() {
    const selectedCardObjects = cards.value.filter((card) => selectedCards.value.some(selected => selected.id === card.id))
    selectedCards.value = []

    emit('addCards', selectedCardObjects)
}

function clearSelectedCards() {
    selectedCards.value = []
}

function closeModal() {
    selectedCards.value = []
    showAllCardsDialog.value = false
}
</script>

<template>
    <q-dialog
        v-model="showAllCardsDialog"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
    >
        <q-card class="flex column">
            <q-card-section class="flex justify-between items-center q-py-md bg-grey-1">
                <div class="flex column">
                    <div class="text-h6 text-grey-9 text-weight-medium">
                        {{ props.typeList === 'my' ? 'Meus Cartões' : 'Todos os Cartões' }}
                    </div>

                    <div class="text-body2 text-grey-8">
                        {{ selectedCards.length }} cartão(ões) selecionado(s)
                    </div>
                </div>

                <div class="flex q-gutter-sm">
                    <q-btn
                        icon="fa-solid fa-xmark"
                        flat
                        round
                        dense
                        size="sm"
                        color="grey-9"
                        @click="closeModal"
                    />
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="col q-pa-md">
                <div class="flex justify-end q-px-sm q-pt-xs q-mb-md q-gutter-md">
                    <q-btn
                        no-caps
                        dense
                        color="grey-9"
                        unelevated
                        :disable="selectedCards.length === 0"
                        @click="addSelectedCards"
                    >
                        <div class="flex items-center q-gutter-sm q-px-sm">
                            <span class="text-weight-medium">Adicionar</span>
                            <i class="fa-solid fa-circle-plus fa-md" />
                        </div>
                    </q-btn>

                    <q-btn
                        no-caps
                        dense
                        color="negative"
                        unelevated
                        :disable="selectedCards.length === 0"
                        @click="clearSelectedCards"
                    >
                        <div class="flex items-center q-gutter-sm q-px-sm">
                            <i class="fa-solid fa-trash fa-sm" />

                            <span class="text-weight-medium">Limpar todos</span>
                        </div>
                    </q-btn>

                    <q-btn
                        v-if="props.typeList === 'my'"
                        no-caps
                        dense
                        color="grey-9"
                        unelevated
                        @click="router.push({ name: 'private.cards' })"
                    >
                        <div class="flex items-center q-gutter-sm q-px-sm">
                            <span class="text-weight-medium">Incluir cartões em minha lista</span>

                            <i class="fa-solid fa-square-poll-horizontal fa-md" />
                        </div>
                    </q-btn>
                </div>

                <div
                    v-if="cards?.length && props.typeList === 'all'"
                    class="flex justify-end q-px-sm q-pt-xs"
                >
                    <BasicPaginator
                        :load-fn="loadCards"
                        :current-page="currentPage"
                        :has-more="hasMore"
                        :is-loading="isLoading"
                    />
                </div>

                <div
                    v-if="cards?.length"
                    class="flex justify-start q-px-sm q-mb-md"
                >
                    <span
                        style="font-size: 12px;"
                        class="text-weight-medium text-grey-9"
                    >
                        Clique na carta para selecionar *
                    </span>
                </div>

                <div
                    v-if="isLoading && cards.length === 0"
                    class="flex justify-center q-py-xl"
                >
                    <q-spinner-dots
                        size="50px"
                        color="grey-9"
                    />
                </div>

                <div
                    v-else-if="cards.length === 0 && !isLoading"
                    class="text-center q-py-xl"
                >
                    <div class="text-h6 text-grey-6 q-mb-md">
                        <i class="fa-solid fa-inbox fa-2x"></i>
                    </div>

                    <div class="text-body1 text-grey-6">
                        Nenhum cartão encontrado
                    </div>
                </div>

                <div v-else>
                    <div class="row q-col-gutter-md">
                        <div
                            v-for="card in cards"
                            :key="card.id"
                            class="relative-position"
                            :class="[cards.length > 4 ? 'col-12 col-sm-6 col-md-4 col-lg-3' : 'col']"
                        >
                            <div
                                v-if="isCardSelected(card.id)"
                                class="absolute-top-right"
                                style="z-index: 1; right: -10px;"
                            >
                                <q-icon
                                    name="fa-solid fa-check"
                                    size="xs"
                                    class="bg-white q-pa-xs shadow-2"
                                    style="border-radius: 50%;"
                                />
                            </div>

                            <CardImage
                                :card="card"
                                :is-card-selected="isCardSelected"
                                :is-clickable="true"
                                :selected-cards="selectedCards"
                                :show-view-button="false"
                                @add-card="addCard"
                                @remove-card="removeCard"
                            />
                        </div>
                    </div>
                </div>

                <div
                    v-if="cards?.length && props.typeList === 'all'"
                    class="flex justify-end q-px-sm q-py-lg"
                >
                    <BasicPaginator
                        :load-fn="loadCards"
                        :current-page="currentPage"
                        :has-more="hasMore"
                        :is-loading="isLoading"
                    />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>