var keystone = require('keystone'),
	async = require('async'),
    path = require('path'),
    fs = require('fs');

exports = module.exports = function(req, res) {
	if (!req.user) {
		return res.redirect(req.cookies.target || '/');
	}
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'realestate';
	locals.formData = req.body || {};
	view.on('post', { action: 'Submit Advert' }, function(next) {
		async.series([
			
			function(cb) {
 				if (!req.body.heading || !req.body.description || !req.body.adType) {
					req.flash('error', 'Please enter title, description and type.');
					return cb(true);
				}
				return cb();
				
			},
			
			
			function(cb) {
                var fileRef = "";
                var fileRefalt="";
                if(req.files!=null){
                    fileRef =JSON.parse(JSON.stringify(req.files));
                    fileRefalt=JSON.parse(JSON.stringify(req.files));
                    fileRef.images.path = './upload/realestate/';
                    fileRef.images.originalname = req.files.images.originalname;
                    fileRef.images.filename = req.files.images.name;
                }
				var postData = {
					advertisor: locals.user.id,
					heading: req.body.heading,
					description:req.body.description,
                    adType:req.body.adType,
                    images:fileRef.images
				};
				var Post = keystone.list('Realestate').model,
					newPost = new Post(postData);
				Post.findOne().where('advertisor', locals.user.id).where('status', 'Open').exec(function(err, post) {

                    if(post == null){
                        if (fileRef !=""){imageUploadhelper(fileRefalt.images);}
                        newPost.save(function(err) {
                            console.log(err)
                            return cb(err);
                        });
                    }else{
                        req.flash('error', 'Thank you for trying to post. Looks like you already have an active request, please contact admin.');
                        res.redirect('/realestate');
                    }
    });
               
			
			}
			
		], function(err){
			if (err) return next();
			req.flash('success', 'Thank you for posting an advert. This would be listed in the Real Estate section.');
            res.redirect('/realestate');
			
		});
		
	});
	
	view.render('site/createrealestate');
	
}
function imageUploadhelper(fileobj){
    var tempPath =  fileobj.path,
        targetPath = path.resolve('./upload/realestate/'+fileobj.name),
        extension = '.'+fileobj.extension.toLowerCase();
    if (extension === '.png' || extension === '.jpg') {
        copyFile(tempPath,targetPath,function(err) {
            if (err){ console.log(err);return false;}
            console.log("Upload completed!");
        });
    } else {
        fs.unlink(tempPath, function (err) {
            if (err) console.log(err);
            console.error("Only .png & .jpg files are allowed!");
        })
                  
}}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}