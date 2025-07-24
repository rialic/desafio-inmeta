<script setup lang="ts">
import type { Card } from '@/types/cardTypes'

const props = defineProps<{
    selectedCard: Card
}>()

const showTradeCardDialog = defineModel<boolean>({ default: false })
const tradeTypes = new Map([['OFFERING', 'Oferecendo'], ['RECEIVING', 'Aceitando']])
</script>

<template>
    <q-dialog
        v-model="showTradeCardDialog"
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
                    Solicitação de troca de {{ props.selectedCard.name }}
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-lg justify-center">
                    <div
                        v-for="card in props.selectedCard.tradeCards"
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
</template>