exports.getLogin = (req, res) => {
    const isLoggedIn = req.get('Cookie')
        .split(';')[1]
        .trim()
        .split('=')[1];
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
    res.setHeader('Set-Cookie', 'isLoggedIn=true');
    res.redirect('/');
};