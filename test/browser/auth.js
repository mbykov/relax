var Relax = require('relax');
var relax = new Relax();

describe('AUTH', function(){

    describe('cookie authentication', function(){
        it('should log-in existing user', function(done){
            var user = {name: 'm.bykov@gmail.com', password: 'm.bykov@gmail.com'}
            relax.login(user.name, user.password, function(res) {
                log(res);
                done();
            });
        })
        it('should log-out current user', function(done){
            relax.logout(function(res) {
                log(res);
                done();
            });
        })
        it('should get session info of a current user', function(done){
            relax.session(function(res) {
                log(res);
                done();
            });
        })
    })

})
