<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    id: string
    removeFn(selectedCard: string): Promise<void>
}>()

/* State */
const shownCardRemoveDialog = defineModel<boolean>({ default: false })

const isLoading = ref<boolean>(false)

/* Function */
async function removeCard() {
    isLoading.value = true

    await props.removeFn(props.id)

    isLoading.value = false
    shownCardRemoveDialog.value = false
}
</script>

<template>
    <q-dialog
        v-model="shownCardRemoveDialog"
        persistent
    >
        <q-card style="min-width: 500px;">
            <q-card-section class="flex justify-between q-py-sm">
                <div class="flex column">
                    <div class="text-h6 text-grey-9">Excluir?</div>

                    <div class="text-body2 text-grey-8">Id: {{ props.id }}</div>
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
                        Deseja realmente excluir o item selecionado?
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
                    :disable="isLoading"
                    @click="removeCard"
                >
                    <div class="flex items-center q-gutter-sm q-px-sm">
                        <i class="fa-solid fa-check fa-md" />

                        <div class="text-center">
                            <span class="text-weight-medium">
                                Sim
                            </span>
                        </div>
                    </div>
                </q-btn>

                <q-btn
                    no-caps
                    dense
                    color="grey-9"
                    unelevated
                    :disable="isLoading"
                    v-close-popup
                >
                    <div class="flex items-center q-gutter-sm q-px-sm">
                        <i class="fa-solid fa-xmark fa-md" />

                        <div class="text-center">
                            <span class="text-weight-medium">
                                Não
                            </span>
                        </div>
                    </div>
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
