module.exports = function(current_dir_name){
    var User = require(current_dir_name+'/db/models/user');

    var express = require('express');
    var app = express();

    var session = require('express-session');
    var bodyparser = require('body-parser');
    var cookieparser = require('cookie-parser');

    var jwt = require('jsonwebtoken');

    function createJWT(user_info){
        console.log('createJWT ->', user_info);
        let user = {
            user_id: user_info.user_id,
            username: user_info.username,
            admin: "hello this is admin"
        };

        let secret = "hellosecret";

        let sign = {
            expiresIn:'1h',
            issuer: 'localhost',
            subject: 'userinfo'
        }

        return jwt.sign(user, secret, sign);
    }

    function verifyJWT(token){
        console.log('verify jwt->', token);
        let secret = "hellosecret";
        try{
            jwt.verify(token, secret);
        }catch(e){
            console.log(e);
            return false;
        }

        return true;      
    }

    app.use(session({
        secret: 'mysecret',
        resave: false,
        saveUninitialized: true
    }));

    app.use('/static', express.static(current_dir_name+'/static'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(cookieparser());
    app.use(function errorHandler(err, req, res, next){
        console.log('we catch error handler');
        console.log(err);
    });
    app.use(function(req,res,next){
        if(req.path === '/login'){
            console.log('req.path -> ', req.path);
            next();

        }else{
            console.log('pre check auth?');
            console.log(req.cookies.mymymy);
            if(req.cookies.mymymy === undefined){
                console.log('mymymy is not founded');
                res.redirect('/login');
                
            }else{
                let flag = verifyJWT(req.cookies.mymymy);
                if(flag === false){
                    res.redirect('/login');
                }
                else{
                    next();
                }   
            }             
        }
    });


    app.post('/login', async function(req, res, next){
        console.log('post login call it');
        console.log('req body->',req.body);
        let user_id = req.body.user_id;
        let password = req.body.password;
        


        let request_user_info = {user_id: user_id};
        console.log('requesr_user_info ->', request_user_info);
        let result = await User.findOne(request_user_info);
        if(result === null){
            console.log('user not found error');
            res.json({result: "user not found error"});
        }else{
            console.log('user found');
            let jwt = await createJWT(result);
            
            sess = req.session;
            sess.user_id = user_id;
            res.cookie("mymymy", jwt);

            res.json(jwt);
        }
        
        //인증객체는 따로 만들어야 합니다. 지금은 세션으로 처리하게습니다.
        //TODO: 
        
    });

    return app;
}

