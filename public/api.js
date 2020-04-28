/**
 * Valid Author/User format
 * @typedef {Object} Author
 * @property {string} id The unique Id of the Author (should be their email)
 * @property {string} name The Author's name
 * @property {date} registrationDate The date the Author was registered
 */
/**
 * Valid Program format
 * @typedef {Object} Program
 * @property {string} id The unique Id of the program
 * @property {string} name The name of the program
 * @property {string} description The description of the program
 * @property {Author} author The object representing the author if the program
 * @property {Date} creationDate The date the program was created on
 * @property {Date} modificationDate The date of the last time the program was modified
 */

const listData = [{
        id: '4VIduloKlR9_7lPETevPV',
        name: 'program_1',
        description: 'test program',
        author: {
            id: 'real@test.com',
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
            id: 'real@test.com',
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

    fetchWithDefaults (path, args = {}) {
        return fetch(this.Address + path, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                ...args
            })
            .then(res => {
                if (res.status === 400) {
                    this.errorHandler('API responded with 400 - Bad Request. Are you sure you are sending the correct content type?');
                    console.log(res.json());
                } else if (res.status === 422) {
                    this.errorHandler('API was unable to validate the request. Please check the data you have enterred');
                    console.log(res.json());
                } else if (res.status === 403) {
                    this.errorHandler('You do not have permission for this action');
                    console.log(res.json());
                }

                return res;
            })
            .catch(err => {
                if (err instanceof TypeError) {
                    this.errorHandler('Unable to reach API. Check the console for details');
                }
                throw err;
            });
    }

    withErrorHandler (handler) {
        this.errorHandler = handler;
        return this;
    }

    async searchPrograms (searchTerms) {
        const params = Object.keys(searchTerms)
            .map(key => key + '=' + searchTerms[key])
            .join('&');
        return this.fetchWithDefaults('/program?' + params)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 404) {
                    return false;
                }

                this.errorHandler('API sent invalid response. Check console for details');
                throw new Error(res.json());
            });
    }

    async getAuthor (id) {
        return this.fetchWithDefaults('/author/' + id)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else if (res.status === 404) {
                    return false;
                }

                this.errorHandler('API sent invalid response. Check console for details');
                throw new Error(res.json());
            });
    }

    async editAuthor (sessionId, data) {
        return this.fetchWithDefaults('/author/' + data.id, {
            method: 'PUT',
            body: JSON.stringify({
                sessionId: sessionId,
                name: data.name
            })
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            }

            this.errorHandler('Unable to modify profile');
            throw new Error(res.json());
        });
    }

    async createAuthor (id, name) {
        return this.fetchWithDefaults('/author', {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                name: name
            })
        }).then(res => {
            if (res.status === 201) {
                return res.json();
            } else if (res.status === 409) {
                this.errorHandler('The Id you attempted to register is already in use');
                throw new Error(res.json());
            }
        });
    }

    async editProgram (sessionId, program) {
        return this.fetchWithDefaults('/program?id=' + program.id, {
            method: 'PUT',
            body: JSON.stringify({
                sessionId: sessionId,
                title: program.title,
                description: program.description,
                authorId: program.authorId
            })
        }).then(res => {
            if (res.status === 200) {
                return res.json().then(json => {
                    if (program.image) {
                        this.uploadImage(json.id, program.image);
                    }
                    return json;
                });
            } else if (res.status === 424) {
                this.errorHandler('Failed to create new program: The authorId you submitted does not exist');
                throw new Error(res.json());
            } else {
                this.errorHandler('API sent invalid response. Check console for details');
                throw new Error(res.json());
            }
        });
    }

    async createProgram (sessionId, program) {
        return this.fetchWithDefaults('/program', {
            method: 'POST',
            body: JSON.stringify({
                sessionId: sessionId,
                title: program.title,
                description: program.description
            })
        }).then(res => {
            if (res.status === 201) {
                return res.json().then(json => {
                    if (program.image) {
                        this.uploadImage(json.id, program.image);
                    }
                    return json;
                });
            } else if (res.status === 424) {
                this.errorHandler('Failed to create new program: The authorId you submitted does not exist');
                throw new Error(res.json());
            } else {
                this.errorHandler('API sent invalid response. Check console for details');
                throw new Error(res.json());
            }
        });
    }

    async deleteProgram (sessionId, id) {
        return this.fetchWithDefaults('/program?id=' + id, {
            method: 'DELETE',
            body: JSON.stringify({
                sessionId: sessionId
            })
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            }
        });
    }

    async uploadImage (id, image) {
        const fd = new FormData();
        fd.append('image', image);
        return fetch(this.Address + '/image/' + id, {
            method: 'POST',
            body: fd
        }).then(imgRes => {
            if (imgRes.status !== 200) {
                this.errorHandler('Failed to upload image');
                console.log(imgRes.json());
            }
        });
    }
};
