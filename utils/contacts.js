import fs from 'fs';
import {
    path
} from './path.js';
import {
    body,
    check,
    validationResult
} from 'express-validator';

export class Contact {

    validationCreate = [
        body('name').custom((value) => {
            const contacts = this.showContact();
            const isDuplicate = contacts.find((contact) => contact.name === value);
            if (value === '') {
                throw new Error('Name cannot be empty!');
            }

            if (isDuplicate) {
                throw new Error('Name already exist!');
            }
            return true;
        }),
        body('phone').custom((value) => {

            const contacts = this.showContact();
            const isDuplicate = contacts.find((contact) => contact.phone === value);

            if (value === '') {
                throw new Error('Phone number cannot be empty!');
            }

            if (isDuplicate) {
                throw new Error('Phone already exist, please use another phone number!');
            }
            return true;
        }),
        check('phone', 'Phone number must be valid!').optional({
            checkFalsy: true,
            nullable: true
        }).isMobilePhone('id-ID'),
        check('email', 'Fill the valid email!').optional({
            checkFalsy: true,
            nullable: true
        }).isEmail()
    ];

    validationUpdate = [
        body('name').custom((value, {
            req
        }) => {

            const contacts = this.showContact();
            const isDuplicate = contacts.find((contact) => contact.name === value);

            if (value === '') {
                throw new Error('Name cannot be empty!');
            }

            if (value !== req.body.oldName && isDuplicate) {
                throw new Error('Name already exist!');
            }
            return true;

        }),
        body('phone').custom((value, {
            req
        }) => {

            const contacts = this.showContact();
            const isDuplicate = contacts.find((contact) => contact.phone === value);

            if (value === '') {
                throw new Error('Phone number cannot be empty!');
            }

            if (value !== req.body.oldPhone && isDuplicate) {
                throw new Error('Phone already exist, please use another phone number!');
            }
            return true;
        }),
        check('phone', 'Phone number must be valid!').optional({
            checkFalsy: true,
            nullable: true
        }).isMobilePhone('id-ID'),
        check('email', 'Fill the valid email!').optional({
            checkFalsy: true,
            nullable: true
        }).isEmail()
    ]

    showContact = () => {
        const file = fs.readFileSync(path.dirContacts(), 'utf-8');
        const contacts = JSON.parse(file);
        return contacts;
    }

    storeContact = (contact) => {
        const contacts = this.showContact();
        contacts.push(contact);
        fs.writeFileSync(path.dirContacts(), JSON.stringify(contacts));
    }

    findContact = (name) => {
        const file = fs.readFileSync(path.dirContacts(), 'utf-8');
        const contacts = JSON.parse(file);

        const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
        return contact;
    }

    deleteContact = (req, res) => {
        const find = this.findContact(req.params.name);

        if (!find) {
            res.send(404)
            res.send('<h1>404 | Page Not Found</h1>')
        }

        const contacts = this.showContact();
        const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase() != req.params.name.toLowerCase())

        fs.writeFileSync(path.dirContacts(), JSON.stringify(filteredContacts))
        req.flash('msg', 'Data contact successfully deleted!')

        res.redirect('/contact')
    }

    editContact = (req, res) => {
        const contact = this.findContact(req.params.name);
        if (!contact) {
            res.send(404)
            res.send('<h1>404 | Page Not Found</h1>')
        }
        res.render('contact/edit', {
            title: 'Edit Contact',
            contact
        });
    }

    updateContact = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('contact/edit', {
                title: 'Edit Contact',
                errors: errors.array(),
                contact: req.body
            });
        } else {
            const contacts = this.showContact();
            const contactIndex = contacts.findIndex((contact) => contact.name.toLowerCase() === req.body.oldName.toLowerCase());

            delete req.body.oldName;
            delete req.body.oldPhone;

            contacts[contactIndex] = req.body;

            fs.writeFileSync(path.dirContacts(), JSON.stringify(contacts))
            req.flash('msg', 'Data contact successfully updated!')

            res.redirect('/contact')
        }
    }
}