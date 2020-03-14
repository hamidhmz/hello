'use strict';
const { UserController } = require('../../controllers');
const { userDetails } = UserController;
const { User } = require('../../models/user');
// eslint-disable-next-line no-undef
describe('userDetails', () => {
    it('should return response as user', async () => {
        const user = {
            _id: 12,
            username: 'hamidreza',
            email: 'a@a.com'
        };
        const req = {
            user: {
                _id: 12
            }
        };
        // const res = {
        //     userDetail: null,
        //     send(arg) {
        //         console.log(arg, ' has been sent');
        //         this.userDetail = arg;
        //     },
        //     status(statusCode) {
        //         console.log(statusCode, 'res send status code');
        //     }
        // };
        // User.findById = function(userId) {
        //     return {
        //         select(include) {
        //             return user;
        //         }
        //     };
        // };

        const res = { send: jest.fn() };
        User.findById = jest.fn().mockReturnValue({
            select(include) {
                return user;
            }
        });
        await userDetails(req, res);
        // expect(JSON.stringify(res.userDetail)).toBe(JSON.stringify(user));
        expect(res.send).toHaveBeenCalled();
    });
});
