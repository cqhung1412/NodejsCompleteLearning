module.exports = (req, res, next) => {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) {
        req.flash('error', 'Log in first, dude :D')
        return res.redirect('/login');
    }
    next();
};