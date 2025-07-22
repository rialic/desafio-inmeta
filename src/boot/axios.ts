import axios from 'axios'
import { Notify } from 'quasar'
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import type { ErrorData } from '@/types/axiosTypes'

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$axios: AxiosInstance
		$api: AxiosInstance
	}
}

const api = axios.create({
	baseURL: process.env.BASE_URL!,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use(
	function (config) {
		const token: string | null = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}

		return config
	},
	null
)

api.interceptors.response.use(
	function (response: AxiosResponse): AxiosResponse {
		const isSuccessStatus = response.status === 201 || response.status === 200
		const isMethodDiffGet = response.config.method !== 'get'
		const isSuccessStatusWithMessage = response.data?.message

		if (isMethodDiffGet && isSuccessStatus && isSuccessStatusWithMessage) {
			//   alertStore.value.setTypeAlert('success')
			//   alertStore.value.setMessage(response.data.message!)
		}

		return response
	},
	function (error: AxiosError<ErrorData>) {
		const { response } = error

		if (!response) {
			return error
		}

		if (response.status === 401) {
			localStorage.removeItem('token')
			window.location.href = '/login'
		}

		if (response.status === 500) {
			const message: string | undefined = response.data.message

			Notify.create({
				color: 'negative',
				message: message!,
				icon: 'fa-solid fa-exclamation-circle',
			})
		}

		return response
	}
)

export { api, axios }