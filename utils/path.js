import fs from 'fs';
export const path = {
    dirData: './public/data/json',
    dirContacts: function () {
        return `${this.dirData}/contacts.json`;
    }
}

if (!fs.existsSync(path.dirData)) {
    fs.mkdirSync(path.dirData, {
        recursive: true
    });
}

if (!fs.existsSync(path.dirContacts())) {
    fs.writeFileSync(path.dirContacts(), JSON.stringify([]));
}