import User, { register } from '../models/user';

export function renderRegister(req, res) {
    res.render('users/register');
}

export async function register(req, res, next) {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

export function renderLogin(req, res) {
    res.render('users/login');
}

export function login(req, res) {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

export function logout(req, res) {
    req.logout();
    // req.session.destroy();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}