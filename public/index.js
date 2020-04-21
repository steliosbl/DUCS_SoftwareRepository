/**
 * Valid Author format
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

    initializeListeners () {
        this.element.addEventListener('submit', e => {
            e.preventDefault();
            e.stopPropagation();
            if (this.element.checkValidity()) {
                this.submitHandler(e);
            }

            this.element.classList.add('was-validated');
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
        this.innerElements.nameInput.value = '';
        this.innerElements.emailInput.setAttribute('readonly', '');
        this.innerElements.nameInput.setAttribute('required', '');
        this.innerElements.nameContainer.classList.remove('d-none');
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
        if (r) {
            this.Form.requestName();
        }

        this.registration = r;
    }

    handleFormSubmission () {
        const email = this.Form.Email;
        const name = this.Form.Name;

        // If the user has already been prompted to register
        if (this.Registration) {
            // and registration handler exists
            if (this.registrationHandler) {
                // Invoke it
                this.registrationHandler(email, name);
                this.hide();
            } else {
                // Otherwise the programmer has forgotten to pass one to the modal
                throw new Error('There is no registrationHandler to invoke. Have you called LoginModal.withRegistrationHandler?');
            }
            // If the user has not been prompted to register
        } else {
            // and login handler exists
            if (this.loginHandler) {
                // and the login was successful
                if (this.loginHandler(email)) {
                    // Close the modal
                    this.hide();
                } else {
                    // Otherwise, prompt the user to register
                    this.Registration = true;
                }
            } else {
                // Otherwise the programmer has forgotten to pass one to the modal
                throw new Error('There is no loginHandler to invoke. Have you called LoginModal.withLoginHandler?');
            }
        }
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
            this.innerElements.userName.classList.add('logged_in');
        } else {
            this.innerElements.userName.innerText = 'Stranger';
            this.innerElements.userName.classList.remove('logged_in');
        }
    }
}

class CardList {
    constructor (element) {
        this.element = element;
        this.cards = [];
    }

    static fromDefaultElement () {
        return new CardList(document.getElementById('card_container'));
    }

    withDefaultCardPrototype () {
        this.cardPrototype = document.getElementById('card_proto');
        return this;
    }

    displayCardsFromData (data) {
        this.clearAllCards();
        data.forEach(item => this.addCard(item));
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
            email: null,
            name: null
        };
        this.Api = new Api();
        this.ListData = [];
        this.components = {
            searchBar: SearchBar
                .fromDefaultElement()
                .withSearchHandler(this.performSearch.bind(this)) // Must bind the handler to the App class
                .initializeListeners(),

            cardList: CardList
                .fromDefaultElement()
                .withDefaultCardPrototype(),

            userButton: UserButton
                .fromDefaultElement()
                .withClickHandler(this.userButtonClickHandler.bind(this)),

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
            this.performSearch();
        }
    }

    get IsLoggedIn () {
        return Boolean(this.currentUser.email);
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

    displayData () {
        this.components.cardList.displayCardsFromData(this.ListData);
    }

    performSearch () {
        const value = this.components.searchBar.Value;

        this.HasSearched = true;
        window.history.pushState({
            hasSearched: true
        }, 'Search Results', '/search?q=' + value);
        this.ListData = this.Api.searchPrograms(value);
        this.displayData();
    }

    login (email) {
        if (this.Api.authorExists(email)) {
            const user = this.Api.getAuthor(email);
            if (user) {
                this.CurrentUser = user;
                return true;
            }

            throw new Error('Failed to log in');
        }

        return false;
    }

    register (email, name) {
        if (!this.Api.authorExists(email)) {
            if (this.Api.register(email, name)) {
                this.login(email);
            } else {
                throw new Error('Failed to register user');
            }
        } else {
            throw new Error('User already exists. Why were they prompted to register?');
        }
    }

    userButtonClickHandler () {
        if (!this.IsLoggedIn) {
            this.components.loginModal.show();
        }
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

    searchPrograms (searchTerms) {
        return listData;
    }

    authorExists (email) {
        return email === 'real@test.com';
    }

    getAuthor (email) {
        return {
            email: 'real@test.com',
            name: 'testy testerson'
        };
    }

    register (email, name) {
        return true;
    }
}

const app = new App();
app.ListData = listData;
app.initialize();
// app.displayData();
