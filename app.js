import express from 'express';
import morgan from 'morgan';
import expressLayouts from 'express-ejs-layouts';
import {
    validationResult
} from 'express-validator';

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
        contacts
    });
});

app.post('/contact', contact.validation, (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('contact/create', {
            title: 'Create Contact',
            errors: errors.array(),
            old: req.body
        });
    } else {
        contact.storeContact(req.body);
        res.redirect('/contact');
    }
});

app.get('/contact/create', (req, res) => {

    res.render('contact/create', {
        title: 'Create Contact',
    });
});

app.get('/contact/:name', (req, res) => {
    res.render('contact/detail', {
        title: 'Contact',
        contact: contact.findContact(req.params.name)
    });
});

app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        layout: false
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});