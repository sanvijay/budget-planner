import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Dashboard from '@/components/Dashboard.vue'
import HelloWorld from '@/components/HelloWorld.vue'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    { path: '/',           name: "root",       component: HelloWorld },
    { path: "/login",      name: "login",      component: Login,     meta: { guest: true } },
    { path: "/register",   name: "register",   component: Register,  meta: { guest: true } },
    { path: "/dashboard",  name: "dashboard",  component: Dashboard, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('jwt') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            next()
        }
    } else if(to.matched.some(record => record.meta.guest)) {
        if(localStorage.getItem('jwt') == null) {
            next()
        }
        else {
            next({ name: 'home'})
        }
    } else {
        next() 
    }
})

export default router
