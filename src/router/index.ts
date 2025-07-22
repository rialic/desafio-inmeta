import { defineRouter } from '#q-app/wrappers';
import {
	createMemoryHistory,
	createRouter,
	createWebHashHistory,
	createWebHistory,
} from 'vue-router';
import { useAuthStore } from '@/stores/authStore'
import routes from './routes'

export default defineRouter(function () {
	const authStore = useAuthStore()
	const createHistory = process.env.SERVER ? createMemoryHistory : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

	const Router = createRouter({
		scrollBehavior: () => ({ left: 0, top: 0 }),
		routes,

		// Leave this as is and make changes in quasar.conf.js instead!
		// quasar.conf.js -> build -> vueRouterMode
		// quasar.conf.js -> build -> publicPath
		history: createHistory(process.env.VUE_ROUTER_BASE),
	})

	Router.beforeEach((to, from, next) => {
		const authRoutes = ['guest.auth']
		const hasAnyAuthRouteTo = to.matched.some((route) => route.meta.requiresAuth)

		if (hasAnyAuthRouteTo) {
			if (!authStore.token) {
				return next({ name: 'guest.auth' })
			}
		}

		if (authRoutes.includes(String(to.name))) {
			if (authStore.token) {
				return next({ name: 'private.home' })
			}
		}

		next()
	})

	return Router
});
