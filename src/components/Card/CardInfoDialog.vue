<script setup lang="ts">
import type { Card } from '@/types/cardTypes'

const props = defineProps<{
    selectedCard: Card | null
}>()

const shownCardInfoDialog = defineModel<boolean>({ default: false })
</script>

<template>
    <q-dialog
        v-model="shownCardInfoDialog"
        persistent
    >
        <q-card style="min-width: 500px;">
            <q-card-section class="flex justify-between q-py-sm">
                <div class="flex column">
                    <div class="text-h6 text-grey-9">Carta</div>

                    <div class="text-body2 text-grey-8">Id: {{ props.selectedCard!.id }}</div>
                </div>

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

            <q-separator />

            <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-lg justify-center">
                    <div class="col-12 col-sm-6">
                        <div class="flex column items-center q-gutter-sm">
                            <div class="relative-position">
                                <q-img
                                    :src="props.selectedCard!.imageUrl"
                                    :ratio="1"
                                    style="width: 250px; min-height: 350px; border-radius: 8px;"
                                    class="shadow-2"
                                />
                            </div>

                            <div
                                class="flex column text-center"
                                style="max-width: 250px;"
                            >

                                <div class="text-subtitle1 text-weight-medium">
                                    {{ props.selectedCard!.name }}
                                </div>

                                <div class="text-body2 text-grey-7 q-mt-xs">
                                    {{ props.selectedCard!.description }}
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
