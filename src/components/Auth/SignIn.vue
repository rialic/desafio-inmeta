<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { required, email } from '@/validators'
import type { SignInType } from '@/types/authTypes';
import type { AxiosResponse } from 'axios'

import { useAuthStore } from '@/stores/authStore'

const props = defineProps<{
    showSignUp: boolean
}>()

const emit = defineEmits<{
    (e: 'toggleSignUp', value: boolean): void
}>()

const authStore = useAuthStore()

const router = useRouter()
const hasSignInFormErrors = ref<boolean>(false)
const signInFormError = ref<string>()
const signInForm = ref<SignInType>({
    email: null,
    password: null
})

/* Functions */
async function signIn() {
    const { status, data }: AxiosResponse = await authStore.login({ email: signInForm.value.email, password: signInForm.value.password })

    if (status && status === 200) {
        void router.push({ name: 'private.cards' })
    }

    if (status && status === 500) {
        hasSignInFormErrors.value = true
        signInFormError.value = data.message
    }
}
</script>

<template>
    <div
        class="row"
        style="width: 100%; height: 100%;"
    >
        <div
            class="col-12 col-md-6 flex items-center justify-center"
            style="height: 600px;"
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

                <q-card
                    flat
                    bordered
                    class="q-pa-xl"
                >
                    <div class="text-center q-mb-md">
                        <div class="text-h6 text-grey-10 text-weight-medium">
                            Desafio InMeta
                        </div>
                    </div>

                    <div class="text-body2 text-center text-grey-7 q-mb-md">
                        Acesse o sistema com seu login e senha
                    </div>

                    <q-form @submit.prevent.stop="signIn">
                        <div class="flex column flex-items">
                            <q-input
                                ref="emailRef"
                                color="grey-10"
                                v-model="signInForm.email"
                                type="email"
                                outlined
                                dense
                                placeholder="Email"
                                class="q-mb-xs"
                                :error-message="signInFormError"
                                :error="hasSignInFormErrors"
                                :rules="[
                                    val => required(val, 'O campo email é obrigatório'),
                                    val => email(val)
                                ]"
                            />

                            <q-input
                                ref="nameRef"
                                color="grey-10"
                                v-model="signInForm.password"
                                type="password"
                                outlined
                                dense
                                placeholder="Senha"
                                class="q-mb-xs"
                                :rules="[
                                    val => required(val, 'O campo senha é obrigatório'),
                                ]"
                            />

                            <q-btn
                                type="submit"
                                color="grey-10"
                                label="Entrar"
                                dense
                                no-caps
                                :ripple="false"
                                class="text-weight-bold"
                                unelevated
                            />
                        </div>
                    </q-form>

                    <div class="flex justify-center">
                        <router-link
                            class="q-mt-md"
                            to=""
                            @click="emit('toggleSignUp', !props.showSignUp)"
                        >
                            Ainda não tem uma conta?
                        </router-link>
                    </div>
                </q-card>
            </div>
        </div>

        <div class="col-12 col-md-6 gt-sm flex items-center justify-center">
            <div
                class="full-width full-height flex items-center justify-center"
                style="background: linear-gradient(135deg, #b0bec5 0%, #263238 100%); height: 600px; border-radius: 0 0 0 350px;"
            >
                <q-card
                    flat
                    class="q-pa-xl text-center bg-white"
                    style="max-width: 350px; border-radius: 16px;"
                >
                    <div class="text-h6 text-grey-10 q-mb-md text-weight-bold">
                        Ainda não tem uma conta?
                    </div>

                    <div class="text-body2 text-grey-7 q-mb-lg">
                        Clique no botão abaixo para criar sua conta em nosso sistema
                    </div>

                    <q-btn
                        color="grey-10"
                        label="Cadastre-se"
                        no-caps
                        dense
                        class="q-px-xl q-py-sm text-weight-bold pulse-grey-10"
                        outline
                        :ripple="false"
                        @click="emit('toggleSignUp', !props.showSignUp)"
                    />
                </q-card>
            </div>
        </div>
    </div>
</template>
