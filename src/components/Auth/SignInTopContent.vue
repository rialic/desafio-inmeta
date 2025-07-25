<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
    showSignUp: boolean
}>()

const emit = defineEmits<{
    (e: 'toggleSignUp', value: boolean): void
}>()

/* State */
const router = useRouter()
</script>

<template>
    <q-card
        flat
        class="q-pa-sm"
    >

        <div class="flex justify-center q-gutter-md">
            <q-btn
                outline
                dense
                no-caps
                :ripple="false"
                color="grey-10"
                class="q-px-lg q-py-sm q-btn--outline-thicker"
                style="min-width: 100px;"
                @click="emit('toggleSignUp', !props.showSignUp)"
            >
                <div class="flex column items-center q-gutter-sm">
                    <q-icon name="fa-solid fa-user-plus" />

                    <div class="text-center">
                        Cadastro
                    </div>
                </div>
            </q-btn>

            <q-btn
                outline
                dense
                no-caps
                :ripple="false"
                color="grey-10"
                class="q-px-lg q-py-sm q-btn--outline-thicker"
                style="min-width: 100px;"
                @click="router.push({ name: 'guest.cards' })"
            >
                <div class="flex column items-center q-gutter-sm">
                    <q-icon name="fa-solid fa-square-poll-horizontal" />

                    <div class="text-center">
                        Cartões
                    </div>
                </div>
            </q-btn>
        </div>
    </q-card>
</template>
