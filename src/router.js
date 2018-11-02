import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home'
import Form from './views/Form'
import Subtitle from './views/Subtitle'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    // base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/form',
            name: 'form',
            component: Form,
        },
        {
            path: '/subtitle',
            name: 'subtitle',
            component: Subtitle,
        },
    ]
})
