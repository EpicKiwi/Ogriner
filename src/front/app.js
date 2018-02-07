import Vue from "vue"
import App from "./App"
import VueResource from "vue-resource"
import UserStore from "./stores/UserStore"

Vue.use(VueResource)

Vue.http.interceptors.push((request,next) => {

    if(UserStore.isAuthenticated()){
        request.headers.set("x-auth-token",UserStore.state.auth.token)
    }

    return next();
})

new Vue({
    el: "#app",
    render: h => h(App),
    http: {
        root: '/api',
        headers: {}
    }
})