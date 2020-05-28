import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Dashboard from '@/components/Dashboard.vue'
import Summary from '@/components/Summary.vue'
import Setting from '@/components/Setting.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import RegistrationComplete from '@/components/RegistrationComplete.vue'
import EmailVerified from '@/components/EmailVerified.vue'
import Feedback from '@/components/Feedback.vue'
import Terms from '@/components/Terms.vue'
import PrivacyPolicy from '@/components/PrivacyPolicy.vue'
import WhatsNext from '@/components/WhatsNext.vue'
import Quiz from '@/components/Quiz.vue'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    { path: '/',            name: "home",        component: Home,        meta: { guest: true } },
    { path: "/login",       name: "login",       component: Login,       meta: { guest: true, title: 'Login' } },
    { path: "/register",    name: "register",    component: Register,    meta: { guest: true, title: 'Create your account' } },
    { path: "/Quiz",        name: "quiz",        component: Quiz,        meta: { guest: true, title: 'Take up the challenge' } },
    { path: "/terms",       name: "terms",       component: Terms,       meta: { guest: true, title: 'Terms and Condition' } },

    { path: "/summary",     name: "summary",     component: Summary,     meta: { requiresAuth: true } },
    { path: "/dashboard",   name: "dashboard",   component: Dashboard,   meta: { requiresAuth: true, title: 'Dashboard' } },
    { path: "/setting",     name: "setting",     component: Setting,     meta: { requiresAuth: true } },
    { path: "/feedback",    name: "feedback",    component: Feedback,    meta: { requiresAuth: true } },
    { path: "/whatsnext",   name: "whatsnext",   component: WhatsNext,   meta: { requiresAuth: true } },

    { path: "/privacy-policy",         name: "privacy-policy",         component: PrivacyPolicy,        meta: { guest: true, title: 'Privacy Policy' } },
    { path: "/email-verified",         name: "email-verified",         component: EmailVerified,        meta: { guest: true, title: 'Email Verified' } },
    { path: "/reset-password",         name: "reset-password",         component: ResetPassword,        meta: { guest: true, title: 'Reset Your Password' } },
    { path: "/forgot-password",        name: "forgot-password",        component: ForgotPassword,       meta: { guest: true, title: 'Forgot Password' } },
    { path: "/registeration-complete", name: "registeration-complete", component: RegistrationComplete, meta: { guest: true, title: 'Registration Complete' } },
  ]
})

router.beforeEach((to, from, next) => {
    if(to.meta.title == null) { document.title = "finsey. A Budget Planning Application" }
    else { document.title = "finsey. " + to.meta.title; }

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
            next({ name: 'dashboard'})
        }
    } else {
        next() 
    }
})

export default router
