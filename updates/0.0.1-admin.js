var keystone = require('keystone'),
    User = keystone.list('User');
 
exports = module.exports = function(done) {
    
    new User.model({
        name: { first: 'Mukesh', last: 'Jayaram' },
        email: 'mukesh.jayaram@gmail.com',
        password: 'admin',
        userRole: 'Admin',
        apartmentNo: '4F',
        towerName: 'Princeton',
        isVerified:true,
        isAdmin:true,
        isAssociation:true,
        stayType:"Owner",
        mobileNo:8129377669
    },{
        name: { first: 'Ivy', last: 'Association' },
        email: 'ivyleagueownersassociation@gmail.com',
        password: 'admin',
        userRole: 'Admin',
        apartmentNo: '1A',
        towerName: 'Columbia',
        isVerified:true,
        isAdmin:true,
        isAssociation:true,
        stayType:"Owner",
        mobileNo:0000000000
    }).save(done);
    
};