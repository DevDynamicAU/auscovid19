import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Australia = () => import('@/views/Australia')
const USA = () => import('@/views/USA')

Vue.use(Router)

export default new Router({
	mode: 'hash', // https://router.vuejs.org/api/#mode
	linkActiveClass: 'active',
	scrollBehavior: () => ({
		y: 0
	}),
	routes: configRoutes()
})

function configRoutes() {
	return [
		{
			path: '/',
			redirect: '/australia',
			name: 'Home',
			component: TheContainer,
			children: [
				{
					path: 'Australia',
					name: 'Australia',
					component: Australia
				},
				{
					path: 'USA',
					name: 'USA',
					component: USA
				}
			]
		}
	]
}