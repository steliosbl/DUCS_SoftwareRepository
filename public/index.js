/**
 * Valid Author/User format
 * @typedef {Object} Author
 * @property {string} id The unique Id of the Author (should be their email)
 * @property {string} name The Author's name
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

class RuntimeError extends Error {
    constructor (message) {
        super(message);
        this.Display = true;
    }
}

const listData = [{
        id: 'aaaaaa',
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
        id: 'bbbbb',
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

class LoadingSpinner {
    constructor (element) {
        this.element = element;
    }

    static fromParent (parent) {
        return new LoadingSpinner(parent.querySelector('[data-loading]'));
    }

    show () {
        this.element.classList.remove('d-none');
    }

    hide () {
        this.element.classList.add('d-none');
    }
}
class SearchBar {
    constructor (element) {
        this.element = element;
        this.initialized = false;
        this.Active = false;
        this.innerElements = {
            searchButton: this.element.querySelector('[data-button-search]'),
            newButton: this.element.querySelector('[data-button-new]'),
            searchBox: this.element.querySelector('[data-input-search]'),
            spacer: this.element.querySelector('[data-spacer]'),
            buttons: this.element.querySelector('[data-container-buttons]')
        };
    }

    static fromDefaultElement () {
        return new SearchBar(document.getElementById('search_bar'));
    }

    withSearchHandler (handler) {
        if (!this.initialized) {
            this.searchHandler = handler;
            return this;
        }

        throw new Error('Cannot add search handler now. The component has already been initialized');
    }

    withNewHandler (handler) {
        if (!this.initialized) {
            this.newHandler = handler;
            return this;
        }

        throw new Error('Cannot add new handler now. The component has already been initialized');
    }

    get Active () {
        return this.active;
    }

    set Active (a) {
        this.active = a;
        this.onActiveChanged();
    }

    get Value () {
        return this.innerElements.searchBox.value;
    }

    set Value (v) {
        this.innerElements.searchBox.value = v;
    }

    onActiveChanged () {
        if (this.Active) {
            this.element.classList.remove('vertical-center');
            this.innerElements.spacer.classList.add('d-none');
            this.innerElements.buttons.classList.remove('mx-auto', 'pt-4');
            this.innerElements.buttons.classList.add('input-group-append', 'ml-2');
            this.innerElements.searchBox.classList.remove('rounded');
        }
    }

    initializeListeners () {
        this.innerElements.searchBox.addEventListener('keyup', e => {
            if (e.keyCode === 13) {
                e.preventDefault();
                this.Active = true;
                this.searchHandler(e);
            }
        });

        this.innerElements.searchButton.onclick = e => {
            e.preventDefault();
            this.Active = true;
            this.searchHandler(e);
        };

        this.innerElements.newButton.onclick = e => {
            e.preventDefault();
            this.newHandler(e);
        };

        this.initialized = true;
        return this;
    }
}

class Form {
    constructor (element) {
        this.element = element;
        this.initialized = false;
    }

    static fromElement (e) {
        return new Form(e);
    }

    static fromElementId (id) {
        return new Form(document.getElementById(id));
    }

    get PassesValidation () {
        return this.element.checkValidity();
    }

    get DisplayValidation () {
        return this.element.classList.contains('was-validated');
    }

    set DisplayValidation (v) {
        if (v) {
            this.element.classList.add('was-validated');
        } else {
            this.element.classList.remove('was-validated');
        }
    }

    initializeListeners () {
        this.element.addEventListener('submit', e => {
            e.preventDefault();
            e.stopPropagation();
            if (this.element.checkValidity()) {
                this.submitHandler(e);
            }

            this.DisplayValidation = true;
        });

        this.initialized = true;
        return this;
    }

    withSubmitHandler (handler) {
        if (!this.initialized) {
            this.submitHandler = handler;
            return this;
        }

        throw new Error('Cannot add submit handler now. The form has already been initialized');
    }

    reset () {
        this.element.reset();
        this.DisplayValidation = false;
        return this;
    }
}

class LoginForm extends Form {
    constructor (element) {
        super(element);
        this.innerElements = {
            nameContainer: this.element.querySelector('[data-name-container]'),
            emailInput: this.element.querySelector('[data-input="email"]'),
            nameInput: this.element.querySelector('[data-input="name"]')
        };
    }

    static fromDefaultElement () {
        return new LoginForm(document.getElementById('login_form'));
    }

    get Email () {
        return this.innerElements.emailInput.value;
    }

    get Name () {
        return this.innerElements.nameInput.value;
    }

    requestName () {
        this.DisplayValidation = false;
        this.innerElements.emailInput.setAttribute('readonly', '');
        this.innerElements.nameInput.setAttribute('required', '');
        this.innerElements.nameContainer.classList.remove('d-none');
        return this;
    }

    reset () {
        super.reset();
        this.innerElements.emailInput.removeAttribute('readonly');
        this.innerElements.nameInput.removeAttribute('required');
        this.innerElements.nameContainer.classList.add('d-none');
        return this;
    }
}

class Modal {
    constructor (element) {
        this.element = element;
        this.Visible = false;
    }

    static fromElement (element) {
        return new Modal(element);
    }

    static fromElementId (id) {
        return new Modal(document.getElementById(id));
    }

    withSubmitHandler (handler) {
        this.submitHandler = handler;
        return this;
    }

    initializeListeners () {
        this.element.querySelector('.modal-footer .btn-primary').onclick(e => {
            this.submitHandler(e);
        });
        return this;
    }

    modal (args) {
        // Evil JQuery but it wouldn't work otherwise
        return $(this.element).modal(args);
    }

    show () {
        this.modal('show');
        return this;
    }

    hide () {
        this.modal('hide');
        this.element.querySelectorAll('form')
            .forEach(form => form.reset());
        return this;
    }

    get Visible () {
        return this.element === document.activeElement;
    }

    set Visible (v) {
        if (v) {
            this.show();
        } else {
            this.hide();
        }
    }
}

class LoginModal extends Modal {
    constructor (element) {
        super(element);
        this.Registration = false;
        this.Loading = LoadingSpinner
            .fromParent(this.element);
        this.Form = LoginForm
            .fromDefaultElement()
            .withSubmitHandler(this.handleFormSubmission.bind(this))
            .initializeListeners();
    }

    static fromDefaultElement () {
        return new LoginModal(document.getElementById('login_modal'));
    }

    withLoginHandler (handler) {
        this.loginHandler = handler;
        return this;
    }

    withRegistrationHandler (handler) {
        this.registrationHandler = handler;
        return this;
    }

    get Registration () {
        return this.registration;
    }

    set Registration (r) {
        this.registration = r;
        this.onRegistrationChange();
    }

    handleFormSubmission () {
        this.Loading.show();
        const promise = this.Registration
            ? this.register()
            : this.login();

        promise
            .catch(err => {
                this.hide();
                throw err;
            }).finally(() => {
                this.Loading.hide();
            });
    }

    register () {
        if (this.registrationHandler) {
            return this.registrationHandler(this.Form.email, this.Form.name)
                .then(() => {
                    this.reset();
                });
        } else {
            throw new Error('There is no registrationHandler to invoke. Have you called LoginModal.withRegistrationHandler?');
        }
    }

    login () {
        if (this.loginHandler) {
            return this.loginHandler(this.Form.Email)
                .then(res => {
                    if (res) {
                        this.reset();
                    } else {
                        this.Registration = true;
                    }
                });
        } else {
            throw new Error('There is no loginHandler to invoke. Have you called LoginModal.withLoginHandler?');
        }
    }

    onRegistrationChange () {
        if (this.Registration) {
            this.Form.requestName();
        }
    }

    reset () {
        this.hide();
        this.Registration = false;
        this.Form.reset();
    }
}

class UserButton {
    constructor (element) {
        this.element = element;
        this.innerElements = {
            userName: this.element.querySelector('[data-user-name]')
        };
    }

    static fromDefaultElement () {
        return new UserButton(document.getElementById('user_button'));
    }

    withClickHandler (handler) {
        this.element.addEventListener('click', handler);
        return this;
    }

    get Name () {
        return this.innerElements.userName.innerText;
    }

    set Name (n) {
        if (n) {
            this.innerElements.userName.innerText = n;
            this.innerElements.userName.classList.add('text-success');
        } else {
            this.innerElements.userName.innerText = 'Stranger';
            this.innerElements.userName.classList.remove('text-success');
        }
    }
}

class CardList {
    constructor (element) {
        this.element = element;
        this.Loading = LoadingSpinner
            .fromParent(this.element);

        this.cards = [];
    }

    static fromDefaultElement () {
        return new CardList(document.getElementById('card_container'));
    }

    withDefaultCardPrototype () {
        this.cardPrototype = document.getElementById('card_proto');
        return this;
    }

    async display (dataPromise) {
        this.clearAllCards();
        this.Loading.show();
        dataPromise.then(data => {
            data.forEach(item => this.addCard(item));
        }).finally(() => {
            this.Loading.hide();
        });

        return this;
    }

    clearAllCards () {
        this.cards.forEach(card => this.removeCard(card));
    }

    removeCard (card) {
        this.element.removeChild(card.element);
    }

    addCard (data) {
        if (this.cardPrototype) {
            const newCard = Card
                .fromPrototype(this.cardPrototype)
                .withData(data)
                .build()
                .appendTo(this.element)
                .show();

            this.cards.push(newCard);
        } else {
            throw new Error('Cannot add new card. No card prototype exists. Have you called withCardPrototype?');
        }
    }
}

class Card {
    constructor (element) {
        this.element = element;
        this.innerElements = {
            title: this.element.querySelector('.data-title'),
            description: this.element.querySelector('.data-description'),
            author: this.element.querySelector('.data-author'),
            modificationDate: this.element.querySelector('.data-modification-date'),
            creationDate: this.element.querySelector('.data-creation-date')
        };
    }

    static fromPrototype (proto) {
        const clone = proto.cloneNode(true);
        clone.removeAttribute('id');
        return new Card(clone);
    }

    withData (d) {
        this.data = d;

        return this;
    }

    build () {
        if (!this.element) {
            throw new Error('Tried to build card without a corresponding DOM element. Have you called fromPrototype?');
        }
        if (!this.data) {
            throw new Error('Tried to build card without data to put in it. Have you called withData?');
        }

        this.innerElements.title.innerText = this.data.name;
        this.innerElements.description.innerText = this.data.description;
        this.innerElements.author.innerText = this.data.author.name;
        this.innerElements.modificationDate.innerText = this.data.modificationDate;
        this.innerElements.creationDate.innerText = this.data.creationDate;
        return this;
    }

    appendTo (elem) {
        elem.appendChild(this.element);
        return this;
    }

    get Element () {
        return this.element;
    }

    show () {
        this.element.classList.remove('d-none');
        return this;
    }
};

class App {
    constructor () {
        this.currentUser = {
            id: null,
            name: null
        };
        this.ListData = [];
        this.Api = new Api();
        this.components = {
            searchBar: SearchBar
                .fromDefaultElement()
                .withSearchHandler(this.search.bind(this)) // Must bind the handler to the App class
                .initializeListeners(),

            cardList: CardList
                .fromDefaultElement()
                .withDefaultCardPrototype(),

            userButton: UserButton
                .fromDefaultElement()
                .withClickHandler(this.handleUserButtonClick.bind(this)),

            loginModal: LoginModal
                .fromDefaultElement()
                .withLoginHandler(this.login.bind(this))
                .withRegistrationHandler(this.register.bind(this))
        };
        this.stateFromUrl();
    }

    stateFromUrl () {
        const urlParams = new URLSearchParams(window.location.search);

        if (window.location.pathname === '/search') {
            const searchValue = urlParams.get('q');
            this.components.searchBar.Active = true;
            this.components.searchBar.Value = searchValue;
            this.search();
        }
    }

    get IsLoggedIn () {
        return Boolean(this.currentUser.id);
    }

    get HasSearched () {
        return this.hasSearched;
    }

    set HasSearched (h) {
        this.hasSearched = h;
    }

    get CurrentUser () {
        return this.currentUser;
    }

    set CurrentUser (c) {
        this.currentUser = c;
        this.onCurrentUserChanged();
    }

    get ListData () {
        return this.listData;
    }

    set ListData (l) {
        this.listData = l;
    }

    initialize () {

    }

    onCurrentUserChanged () {
        this.components.userButton.Name = this.CurrentUser.name;
    }

    search () {
        const value = this.components.searchBar.Value;

        this.HasSearched = true;
        window.history.pushState({
            hasSearched: true
        }, 'Search Results', '/search?q=' + value);

        const dataPromise = this.Api.searchPrograms(value);

        this.components.cardList.display(dataPromise);
    }

    login (id) {
        return this.Api.getAuthor(id).then(user => {
            if (user) {
                this.CurrentUser = user;
                return true;
            }

            return false;
        });
    }

    register (id, name) {
        return this.Api.register(id, name).then(async () => {
            await this.login(id);
        });
    }

    handleUserButtonClick () {
        if (!this.IsLoggedIn) {
            this.components.loginModal.show();
        }
    }

    handleRuntimeError (msg) {

    }
}

class Api {
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
            name: 'testy testerson'
        } : false;
    }

    async register (id, name) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }
}

const app = new App();
app.ListData = listData;
app.initialize();
// app.displayData();
