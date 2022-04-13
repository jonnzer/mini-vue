import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../custom-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/about'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: 'a',
        name: 'homea',
        component: () => import(/* webpackChunkName: "home" */ '../views/home/homeA.vue')
      },
      {
        path: 'b',
        name: 'homeb',
        component: {}
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/other',
    name: 'other',
    component: () => import(/* webpackChunkName: "other" */ '../views/OtherView.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'hash'
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    next()
  }, 1000)
})

export default router
