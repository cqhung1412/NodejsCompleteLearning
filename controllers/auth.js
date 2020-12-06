exports.getLogin = (req, res) => {
    // const isLoggedIn = req.get('Cookie')
    //     .split(';')[1]
    //     .trim()
    //     .split('=')[1];
    console.log(req.session);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuth: false
    });
};

exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    // validate
    // ...
    req.session.isLoggedIn = true;
    // res.setHeader('Set-Cookie', 'isLoggedIn=true');
    res.redirect('/');
};