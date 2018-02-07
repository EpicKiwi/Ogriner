<template>
    <div class="app">
        <div class="authenticated-frame main-frame" v-if="authenticated">
            <header class="main-header">
                <h1 class="app-name">{{appName}}</h1>
            </header>
            <div class="main-container">
                <section class="main-content">

                </section>
                <nav class="action-bar">

                </nav>
            </div>
        </div>
        <div class="login-frame main-frame" v-else><login-page></login-page></div>
    </div>
</template>

<script>
    import UserStore from "./stores/UserStore"
    import LoginPage from "./components/pages/LoginPage"

    export default {
        name: 'App',
        components: {LoginPage},
        data(){ return {
            appName: "Ogriner",
            userStore: UserStore.state
        }},
        computed: {
            authenticated(){
                return UserStore.isAuthenticated()
            }
        }
    }
</script>

<style scoped>
    @import "./styles/global.css";

    .app {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background-color: #363333;
    }

    .main-frame, .page{
        width: 100%;
        height: 100%;
    }

    .authenticated-frame {
        display: flex;
        flex-direction: column;
    }

    .main-header, .action-bar, .main-container {
        background-color: #272121;
    }

    .main-header {
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
    }

    .main-header .app-name {
        color: #e16428;
        margin: 0;
        flex: 1;
        font-weight: 500;
    }

    .action-bar {
        width: 50px;
        height: 100%;
    }
    .main-container {
        display: flex;
        flex-direction: row;
        flex: 1;
    }

    .main-content {
        flex: 1;
        border-radius: 5px 5px 0 0;
        background-color: #363333;
    }
</style>
