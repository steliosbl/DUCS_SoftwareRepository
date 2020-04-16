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
    constructor () {
        this.Active = false;
        this.innerElements = {
            searchButton: document.getElementById('search_button'),
            newButton: document.getElementById('new_button'),
            searchBox: document.getElementById('search_box'),
            spacer: document.getElementById('search_bar_spacer'),
            buttons: document.getElementById('search_bar_buttons')
        };

        this.initializeListeners();
    }

    static fromDefaultElement () {
        const searchBar = new SearchBar(false);
        searchBar.element = document.getElementById('search_bar');
        return searchBar;
    }

    static fromElement (element) {
        const searchBar = new SearchBar(false);
        searchBar.element = element;
        return searchBar;
    }

    withSearchHandler (handler) {
        this.searchHandler = handler;
        return this;
    }

    withNewHandler (handler) {
        this.newHandler = handler;
        return this;
    }

    get Active () {
        return this.active;
    }

    set Active (a) {
        if (!this.active && a) {
            this.activate();
        }

        this.active = a;
    }

    get Value () {
        return this.innerElements.searchBox.value;
    }

    set Value (v) {
        this.innerElements.searchBox.value = v;
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

        return this;
    }

    activate () {
        this.element.classList.remove('vertical-center');
        this.innerElements.spacer.classList.add('d-none');
        this.innerElements.buttons.classList.remove('mx-auto', 'pt-4');
        this.innerElements.buttons.classList.add('input-group-append', 'ml-2');
        this.innerElements.searchBox.classList.remove('rounded');
    }
}

class App {
    constructor () {
        this.CurrentUser = {
            id: null,
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
                .withDefaultCardPrototype()
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
    }

    get ListData () {
        return this.listData;
    }

    set ListData (l) {
        this.listData = l;
    }

    initialize () {

    }

    displayData () {
        this.components.cardList.displayCardsFromData(this.ListData);
    }

    performSearch () {
        const value = this.components.searchBar.Value;

        this.HasSearched = true;
        window.history.pushState({
            hasSearched: true
        }, 'Search Results', '/search?q=' + value)
        this.ListData = this.Api.searchPrograms(value);
        this.displayData();
    }
}

class CardList {
    constructor () {
        this.cards = [];
    }

    static fromElement (element) {
        const cardList = new CardList();
        cardList.element = element;
        return cardList;
    }

    static fromDefaultElement () {
        const cardList = new CardList();
        cardList.element = document.getElementById('card_container');
        return cardList;
    }

    withCardPrototype (prototype) {
        this.cardPrototype = prototype;
        return this;
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
        // Create new card using given prototype and data
        // Then append it to the card-container
        // Finally, display it
        const newCard = Card
            .fromPrototype(this.cardPrototype)
            .withData(data)
            .build()
            .appendTo(this.element)
            .show();

        // Add the new card to the list of cards DOM element
        this.cards.push(newCard);
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
}

const app = new App();
app.ListData = listData;
app.initialize();
// app.displayData();
