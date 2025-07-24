<script setup lang="ts">
import type { BasicPaginator } from '@/types/basicPaginatorTypes';

const props = withDefaults(defineProps<BasicPaginator>(), {
    isLoading: false
})

/* Functions */
async function goToPage(page: number) {
    if (page > 0) {
        await props.loadFn(page)
    }
}

async function previousPage() {
    if (props.currentPage > 1) {
        await goToPage(props.currentPage - 1)
    }
}

async function nextPage() {
    if (props.hasMore) {
        await goToPage(props.currentPage + 1)
    }
}
</script>

<template>
    <div class="flex q-gutter-sm items-center">
        <q-btn
            dense
            unelevated
            color="grey-9"
            size="sm"
            :disable="currentPage === 1 || isLoading"
            @click="previousPage"
        >
            <div class="flex items-center q-gutter-sm q-pa-sm">
                <i class="fa-solid fa-chevron-left fa-lg"></i>
            </div>
        </q-btn>

        <div class="text-body2 text-grey-9">
            Pág. {{ currentPage }}
        </div>

        <q-btn
            dense
            unelevated
            color="grey-9"
            size="sm"
            :disable="!hasMore || isLoading"
            @click="nextPage"
        >
            <div class="flex items-center q-gutter-sm q-pa-sm">
                <i class="fa-solid fa-chevron-right fa-lg"></i>
            </div>
        </q-btn>
    </div>
</template>