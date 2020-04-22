
const listData = [{
    id: '4VIduloKlR9_7lPETevPV',
    name: 'program_1',
    description: 'test program',
    author: {
        id: 'test@example.com',
        name: 'Test Testerson'
    },
    creationDate: new Date(Date.now()),
    modificationDate: new Date(Date.now())
},
{
    id: 'va9reMQt4nb5JuKOzofjx',
    name: 'program_2',
    description: 'test program',
    author: {
        id: 'test@example.com',
        name: 'Test Testerson'
    },
    creationDate: new Date(Date.now()),
    modificationDate: new Date(Date.now())
}
];

export default class Api {
    constructor (address) {
        if (address) {
            this.Address = address;
        } else {
            this.Address = 'http://127.0.0.1:8000';
        }
    }

    async searchPrograms (searchTerms) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return listData;
    }

    async getAuthor (id) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return id === 'real@test.com' ? {
            id: 'real@test.com',
            name: 'testy testerson',
            registrationDate: 'a date',
            loginDate: 'today'
        } : false;
    }

    async editAuthor (id, name) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: id,
            name: name,
            registrationDate: 'another date',
            loginDate: 'today'
        };
    }

    async register (id, name) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }
};
