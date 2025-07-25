<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import BasicPaginator from '@/components/BasicPaginator.vue'
import CardAddSeveralDialog from '@/components/Card/CardAddSeveralDialog.vue'
import CardImage from '@/components/Card/CardImage.vue'

import type { StoreMethod } from 'src/types/tradeCardTypes'
import type { Card } from '@/types/cardTypes'

import { useCardsStore } from '@/stores/cardsStore'

/* State */
const cardsStore = useCardsStore()

const router = useRouter()
const quasar = useQuasar()

const cards = ref<Array<Card>>([])
const currentPage = ref<number>(1)
const hasMore = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const selectedCards = ref<Array<{ id: string, name: string }>>([])
const typeList = ref<string>('my')
const typeFetch: Record<string, StoreMethod> = { my: 'myCards', all: 'index' }

const shownCardAddSeveralDialog = ref<boolean>(false)

/* Computed */
const selectedCardsText = computed(() => {
	const count = selectedCards.value.length

	if (count === 0) return '0 Item selecionado'
	if (count === 1) return '1 Item selecionado'

	return `${count} Itens selecionados`
})

/* onMounted */
onMounted(async () => {
	await loadCards(1)
})

/* Watch */
watch(typeList, async (newType: string) => {
	if (newType) {
		selectedCards.value = []
		await loadCards(1)
	}
})

/* Functions */
async function loadCards(page: number) {
	const method: StoreMethod = typeFetch[typeList.value]!
	isLoading.value = true
	cards.value = []

	try {
		const { status, data } = await cardsStore[method]({ page, rpp: method === 'myCards' ? 100 : 10 })

		if (status === 200 && data) {
			cards.value = data.list || data as Card[]
			currentPage.value = data.page
			hasMore.value = data.more
		}
	} catch (error) {
		cards.value = []
		hasMore.value = false

		console.error('Erro ao carregar cartões:', error)

		quasar.notify({
			color: 'negative',
			message: `Ops... ocorreu um erro ao carregar os cartões. ${String(error)}`,
			icon: 'fa-solid fa-exclamation-circle',
		})
	} finally {
		isLoading.value = false
	}
}

async function addCardToCollection(id: string | Array<string>) {
	isLoading.value = false

	try {
		const { status } = await cardsStore.store({ cardIds: !Array.isArray(id) ? [id] : id })

		if (status === 200) {
			quasar.notify({
				color: 'positive',
				message: 'Cartão adicionado à coleção com sucesso',
				icon: 'fa-solid fa-circle-check',
			})
		}
	} catch (error) {
		console.error('Erro ao adicionar cartão:', error)

		quasar.notify({
			color: 'negative',
			message: `Ops... ocorreu um erro ao adicionar o cartão. ${String(error)}`,
			icon: 'fa-solid fa-exclamation-circle',
		})
	} finally {
		selectedCards.value = []
		shownCardAddSeveralDialog.value = false
	}
}

function isCardSelected(cardId: string): boolean {
	return selectedCards.value.some(item => item.id === cardId)
}

function openSelectedCardsDialog() {
	if (selectedCards.value.length > 0) {
		shownCardAddSeveralDialog.value = true
	}
}
</script>

<template>
	<div class="flex items-center justify-between q-pa-md">
		<div class="text-h6 text-grey-9 text-weight-medium">
			Cartões
		</div>

		<div class="flex q-gutter-md">
			<q-btn
				v-if="typeList === 'all'"
				dense
				no-caps
				unelevated
				:ripple="false"
				color="grey-9 q-px-sm q-pt-xs"
				:label="selectedCardsText"
				@click="typeList === 'all' ? openSelectedCardsDialog() : router.push({ name: '' })"
			>
			</q-btn>
		</div>
	</div>

	<div class="flex justify-end q-px-md">
		<div class="q-gutter-md q-py-sm q-px-lg">
			<q-radio
				dense
				color="grey-9"
				size="xs"
				v-model="typeList"
				val="my"
				label="Meus cartões"
			/>

			<q-radio
				dense
				color="grey-9"
				size="xs"
				v-model="typeList"
				val="all"
				label="Todos cartões"
			/>
		</div>
	</div>

	<div class="flex justify-center q-px-md q-pt-none">
		<q-card-section class="q-pt-sm">
			<div
				v-if="cards?.length && typeList === 'all'"
				class="flex justify-end q-px-sm q-pt-xs q-mb-md"
			>
				<BasicPaginator
					:load-fn="loadCards"
					:current-page="currentPage"
					:has-more="hasMore"
					:is-loading="isLoading"
				/>
			</div>

			<div
				v-if="cards?.length && typeList === 'all'"
				class="flex justify-start q-px-sm q-mb-md"
			>
				<span
					style="font-size: 12px;"
					class="text-weight-medium text-grey-9"
				>
					Clique na carta para adicionar *
				</span>
			</div>

			<q-card
				flat
				class="q-px-sm"
			>
				<div
					v-if="isLoading && cards.length === 0"
					class="flex justify-center q-py-xl"
				>
					<q-spinner-dots
						size="50px"
						color="grey-9"
					/>
				</div>

				<div class="row q-col-gutter-md">
					<div
						v-for="card in cards"
						:key="card.id"
						class="relative-position"
						:class="[cards.length > 4 ? 'col-12 col-sm-6 col-md-4 col-lg-3' : 'col']"
					>
						<div
							v-if="isCardSelected(card.id)"
							class="absolute-top-right"
							style="z-index: 1; right: -10px;"
						>
							<q-icon
								name="fa-solid fa-check"
								size="xs"
								class="bg-white q-pa-xs shadow-2"
								style="border-radius: 50%;"
							/>
						</div>

						<CardImage
							:card="card"
							:is-clickable="typeList === 'all'"
							:selected-cards="selectedCards"
							:show-add-button="typeList === 'all'"
							:is-card-selected="isCardSelected"
							:add-fn="addCardToCollection"
							@add-card="(card) => selectedCards.push(card)"
							@remove-card="(index) => selectedCards.splice(index, 1)"
						/>
					</div>
				</div>
			</q-card>

			<div
				v-if="cards?.length && typeList === 'all'"
				class="flex justify-end q-px-sm q-pt-xs"
			>
				<BasicPaginator
					:load-fn="loadCards"
					:current-page="currentPage"
					:has-more="hasMore"
					:is-loading="isLoading"
				/>
			</div>
		</q-card-section>
	</div>

	<CardAddSeveralDialog
		v-model="shownCardAddSeveralDialog"
		:selected-cards="selectedCards"
		:add-fn="addCardToCollection"
		@remove-card="(index) => selectedCards.splice(index, 1)"
	/>
</template>