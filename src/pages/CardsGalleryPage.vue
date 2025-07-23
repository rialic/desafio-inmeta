<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format, parseISO } from 'date-fns'
import type { User, TradeCard, TradeCardRequests } from '@/types/cardsGalleryTypes'

import { useAuthStore } from '@/stores/authStore'
import { useTradeStore } from '@/stores/tradeStore'

const tradeStore = useTradeStore()
const authStore = useAuthStore()

const router = useRouter()
const tradeCardRequests = ref<Array<TradeCardRequests>>([])
const carouselSlides = ref<Record<string, number>>({})
const tradeTypes = new Map([['OFFERING', 'Oferecendo'], ['RECEIVING', 'Aceitando']])
const showTradeDialog = ref<boolean>(false)
const selectedTradeRequest = ref<TradeCardRequests | null>(null)

/* onMounted */
onMounted(async () => {
    const { status, data } = await tradeStore.index({ page: 1, rpp: 10 })

    if (status && status === 200) {
        tradeCardRequests.value = data.list
            .filter((tradeCardRequest: any) => tradeCardRequest.tradeCards.length)
            .map((tradeCardRequest: any) => {
                const tradeCards: TradeCard[] = tradeCardRequest.tradeCards.map((tradeCard: any) => presetTradeCards(tradeCard))
                carouselSlides.value[tradeCardRequest.id] = 0

                return {
                    id: tradeCardRequest.id,
                    user: {
                        id: tradeCardRequest.userId,
                        name: tradeCardRequest.user.name
                    } as User,
                    createdAt: tradeCardRequest.createdAt,
                    tradeCards
                } as TradeCardRequests
            })
    }
})

/* Functions */
function presetTradeCards(tradeCard: any): TradeCard {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, ...rest } = tradeCard.card

    return { ...rest, type: tradeCard.type }
}

function getToggleOptions(tradeCards: TradeCard[]) {
    const options = []
    const offeringIndex = tradeCards.findIndex(card => card.type === 'OFFERING')
    const receivingIndex = tradeCards.findIndex(card => card.type === 'RECEIVING')

    if (offeringIndex !== -1) {
        options.push({ label: String(tradeTypes.get('OFFERING')), value: offeringIndex })
    }

    if (receivingIndex !== -1) {
        options.push({ label: String(tradeTypes.get('RECEIVING')), value: receivingIndex })
    }

    return options
}

function openTradeDialog(request: TradeCardRequests) {
    showTradeDialog.value = true
    selectedTradeRequest.value = request
}

function truncateText(text: string, maxLength: number = 23): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
</script>

<template>
    <div
        class="flex items-center justify-center q-pa-lg"
        style="min-height: 100vh; background-color: #f5f5f5;"
    >
        <q-card
            flat
            bordered
            style="width: 100%; max-width: 1200px;"
        >
            <div class="flex justify-between q-pa-md">
                <div class="text-h5 text-grey-9 text-weight-medium">
                    Galeria de cartas
                </div>

                <div class="flex q-gutter-md">
                    <q-btn
                        v-if="!authStore.token"
                        dense
                        no-caps
                        unelevated
                        :ripple="false"
                        color="grey-9 q-px-sm"
                        @click="router.push({ name: 'guest.auth' })"
                    >
                        <div class="flex items-center q-gutter-sm">
                            <div class="text-center">
                                <span class="text-weight-medium">
                                    Login
                                </span>
                            </div>

                            <i class="fa-solid fa-arrow-right-to-bracket fa-md" />
                        </div>
                    </q-btn>

                    <q-btn
                        v-else
                        dense
                        no-caps
                        unelevated
                        :ripple="false"
                        color="grey-9 q-px-sm"
                        @click="router.push({ name: 'private.cards' })"
                    >
                        <div class="flex items-center q-gutter-sm">
                            <div class="text-center">
                                <span class="text-weight-medium">
                                    Área privada
                                </span>
                            </div>
                        </div>
                    </q-btn>
                </div>
            </div>

            <div class="flex column items-center q-gutter-sm q-mb-lg">
                <div class="text-h6 text-center text-grey-9 text-weight-medium">
                    Melhor site de trocas de cartas para completar seu deck
                </div>

                <div class="text-body2 text-center text-grey-7">
                    Descubra o prazer de trocar, colecionar e conectar-se com outros entusiastas. Aqui, cada carta tem
                    valor e cada troca conta uma história. Encontre exatamente o que procura e surpreenda-se com
                    descobertas inesperadas.
                </div>
            </div>

            <div class="row q-col-gutter-md q-pa-md">
                <div class="col-12 col-md-4">
                    <div class="flex column q-gutter-sm">
                        <div class="flex items-center">
                            <i class="fa-solid fa-magnifying-glass"></i>

                            <span class="q-ml-sm text-grey-9 text-weight-medium">Cartões verificados</span>
                        </div>

                        <small class="text-left text-grey-7">
                            Cada carta passa por nossa análise de autenticidade antes de entrar na plataforma,
                            garantimos que você sempre saiba exatamente o que está trocando.
                        </small>
                    </div>
                </div>

                <div class="col-12 col-md-4">
                    <div class="flex column q-gutter-sm">
                        <div class="flex items-center">
                            <i class="fa-solid fa-globe"></i>

                            <span class="q-ml-sm text-grey-9 text-weight-medium">Rede global de colecionadores</span>
                        </div>

                        <small class="text-left text-grey-7">
                            Conecte-se com milhares de entusiastas ao redor do mundo em busca das mesmas paixões. Nossa
                            comunidade ativa facilita encontros entre colecionadores com interesses complementares.
                        </small>
                    </div>
                </div>

                <div class="col-12 col-md-4">
                    <div class="flex column q-gutter-sm">
                        <div class="flex items-center">
                            <i class="fa-solid fa-lightbulb"></i>

                            <span class="q-ml-sm text-grey-9 text-weight-medium">Trocas inteligentes</span>
                        </div>

                        <small class="text-left text-grey-7">
                            Nosso algoritmo encontra automaticamente as melhores oportunidades de troca baseadas no seu
                            perfil e em saus pesquisa anteriores
                        </small>
                    </div>
                </div>
            </div>

            <q-card-section>
                <q-card
                    flat
                    bordered
                    class="q-pa-sm"
                    style="width: 100%; max-width: 1200px;"
                >
                    <div class="row q-col-gutter-md">
                        <div
                            class="col-12 col-sm-6 col-md-3"
                            v-for="request in tradeCardRequests"
                            :key="request.id"
                        >
                            <q-card
                                flat
                                bordered
                            >
                                <div class="q-px-md">
                                    <q-carousel
                                        v-model="carouselSlides[request.id]"
                                        animated
                                        transition-prev="slide-right"
                                        transition-next="slide-left"
                                        control-color="grey-10"
                                        padding
                                        height="300px"
                                        class="bg-grey-1"
                                    >
                                        <q-carousel-slide
                                            v-for="(card, index) in request.tradeCards"
                                            :key="card.id"
                                            :name="index"
                                            class="q-pa-none"
                                        >
                                            <div class="relative-position full-width full-height">
                                                <q-img
                                                    :src="card.imageUrl"
                                                    fit="contain"
                                                    class="full-width full-height"
                                                />
                                                <div
                                                    class="absolute-top-right q-pa-sm"
                                                    :class="card.type === 'OFFERING' ? 'bg-green-8' : 'bg-blue-8'"
                                                    style="opacity: 0.9; border-bottom-left-radius: 4px;"
                                                >
                                                    <span class="text-white text-weight-medium text-caption">
                                                        {{ tradeTypes.get(card.type) }}
                                                    </span>
                                                </div>
                                            </div>
                                        </q-carousel-slide>
                                    </q-carousel>

                                    <div class="row justify-center q-mt-sm">
                                        <q-btn-toggle
                                            v-model="carouselSlides[request.id]"
                                            no-caps
                                            unelevated
                                            toggle-color="grey-10"
                                            color="white"
                                            text-color="grey-10"
                                            :options="getToggleOptions(request.tradeCards)"
                                        />
                                    </div>
                                </div>

                                <q-card-section class="text-center">
                                    <div class="text-body2 q-mb-sm">
                                        <i class="fa-solid fa-user"></i>

                                        {{ truncateText(request.user.name) }}
                                    </div>

                                    <div class="text-body2 q-mb-sm">
                                        <i class="fa-solid fa-clock"></i>

                                        {{ format(parseISO(request.createdAt.slice(0, -1)), 'dd/MM/yyyy HH:mm') }}
                                    </div>

                                    <q-btn
                                        label="Visualizar"
                                        color="grey-10"
                                        class="full-width"
                                        style="max-width: 200px;"
                                        size="sm"
                                        unelevated
                                        @click="openTradeDialog(request)"
                                    />
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </q-card>
            </q-card-section>
        </q-card>

        <q-dialog
            v-model="showTradeDialog"
            persistent
        >
            <q-card style="min-width: 350px; max-width: 800px;">
                <q-card-section class="flex justify-between q-py-sm">
                    <div class="text-h6 text-grey-9">Troca de cartões</div>

                    <q-btn
                        icon="fa-solid fa-xmark"
                        flat
                        round
                        dense
                        size="sm"
                        color="grey-9"
                        v-close-popup
                    />
                </q-card-section>

                <q-card-section class="q-pb-sm q-pt-none">
                    <div class="text-subtitle2 text-grey-7">
                        Solicitação de troca de {{ selectedTradeRequest?.user.name }}
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-md">
                    <div class="row q-col-gutter-lg justify-center">
                        <div
                            v-for="card in selectedTradeRequest?.tradeCards"
                            :key="card.id"
                            class="col-12 col-sm-6"
                        >
                            <div class="flex column items-center q-gutter-sm">
                                <div class="relative-position">
                                    <q-img
                                        :src="card.imageUrl"
                                        :ratio="1"
                                        style="width: 250px; min-height: 350px; border-radius: 8px;"
                                        class="shadow-2"
                                    />

                                    <q-chip
                                        :color="card.type === 'OFFERING' ? 'green-8' : 'blue-8'"
                                        text-color="white"
                                        class="absolute-top-right"
                                        style="margin: 8px;"
                                    >
                                        {{ tradeTypes.get(card.type) }}
                                    </q-chip>
                                </div>

                                <div
                                    class="flex column text-center"
                                    style="max-width: 250px;"
                                >
                                    <div class="text-subtitle1 text-weight-medium">
                                        {{ card.name }}
                                    </div>
                                    <div class="text-body2 text-grey-7 q-mt-xs">
                                        {{ card.description }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn
                        no-caps
                        dense
                        label="Fechar"
                        color="grey-9"
                        unelevated
                        v-close-popup
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>