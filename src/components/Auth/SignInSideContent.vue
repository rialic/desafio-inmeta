<script setup lang="ts">
const props = defineProps<{
    showSignUp: boolean
}>()

const emit = defineEmits<{
    (e: 'toggleSignUp', value: boolean): void
}>()
</script>

<template>
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
</template>