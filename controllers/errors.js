exports.get404 = (req, res) => {
  const { isLoggedIn } = req.session;
  res.status(404).render('404', { 
      pageTitle: 'Page Not Found', 
      path: '/404',
      isAuth: isLoggedIn
  });
};