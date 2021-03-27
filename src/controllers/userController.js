export const getLogin = (req, res) => {
    console.log("getLogin");
}

export const getUser = (req, res) => {
    
}

export const postLogin = (req, res) => {
    console.log("postLogin");
}


// signin or signup 에 따라 token이 전달되는 obj가 다른듯.
export const getToken = (req, res, next) => {
    if(true) {
        // signin
        const { accessToken, user } = req.session.passport.user;
        console.log(user.name);
        res.cookie('userName', user.name, { expiresIn: '1d'});
        // res.clearCookie('token');
        return res.redirect(`http://localhost:3000/${accessToken}/#`);

    } else {
        //signup
        // const token = req.authInfo;
    }
}