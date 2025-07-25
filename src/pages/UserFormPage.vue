<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { notifyError } from '@/helpers'

import CardImage from '@/components/Card/CardImage.vue'

import type { User } from '@/types/userTypes'

import { useUserStore } from '@/stores/userStore'

/* State */
const userStore = useUserStore()

const user = ref<User>()

/* onMounted */
onMounted(async () => {
    try {
        const { status, data } = await userStore.me()

        if (status === 200 && data) {
            user.value = data as User
        }
    } catch (error) {
        console.error('Erro ao carregar cartão:', error)
        notifyError(`Erro ao carregar cartão ${String(error)}`)
    }
})
</script>

<template>
    <div class="flex items-center justify-between q-pa-md">
        <div class="text-h6 text-grey-9 text-weight-medium">
            Perfil
        </div>
    </div>

    <div class="flex full-width q-px-md q-pt-none">
        <q-card-section class="q-pt-sm full-width">
            <q-card
                flat
                class="q-px-sm"
            >
                <div
                    v-if="!user"
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
                    <div class="flex column q-gutter-md q-px-md">
                        <div class="full-width">
                            <div class="text-subtitle2 text-grey-7 q-mb-xs">ID</div>
                            <div class="text-body1 text-grey-9 q-mb-sm">{{ user.id }}</div>
                            <q-separator />
                        </div>

                        <div class="full-width">
                            <div class="text-subtitle2 text-grey-7 q-mb-xs">Nome</div>
                            <div class="text-body1 text-grey-9 q-mb-sm">{{ user.name }}</div>
                            <q-separator />
                        </div>

                        <div class="full-width">
                            <div class="text-subtitle2 text-grey-7 q-mb-xs">Email</div>
                            <div
                                class="text-body1 text-grey-9 q-mb-sm"
                                style="white-space: pre-line;"
                            >
                                {{ user.email }}
                            </div>
                            <q-separator />
                        </div>
                    </div>

                    <div class="text-body1 text-grey-9 text-weight-medium q-mt-md">
                        Meus cartões
                    </div>

                    <div class="row q-col-gutter-md q-mt-none">
                        <div
                            v-for="card in user.cards"
                            :key="card.id"
                            class="relative-position"
                            :class="[user.cards.length > 4 ? 'col-12 col-sm-6 col-md-4 col-lg-3' : 'col']"
                        >
                            <CardImage
                                :card="card"
                                :selected-cards="[]"
                            />
                        </div>
                    </div>
                </div>
            </q-card>
        </q-card-section>
    </div>
</template>
