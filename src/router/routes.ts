import type { RouteRecordRaw } from 'vue-router';
import CardsGalleryPage from '@/pages/CardsGalleryPage.vue'
import AuthPage from '@/pages/AuthPage.vue'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'guest.cards',
		component: CardsGalleryPage
	},
	{
		path: '/login',
		name: 'guest.auth',
		component: AuthPage
	},
	{
		path: '/home',
		name: 'private.home',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'private.cards',
				component: () => import('pages/CardListPage.vue'),
				meta: { requiresAuth: true }
			},
			{
				path: 'cards/:id',
				name: 'private.cards-form',
				component: () => import('src/pages/CardFormPage.vue'),
				props: (route) => ({ id: route.params.id }),
				meta: { requiresAuth: true }
			}
		],
		meta: { requiresAuth: true }
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	}
];

export default routes;
