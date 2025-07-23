<script setup lang="ts">

const props = defineProps<{
    isLoading: boolean
    selectedCards: Array<{ id: string, name: string }>
    addFn(selectedCard: string | Array<string>): void
}>()

const emit = defineEmits<{
    (e: 'removeCard', value: number): void
}>()

const shownCardAddSeveralDialog = defineModel<boolean>({ default: false })
</script>

<template>
    <q-dialog
        v-model="shownCardAddSeveralDialog"
        persistent
    >
        <q-card style="min-width: 600px;">
            <q-card-section class="flex justify-between q-py-sm">
                <div class="flex column">
                    <div class="text-h6 text-grey-9">Cartões Selecionados</div>
                    <div class="text-body2 text-grey-8">{{ props.selectedCards.length }} item(s) selecionado(s)</div>
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

            <q-card-section
                class="q-pa-md"
                style="max-height: 400px;"
            >
                <q-scroll-area style="height: 300px;">
                    <div
                        v-if="props.selectedCards.length === 0"
                        class="text-center text-grey-6"
                    >
                        Nenhum cartão selecionado
                    </div>
                    <div v-else>
                        <div
                            v-for="(card, index) in selectedCards"
                            :key="card.id"
                            class="flex items-center justify-between q-py-sm q-px-md bg-grey-1 rounded-borders q-mb-sm"
                        >
                            <div class="flex column">
                                <div class="text-body1 text-weight-medium">{{ card.name }}</div>
                                <div class="text-body2 text-grey-7">ID: {{ card.id }}</div>
                            </div>

                            <q-btn
                                icon="fa-solid fa-trash"
                                flat
                                round
                                dense
                                size="sm"
                                color="negative"
                                @click="emit('removeCard', index)"
                            />
                        </div>
                    </div>
                </q-scroll-area>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    no-caps
                    dense
                    color="grey-9"
                    unelevated
                    :disable="isLoading || props.selectedCards.length === 0"
                    @click="props.addFn(props.selectedCards.map(card => card.id))"
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
                    no-caps
                    dense
                    label="Fechar"
                    color="grey-9"
                    unelevated
                    :disable="isLoading"
                    v-close-popup
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
