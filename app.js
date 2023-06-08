import express from 'express';
import morgan from 'morgan';
import expressLayouts from 'express-ejs-layouts';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(morgan('dev'));

app.use((req, res, next) => {
    res.locals.currentRoute = req.path; // or req.originalUrl for the full URL
    next();
});

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
    });
});

app.get('/contact', (req, res) => {
    res.render('index', {
        title: 'Contact',
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