import express, {
    json
} from 'express';
import morgan from 'morgan';
import expressLayouts from 'express-ejs-layouts';
import {
    validationResult
} from 'express-validator';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';

import {
    path
} from './utils/path.js';
import {
    Contact
} from './utils/contacts.js';


const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

app.use(expressLayouts);
app.set('layout', 'layouts/main');


app.use(morgan('dev'));

//konfigurasi flash message
app.use(cookieParser('secret'));
app.use(session({
    cookie: {
        maxAge: 6000
    },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
// end konfigurasi flash message

const contact = new Contact();

app.use((req, res, next) => {
    // for nav active
    res.locals.currentRoute = req.path;
    next();
});

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page',
    });
});

app.get('/contact', (req, res) => {
    const contacts = contact.showContact();
    res.render('contact/index', {
        title: 'Contact',
        msg: req.flash('msg'),
        contacts
    });
});

app.post('/contact', contact.validationCreate, (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('contact/create', {
            title: 'Create Contact',
            errors: errors.array(),
            old: req.body
        });
    } else {
        contact.storeContact(req.body);
        req.flash('msg', 'Data contact successfully added!');
        res.redirect('/contact');
    }
});

app.get('/contact/create', (req, res) => {

    res.render('contact/create', {
        title: 'Create Contact',
    });
});

app.get('/contact/delete/:name', contact.deleteContact);

app.get('/contact/edit/:name', contact.editContact)

app.get('/contact/:name', (req, res) => {
    res.render('contact/detail', {
        title: 'Contact',
        contact: contact.findContact(req.params.name)
    });
});

app.post('/contact/update', contact.validationUpdate, contact.updateContact);

app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        layout: false
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});