import Store from "./Store";

class UserStore extends Store {

    constructor(){
        super()
        this.state = {
            user: {
                username: null,
                role: null,
                id: null
            },
            auth: {
                token: null,
                expiration: null,
            }
        }
    }

    isAuthenticated(){
        return !!this.state.auth.token
    }

}

export default new UserStore()