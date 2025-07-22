<script setup lang="ts">
import type { EssentialLinkProps } from '@/types/mainTypes'


withDefaults(defineProps<EssentialLinkProps>(), {
	title: '',
	link: '',
	icon: '',
})
</script>

<template>
	<q-item
		clickable
		tag="a"
		target="_blank"
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