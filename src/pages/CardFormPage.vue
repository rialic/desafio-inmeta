<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { notifyError } from '@/helpers'

import type { Card } from '@/types/cardTypes'

import { useCardsStore } from '@/stores/cardsStore'

const props = defineProps<{
    id: string
}>()

/* State */
const cardsStore = useCardsStore()

const router = useRouter()
const card = ref<Card>()

/* onMounted */
onMounted(async () => {
    if (props.id) {
        try {
            const { status, data } = await cardsStore.show(props.id)

            if (status === 200 && data) {
                card.value = data as Card
            }
        } catch (error) {
            console.error('Erro ao carregar cartão:', error)
            notifyError(`Erro ao carregar cartão ${String(error)}`)
        }
    }
})
</script>

<template>
    <div class="flex items-center justify-between q-pa-md">
        <div class="text-h6 text-grey-9 text-weight-medium">
            Cartão
        </div>

        <div class="flex q-gutter-md">
            <q-btn
                dense
                no-caps
                unelevated
                :ripple="false"
                color="grey-9 q-px-sm q-pt-xs"
                label="Voltar"
                @click="router.back()"
            >
            </q-btn>
        </div>
    </div>

    <div class="flex justify-center q-px-md q-pt-none">
        <q-card-section class="q-pt-sm">
            <q-card
                flat
                class="q-px-sm"
            >
                <div
                    v-if="!card"
                    class="flex justify-center q-pa-xl"
                >
                    <q-spinner-dots
                        size="50px"
                        color="grey-9"
                    />
                </div>

                <div
                    v-else
                    class="q-pa-md"
                >
                    <div class="flex justify-center q-mb-lg">
                        <q-img
                            :src="card.imageUrl"
                            :alt="card.name"
                            style="max-width: 300px; max-height: 400px;"
                            class="rounded-borders shadow-2"
                            fit="contain"
                        />
                    </div>

                    <div
                        class="row full-width q-gutter-md"
                        style="max-width: 1200px; width: 1200px;"
                    >
                        <div class="col-12">
                            <div class="text-subtitle2 text-grey-7 q-mb-xs">ID</div>
                            <div class="text-body1 text-grey-9 q-mb-sm">{{ card.id }}</div>
                            <q-separator />
                        </div>

                        <div class="col-12">
                            <div class="text-subtitle2 text-grey-7 q-mb-xs">Nome</div>
                            <div class="text-h6 text-grey-9 q-mb-sm">{{ card.name }}</div>
                            <q-separator />
                        </div>

                        <div class="col-12">
                            <div class="text-subtitle2 text-grey-7 q-mb-xs">Descrição</div>
                            <div
                                class="text-body1 text-grey-9 q-mb-sm"
                                style="white-space: pre-line;"
                            >
                                {{ card.description }}
                            </div>
                            <q-separator />
                        </div>

                        <div class="col-12">
                            <div class="text-subtitle2 text-grey-7 q-mb-xs">Data de Criação</div>
                            <div class="text-body1 text-grey-9">
                                {{ new Date(card.createdAt).toLocaleString('pt-BR') }}
                            </div>
                        </div>
                    </div>
                </div>
            </q-card>
        </q-card-section>
    </div>
</template>
