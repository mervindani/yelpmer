const User = require("../models/user");
module.exports.registerForm = (req, res) => {
    res.render("auths/register");
};
module.exports.register = async(req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash(
                "success",
                `Succesfully registered and is logged in as ${req.user.username}`
            );
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
};
module.exports.loginForm = (req, res) => {
    res.render("auths/login");
};
module.exports.login = (req, res) => {
    req.flash("success", `Welcome back to Yelp-Camp ${req.user.username}`);
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};
module.exports.logout = (req, res) => {
    req.flash("success", `Goodbye Come Back Soon ${req.user.username}`);
    req.logOut();
    res.redirect("/campgrounds");
};