<script setup lang="ts">
import { ref } from 'vue'

import SignIn from '@/components/Auth/SignIn.vue'
import SignUp from '@/components/Auth/SignUp.vue'

/* State */
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
                :show-sign-up="showSignUp"
                @toggle-sign-up="showSignUp = $event"
            />

            <SignUp
                v-else
                :show-sign-up="showSignUp"
                @toggle-sign-up="showSignUp = $event"
            />
        </q-card>
    </div>
</template>