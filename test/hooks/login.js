"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hookType = require("../types/hook");
const hookMod = require("../modules/hook");
const userService = require("../services/user");
// That's a auth login demo
hookMod.addHook({
    hookFunc(request, reply) {
        if (request.query.email) {
            return userService.queryUserByEmail(request.query.email)
                .then((user) => {
                request.session.user = userService.getUserSession(user);
                reply.redirect(302, '/dashboard/');
            });
        }
        return userService.queryUserList({}, 1, 10, 'email')
            .then(([_count, content]) => {
            reply.redirect(302, `/auth-login/?email=${content[1].email}`);
        });
    },
    type: hookType.HookType.AUTH_LOGIN,
});
