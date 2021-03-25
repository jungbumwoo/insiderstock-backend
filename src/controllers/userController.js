export const getLogin = (req, res) => {
    console.log("getLogin");
}

export const postLogin = (req, res) => {
    console.log("postLogin");
}


// signin or signup 에 따라 token이 전달되는 obj가 다른듯.
export const getToken = (req, res, next) => {
    if(true) {
        // signin
        console.log("req.session at getToken Func.");
        console.log(req.session);
        const { accessToken } = req.session.passport.user;
        
        console.log(accessToken);
        console.log("req")
        console.log("getToken Func");
        return res.redirect(`localhost:3000/user/${accessToken}`)

    } else {
        //signup
        // const token = req.authInfo;
    }
}