import fs from 'fs';
import {
    path
} from './path.js';
import {
    body,
    check
} from 'express-validator';

export class Contact {

    validation = [
        body('name').custom((value) => {
            const contact = new Contact();
            const contacts = contact.showContact();
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
            const contact = new Contact();
            const contacts = contact.showContact();
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
}