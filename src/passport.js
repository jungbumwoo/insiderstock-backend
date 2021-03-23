import passport from "passport";
import FacebookStrategy from "passport-facebook";

passport.serializeUser(function(user, cb) {
    cb(null, user);
})

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
})

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        User.findOne({ email }, async function(err, user) {
            if (err) { return done(err); }
            if (user) {
                done(null, user);
            } else {
                user = new User({
                    facebook_id: profile.id,
                    name: profile.displayName
                });
                user.save(function(err) {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("saving user..");
                        done(null, user);
                    }
                })
            }
        });
    }
))
