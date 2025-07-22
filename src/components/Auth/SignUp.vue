<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosResponse } from 'axios'
import type { SignUpType } from '@/types/authTypes'
import { required, email } from '@/validators'
import { useQuasar } from 'quasar'

import { useAuthStore } from '@/stores/authStore'

const props = defineProps<{
    showSignUp: boolean
}>()

const emit = defineEmits<{
    (e: 'toggleSignUp', value: boolean): void
}>()

const authStore = useAuthStore()

const router = useRouter()
const quasar = useQuasar()
const signUpForm = ref<SignUpType>({
    name: null,
    email: null,
    password: null
})

/* Functions */
async function signUp() {
    const { status }: AxiosResponse = await authStore.register({ name: signUpForm.value.name, email: signUpForm.value.email, password: signUpForm.value.password })

    if (status && (status === 200 || status === 201)) {
        quasar.notify({
            color: 'positive',
            message: 'Cadastrado realizado com sucesso',
            icon: 'fa-solid fa-circle-check',
        })

        return emit('toggleSignUp', !props.showSignUp)
    }

    if (status && status === 500) {
        quasar.notify({
            color: 'negative',
            message: 'Ops... tivemos um erro ao realizar o seu cadastro, por favor tente mais tarde.',
            icon: 'fa-solid fa-exclamation-circle',
        })
    }
}
</script>

<template>
    <div
        class="row"
        style="width: 100%; height: 100%;"
    >
        <div
            class="col-12 flex items-center justify-center"
            style="min-height: 750px;"
        >
            <div class="flex column q-gutter-lg">
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
                                <q-icon name="fas fa-arrow-right-to-bracket" />

                                <div class="text-center">
                                    Login
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
                                <q-icon name="fas fa-square-poll-horizontal" />

                                <div class="text-center">
                                    Cartões
                                </div>
                            </div>
                        </q-btn>
                    </div>
                </q-card>

                <q-card
                    flat
                    bordered
                    class="q-pa-xl"
                    style="max-width: 350px;"
                >
                    <div class="text-center q-mb-lg">
                        <div class="text-h6 text-grey-10 text-weight-medium">
                            Cadastro Desafio InMeta
                        </div>
                    </div>

                    <div class="text-body2 text-center text-grey-7 q-mb-xl">
                        Preencha o formulário abaixo para ter uma conta em nosso sistema
                    </div>

                    <q-form @submit="signUp">
                        <div class="flex column flex-items">
                            <q-input
                                color="grey-10"
                                v-model="signUpForm.name"
                                type="text"
                                outlined
                                dense
                                placeholder="Nome"
                                class="q-mb-xs"
                                :rules="[
                                    val => required(val, 'O campo nome é obrigatório'),
                                ]"
                            />

                            <q-input
                                color="grey-10"
                                v-model="signUpForm.email"
                                type="email"
                                outlined
                                dense
                                placeholder="Email"
                                class="q-mb-xs"
                                :rules="[
                                    val => required(val, 'O campo email é obrigatório'),
                                    val => email(val)
                                ]"
                            />

                            <q-input
                                color="grey-10"
                                v-model="signUpForm.password"
                                type="password"
                                outlined
                                dense
                                placeholder="Senha"
                                class="q-mb-xs"
                                :rules="[
                                    val => required(val, 'O campo senha é obrigatório'),
                                ]"
                            />

                            <div
                                class="row"
                                style="width: 100%;"
                            >
                                <div class="col-auto">
                                    <q-btn
                                        type="button"
                                        color="grey-10"
                                        dense
                                        no-caps
                                        :ripple="false"
                                        class="text-weight-bold"
                                        unelevated
                                        style="width: 50px; height: 100%;"
                                        @click="emit('toggleSignUp', !props.showSignUp)"
                                    >
                                        <i class="fas fa-arrow-left"></i>
                                    </q-btn>
                                </div>

                                <div class="col q-ml-sm">
                                    <q-btn
                                        type="submit"
                                        color="grey-10"
                                        label="Salvar"
                                        dense
                                        no-caps
                                        :ripple="false"
                                        class="text-weight-bold full-width"
                                        unelevated
                                    />
                                </div>
                            </div>
                        </div>
                    </q-form>
                </q-card>
            </div>
        </div>
    </div>
</template>