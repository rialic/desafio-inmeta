<script setup lang="ts">
import type { BasicLinkProps } from '@/types/mainTypes'


withDefaults(defineProps<BasicLinkProps>(), {
	title: '',
	link: '',
	icon: '',
})
</script>

<template>
	<q-item
		clickable
		tag="a"
		:href="link"
	>
		<q-item-section
			v-if="icon"
			avatar
		>
			<q-icon
				:name="icon"
				color="grey-4"
				size="xs"
			/>
		</q-item-section>

		<q-item-section>
			<q-item-label class="text-grey-4">
				{{ title }}
			</q-item-label>
		</q-item-section>
	</q-item>
</template>