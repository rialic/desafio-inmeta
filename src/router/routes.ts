import type { RouteRecordRaw } from 'vue-router'
import guestRoutes from './guest-routes'
import privateRoutes from './private-routes'

export default [
	...guestRoutes,
	...privateRoutes,
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	}
] as RouteRecordRaw[]
