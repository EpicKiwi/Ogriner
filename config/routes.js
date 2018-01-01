exports['default'] = {
  routes: (api) => {
    return {

      /* ---------------------
      routes.js

      For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
      If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.

      Learn more here: http://www.actionherojs.com/docs/#routes

      examples:

      get: [
        { path: '/users', action: 'usersList' }, // (GET) /api/users
        { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
      ],

      post: [
        { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
      ],

      all: [
        { path: '/user/:userID', action: 'user', matchTrailingPathParts: true } // (*) /api/user/123, api/user/123/stuff
      ]

      ---------------------- */

      get: [
          {path: "/users", action: "userList"},
          {path: "/users/me", action: "selfUser"},
          {path: "/users/:id", action: "oneUser"},
          {path: "/accounts", action: "selfAccounts"},
          {path: "/accounts/all", action: "allAccounts"},
          {path: "/accounts/:id", action: "getOneAccount"},
          {path: "/accounts/:id/update", action: "forceUpdateOneAccount"}
      ],

      post: [
          {path: "/users", action: "addUser"},
          {path: "/auth", action: "authenticate"},
          {path: "/accounts", action: "createOneAccount"}
      ],

      delete: [
          {path: "/users/:id", action: "deleteUser"},
          {path: "/accounts/:id", action: "deleteOneAccount"}
      ]

    }
  }
}
