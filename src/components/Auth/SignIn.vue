<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { required, email } from '@/validators'
import { notifyError } from '@/helpers'

import SignInTopContent from './SignInTopContent.vue'
import SignInSideContent from './SignInSideContent.vue'

import type { SignInType } from '@/types/authTypes'
import type { AxiosResponse } from 'axios'

import { useAuthStore } from '@/stores/authStore'

const props = defineProps<{
    showSignUp: boolean
}>()

const emit = defineEmits<{
    (e: 'toggleSignUp', value: boolean): void
}>()

/* State */
const authStore = useAuthStore()

const router = useRouter()
const isLoading = ref<boolean>(false)
const hasSignInFormErrors = ref<boolean>(false)
const signInFormError = ref<string>()
const signInForm = ref<SignInType>({
    email: null,
    password: null
})

/* Functions */
async function signIn() {
    isLoading.value = true

    try {
        const { status, data }: AxiosResponse = await authStore.login({ email: signInForm.value.email, password: signInForm.value.password })

        if (status && status === 200) {
            void router.push({ name: 'private.cards' })
            return
        }

        if (status && status === 500) {
            hasSignInFormErrors.value = true
            signInFormError.value = data.message
        }
    } catch (error) {
        console.error('Erro ao adicionar cartão:', error)
        notifyError(`Ops... ocorreu um erro ao acessar o sistema. ${String(error)}`)
    } finally {
        isLoading.value = false
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
                <SignInTopContent
                    :show-sign-up="props.showSignUp"
                    @toggle-sign-up="emit('toggleSignUp', $event)"
                />

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
                                :disable="isLoading"
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

        <SignInSideContent
            :show-sign-up="props.showSignUp"
            @toggle-sign-up="emit('toggleSignUp', $event)"
        />
    </div>
</template>
