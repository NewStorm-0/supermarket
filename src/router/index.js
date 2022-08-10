import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../views/UserLogin.vue'
import NotFound from "../views/NotFound.vue"
import UserHome from "../views/UserHome.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user/login',
      name: 'UserLogin',
      component: UserLogin
    },
    {
      path: '/user/:account/home',
      name: "UserHome",
      component: UserHome
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

export default router
