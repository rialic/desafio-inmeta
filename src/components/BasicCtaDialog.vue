<script setup lang="ts">
import type { CtaData } from '@/types/ctaDialogTypes';
import { ref } from 'vue'

const props = defineProps<CtaData>()

/* State */
const showCallToActionDialog = defineModel<boolean>({ default: false })

const isLoading = ref<boolean>(false)

/* Function */
async function callToAction() {
    isLoading.value = true

    await props.ctaFn(props.id)

    isLoading.value = false
    showCallToActionDialog.value = false
}
</script>

<template>
    <q-dialog
        v-model="showCallToActionDialog"
        persistent
    >
        <q-card style="min-width: 500px;">
            <q-card-section class="flex justify-between q-py-sm">
                <div class="flex column">
                    <div class="text-h6 text-grey-9">{{ props.title }}</div>

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
                        {{ message }}
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
                    @click="callToAction"
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
