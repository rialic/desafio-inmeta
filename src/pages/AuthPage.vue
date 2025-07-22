<script setup lang="ts">
import { ref } from 'vue'
import SignIn from '@/components/Auth/SignIn.vue'
import SignUp from '@/components/Auth/SignUp.vue'

const showSignUp = ref<boolean>(false)
</script>

<template>
    <div
        class="flex items-center justify-center"
        style="min-height: 100vh;"
    >
        <q-card
            flat
            bordered
            style="width: 100%; max-width: 1200px;"
        >
            <SignIn
                v-if="!showSignUp"
                :showSignUp="showSignUp"
                @toggleSignUp="showSignUp = $event"
            />

            <SignUp
                v-else
                :showSignUp="showSignUp"
                @toggleSignUp="showSignUp = $event"
            />
        </q-card>
    </div>
</template>