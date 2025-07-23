import type { RouteRecordRaw } from 'vue-router'
import guestRoutes from '@/router/guest-routes'
import privateRoutes from '@/router/private-routes'

const routes: RouteRecordRaw[] = [
	...guestRoutes,
	...privateRoutes,
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	}
];

export default routes;
