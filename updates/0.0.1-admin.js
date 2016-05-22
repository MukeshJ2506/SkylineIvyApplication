var keystone = require('keystone'),
    User = keystone.list('User');
 
exports = module.exports = function(done) {
    
    new User.model({
        name: { first: 'Mukesh', last: 'Jayaram' },
        email: 'mukesh.jayaram@gmail.com',
        password: 'admin',
        userRole: 'Admin',
        apartmentNo: '4F',
        towerName: 'Princeton'
    }).save(done);
    
};