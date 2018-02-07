<template>
    <div class="login-page page">
        <h2 class="login-title">Connectez-vous <span class="username-title" v-show="username">{{username}}</span> !</h2>
        <div class="login-form">
            <form @submit.prevent="login" >
                <div class="form-control">
                    <label for="username-input">Email</label>
                    <input type="email" id="username-input" name="username" :disabled="loggingIn" v-model="username"/>
                </div>
                <div class="form-control">
                    <label for="password-input">Mot de passe</label>
                    <input type="password" id="password-input" name="password" :disabled="loggingIn" v-model="password"/>
                </div>
                <div class="submit-bar">
                    <button class="button primary-button" :disabled="loggingIn">Se connecter</button>
                </div>
            </form>
        </div>
        <div class="login-form-error" v-show="formError">{{formError}}</div>
    </div>
</template>

<script>
    import UserStore from "../../stores/UserStore"

    export default {
        name: 'LoginPage',
        data(){return{
            formError: "",
            username: "",
            password: "",
            loggingIn: false,
            userStore: UserStore.state
        }},
        methods: {
            login(){
                if(!this.username || !this.password)
                    return;
                this.loggingIn = true
                this.$http.post(`/api/auth?email=${this.username}&password=${this.password}`)
                    .then((response) => {
                        this.userStore.user.id = response.body.token.userId
                        this.userStore.auth.expires = new Date(response.body.token.expires)
                        this.userStore.auth.token = response.body.token.token
                        this.$http.get("/api/users/me")
                            .then((response) => {
                                this.userStore.user.username = response.body.user.email
                                this.userStore.user.role = response.body.user.role
                                this.loggingIn = false;
                            }, (response) => {
                                this.showError(response.body.error)
                                this.loggingIn = false;
                            })
                    },(response) => {
                        this.showError(response.body.error)
                        this.loggingIn = false;
                    })
            },
            showError(message){
                console.error(message)
                this.formError = message;
            }
        }
    }
</script>

<style scoped>

    @import "../../styles/form.css";

    .login-page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .login-title {
        text-align: center;
        color: #e16428;
    }

    .login-form, .login-form-error {
        margin-top: 25px;
        padding: 20px;
        background-color: #272121;
        border-radius: 5px;
        width: 300px;
    }

    .login-form-error {
        background-color: #e13526;
        text-align: center;
    }

</style>
