<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { format, parseISO } from 'date-fns'
import BasicPaginator from '@/components/BasicPaginator.vue'
import { useQuasar } from 'quasar'
import type { Card } from '@/types/cardTypes'

import { useCardsStore } from '@/stores/cardsStore'

const cardsStore = useCardsStore()

const router = useRouter()
const quasar = useQuasar()
const cards = ref<Array<Card>>([])
const shownCardInfoDialog = ref<boolean>(false)
const shownCardAddDialog = ref<boolean>(false)
const shownSelectedCardsDialog = ref<boolean>(false)
const selectedCards = ref<Array<{ id: string, name: string }>>([])
const selectedCard = ref<Card | null>(null)
const typeList = ref<string>('my')

const currentPage = ref<number>(1)
const hasMore = ref<boolean>(false)
const isLoading = ref<boolean>(false)

/* Computed */
const selectedCardsText = computed(() => {
	const count = selectedCards.value.length
	if (count === 0) return '0 Item selecionado'
	if (count === 1) return '1 Item selecionado'
	return `${count} Itens selecionados`
})

const toggleCardSelectionStyle = computed(() => {
	return (card: any) => ({ border: isCardSelected(card.id) ? '2px solid currentColor' : undefined })
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
	isLoading.value = true
	cards.value = []
	const method = typeList.value === 'all' ? 'index' : 'myCards'

	try {
		const { status, data } = await cardsStore[method]({ page, rpp: 10 })

		if (status === 200 && data) {
			cards.value = data.list || data as Card[]
			currentPage.value = data.page
			hasMore.value = data.more
		}
	} catch (error) {
		console.error('Erro ao carregar cartões:', error)
		cards.value = []
		hasMore.value = false
	} finally {
		isLoading.value = false
	}
}

async function addToCollection(id: string | Array<string>) {
	try {
		const { status } = await cardsStore.store({ cardIds: !Array.isArray(id) ? [id] : id })

		if (status === 200) {
			selectedCard.value = null

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
		isLoading.value = false
		shownCardAddDialog.value = false
		shownSelectedCardsDialog.value = false
		selectedCards.value = []
	}
}

function toggleCardSelection(card: Card) {
	if (typeList.value !== 'all') return

	const existingIndex = selectedCards.value.findIndex(item => item.id === card.id)

	if (existingIndex > -1) {
		selectedCards.value.splice(existingIndex, 1)
	} else {
		selectedCards.value.push({ id: card.id, name: card.name })
	}
}

function isCardSelected(cardId: string): boolean {
	return selectedCards.value.some(item => item.id === cardId)
}

function openCardDialog(card: Card, typeDialog: string) {
	if (typeDialog === 'info') {
		shownCardInfoDialog.value = true
	}

	if (typeDialog === 'add') {
		shownCardAddDialog.value = true
	}

	selectedCard.value = card
}

function openSelectedCardsDialog() {
	if (selectedCards.value.length > 0) {
		shownSelectedCardsDialog.value = true
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

			<q-card
				flat
				class="q-px-sm"
			>
				<div class="row q-col-gutter-md">
					<div
						:class="[cards.length > 4 ? 'col-12 col-sm-6 col-md-4 col-lg-3' : 'col']"
						v-for="card in cards"
						:key="card.id"
						class="relative-position"
					>
						<div
							v-if="typeList === 'all' && isCardSelected(card.id)"
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

						<q-card
							flat
							bordered
							:style="toggleCardSelectionStyle(card)"
						>
							<div
								class="q-py-sm q-px-md"
								:class="{ 'cursor-pointer': typeList === 'all' }"
								@click="typeList === 'all' ? toggleCardSelection(card) : undefined"
							>
								<div
									class="relative-position"
									style="height: 300px;"
								>
									<q-img
										:src="card.imageUrl"
										fit="contain"
										class="full-width full-height bg-grey-1 rounded-borders"
									>
										<template v-slot:loading>
											<q-skeleton height="300px" />
										</template>
									</q-img>
								</div>
							</div>

							<q-card-section class="text-center">
								<div class="text-body2 q-mb-sm">
									<i class="fa-solid fa-user"></i>
									{{ card.name }}
								</div>

								<div class="text-body2 q-mb-sm">
									Criado em:
									{{ format(parseISO(card.createdAt.slice(0, -1)), 'dd/MM/yyyy HH:mm') }}
								</div>

								<div class="flex justify-center q-gutter-md">
									<q-btn
										v-if="typeList === 'all'"
										dense
										no-caps
										color="grey-9"
										unelevated
										@click="openCardDialog(card, 'add')"
									>
										<div class="flex items-center q-gutter-sm q-px-sm">
											<div class="text-center">
												<span class="text-weight-medium">
													Adicionar
												</span>
											</div>

											<i class="fa-solid fa-circle-plus fa-md" />
										</div>
									</q-btn>

									<q-btn
										dense
										no-caps
										color="grey-9"
										unelevated
										@click="router.push({ name: 'private.cards-form', params: { id: card.id } })"
									>
										<div class="flex items-center q-gutter-sm q-px-sm">
											<div class="text-center">
												<span class="text-weight-medium">
													Visualizar
												</span>
											</div>

											<i class="fa-regular fa-eye fa-sm" />
										</div>
									</q-btn>

									<q-btn
										dense
										no-caps
										color="grey-9"
										unelevated
										@click="openCardDialog(card, 'info')"
									>
										<div class="flex items-center q-px-sm">
											<i class="fa-solid fa-arrow-up-right-from-square fa-sm" />
										</div>
									</q-btn>
								</div>
							</q-card-section>
						</q-card>
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

	<q-dialog
		v-model="shownCardInfoDialog"
		persistent
	>
		<q-card style="min-width: 500px;">
			<q-card-section class="flex justify-between q-py-sm">
				<div class="flex column">
					<div class="text-h6 text-grey-9">Carta</div>

					<div class="text-body2 text-grey-8">Id: {{ selectedCard!.id }}</div>
				</div>

				<q-btn
					icon="fa-solid fa-xmark"
					flat
					round
					dense
					size="sm"
					color="grey-9"
					v-close-popup
				/>
			</q-card-section>

			<q-separator />

			<q-card-section class="q-pa-md">
				<div class="row q-col-gutter-lg justify-center">
					<div class="col-12 col-sm-6">
						<div class="flex column items-center q-gutter-sm">
							<div class="relative-position">
								<q-img
									:src="selectedCard!.imageUrl"
									:ratio="1"
									style="width: 250px; min-height: 350px; border-radius: 8px;"
									class="shadow-2"
								/>
							</div>

							<div
								class="flex column text-center"
								style="max-width: 250px;"
							>

								<div class="text-subtitle1 text-weight-medium">
									{{ selectedCard!.name }}
								</div>

								<div class="text-body2 text-grey-7 q-mt-xs">
									{{ selectedCard!.description }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</q-card-section>

			<q-separator />

			<q-card-actions align="right">
				<q-btn
					no-caps
					dense
					label="Fechar"
					color="grey-9"
					unelevated
					v-close-popup
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>

	<q-dialog
		v-model="shownCardAddDialog"
		persistent
	>
		<q-card style="min-width: 500px;">
			<q-card-section class="flex justify-between q-py-sm">
				<div class="flex column">
					<div class="text-h6 text-grey-9">Adicionar à coleção?</div>

					<div class="text-body2 text-grey-8">Id: {{ selectedCard!.id }}</div>
				</div>

				<q-btn
					icon="fa-solid fa-xmark"
					flat
					round
					dense
					size="sm"
					color="grey-9"
					v-close-popup
				/>
			</q-card-section>

			<q-separator />

			<q-card-section class="q-pa-md">
				<div class="flex justify-center">
					<span class="text-body2">
						Deseja adicionar o cartão <strong>{{ selectedCard!.name }}</strong> a sua coleção?
					</span>
				</div>
			</q-card-section>

			<q-separator />

			<q-card-actions align="right">
				<q-btn
					no-caps
					dense
					color="grey-9"
					unelevated
					:disable="isLoading"
					@click="addToCollection(selectedCard!.id)"
				>
					<div class="flex items-center q-gutter-sm q-px-sm">
						<div class="text-center">
							<span class="text-weight-medium">
								Sim
							</span>
						</div>

						<i class="fa-solid fa-check fa-md" />
					</div>
				</q-btn>

				<q-btn
					no-caps
					dense
					color="grey-9"
					unelevated
					:disable="isLoading"
					v-close-popup
				>
					<div class="flex items-center q-gutter-sm q-px-sm">
						<div class="text-center">
							<span class="text-weight-medium">
								Não
							</span>
						</div>

						<i class="fa-solid fa-xmark fa-md" />
					</div>
				</q-btn>
			</q-card-actions>
		</q-card>
	</q-dialog>

	<q-dialog
		v-model="shownSelectedCardsDialog"
		persistent
	>
		<q-card style="min-width: 600px;">
			<q-card-section class="flex justify-between q-py-sm">
				<div class="flex column">
					<div class="text-h6 text-grey-9">Cartões Selecionados</div>
					<div class="text-body2 text-grey-8">{{ selectedCards.length }} item(s) selecionado(s)</div>
				</div>

				<q-btn
					icon="fa-solid fa-xmark"
					flat
					round
					dense
					size="sm"
					color="grey-9"
					v-close-popup
				/>
			</q-card-section>

			<q-separator />

			<q-card-section
				class="q-pa-md"
				style="max-height: 400px;"
			>
				<q-scroll-area style="height: 300px;">
					<div
						v-if="selectedCards.length === 0"
						class="text-center text-grey-6"
					>
						Nenhum cartão selecionado
					</div>
					<div v-else>
						<div
							v-for="(card, index) in selectedCards"
							:key="card.id"
							class="flex items-center justify-between q-py-sm q-px-md bg-grey-1 rounded-borders q-mb-sm"
						>
							<div class="flex column">
								<div class="text-body1 text-weight-medium">{{ card.name }}</div>
								<div class="text-body2 text-grey-7">ID: {{ card.id }}</div>
							</div>

							<q-btn
								icon="fa-solid fa-trash"
								flat
								round
								dense
								size="sm"
								color="negative"
								@click="selectedCards.splice(index, 1)"
							/>
						</div>
					</div>
				</q-scroll-area>
			</q-card-section>

			<q-separator />

			<q-card-actions align="right">
				<q-btn
					no-caps
					dense
					color="grey-9"
					unelevated
					:disable="isLoading || selectedCards.length === 0"
					@click="addToCollection(selectedCards.map(card => card.id))"
				>
					<div class="flex items-center q-gutter-sm q-px-sm">
						<div class="text-center">
							<span class="text-weight-medium">
								Adicionar
							</span>
						</div>
						<i class="fa-solid fa-circle-plus fa-md" />
					</div>
				</q-btn>

				<q-btn
					no-caps
					dense
					label="Fechar"
					color="grey-9"
					unelevated
					:disable="isLoading"
					v-close-popup
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>