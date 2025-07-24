<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { BasicLinkProps } from '@/types/mainTypes'
import BasicLink from 'components/BasicLink.vue'

import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const router = useRouter()
const leftDrawerOpen = ref(false)
const linksList: BasicLinkProps[] = [
	{
		title: 'Cartões',
		icon: 'fa-solid fa-square-poll-horizontal',
		link: '/cartoes'
	},
	{
		title: 'Solicitações de troca',
		icon: 'fa-solid fa-arrow-right-arrow-left',
		link: '/solicitacoes-de-troca'
	},
	{
		title: 'Perfil',
		icon: 'fa-solid fa-user',
		link: 'https://quasar.dev'
	},
]


/* Functions */
function toggleLeftDrawer() {
	leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>


<template>
	<q-layout view="lHh Lpr lFf">
		<q-header class="bg-grey-10">
			<q-toolbar>
				<q-btn
					flat
					dense
					round
					icon="fa-solid fa-bars"
					size="sm"
					@click="toggleLeftDrawer"
				/>

				<q-toolbar-title>
					Desafio InMeta
				</q-toolbar-title>
			</q-toolbar>
		</q-header>

		<q-drawer
			v-model="leftDrawerOpen"
			show-if-above
			bordered
			class="bg-grey-9"
		>
			<div
				class="flex column"
				style="min-height: 100vh;"
			>
				<q-list>
					<q-item-label
						header
						class="text-white text-bold"
					>
						Desafio InMeta
					</q-item-label>

					<BasicLink
						v-for="(link, index) in linksList"
						:key="index"
						v-bind="link"
					/>
				</q-list>

				<q-list class="q-mt-auto">
					<q-item
						clickable
						tag="a"
						target="_blank"
						:href="'#'"
					>
						<q-item-section avatar>
							<q-icon
								:name="'fa-solid fa-arrow-right-from-bracket'"
								color="grey-4"
								size="xs"
							/>
						</q-item-section>

						<q-item-section>
							<q-item-label
								@click.prevent.stop="authStore.logout(); router.push({ name: 'guest.cards' })"
								class="text-grey-4"
							>
								Sair
							</q-item-label>
						</q-item-section>
					</q-item>
				</q-list>
			</div>
		</q-drawer>

		<q-page-container>
			<q-page class="row">
				<q-card
					flat
					bordered
					class="q-my-md q-mx-md"
					style="width: 100%; min-height: 500px; height: 100%;"
				>
					<router-view />
				</q-card>
			</q-page>
		</q-page-container>
	</q-layout>
</template>