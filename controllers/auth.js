exports.getLogin = (req, res) => {
    const { isLoggedIn } = req.session;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuth: isLoggedIn
    });
};

exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    // validate
    // ...
    req.session.isLoggedIn = true;
    res.redirect('/');
};