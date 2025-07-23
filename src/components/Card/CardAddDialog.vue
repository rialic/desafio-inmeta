<script setup lang="ts">
import type { Card } from '@/types/cardTypes'

const props = defineProps<{
    isLoading: boolean
    selectedCard: Card | null
    addFn(selectedCard: string | Array<string>): Promise<void>
}>()

const shownCardAddDialog = defineModel<boolean>({ default: false })

/* Function */
async function addCardToCollection() {
    await props.addFn(props.selectedCard!.id)
    shownCardAddDialog.value = false
}
</script>

<template>
    <q-dialog
        v-model="shownCardAddDialog"
        persistent
    >
        <q-card style="min-width: 500px;">
            <q-card-section class="flex justify-between q-py-sm">
                <div class="flex column">
                    <div class="text-h6 text-grey-9">Adicionar à coleção?</div>

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
                <div class="flex justify-center">
                    <span class="text-body2">
                        Deseja adicionar o cartão <strong>{{ props.selectedCard!.name }}</strong> a sua coleção?
                    </span>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    no-caps
                    dense
                    color="grey-9"
                    unelevated
                    :disable="props.isLoading"
                    @click="addCardToCollection"
                >
                    <div class="flex items-center q-gutter-sm q-px-sm">
                        <div class="text-center">
                            <span class="text-weight-medium">
                                Sim
                            </span>
                        </div>

                        <i class="fa-solid fa-check fa-md" />
                    </div>
                </q-btn>

                <q-btn
                    no-caps
                    dense
                    color="grey-9"
                    unelevated
                    :disable="props.isLoading"
                    v-close-popup
                >
                    <div class="flex items-center q-gutter-sm q-px-sm">
                        <div class="text-center">
                            <span class="text-weight-medium">
                                Não
                            </span>
                        </div>

                        <i class="fa-solid fa-xmark fa-md" />
                    </div>
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
