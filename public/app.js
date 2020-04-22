import Api from './api.js';
import { SearchBar, UserButton, ProgramList } from './components/index.js';
import { ProfileModal, LoginModal } from './components/modals/index.js';

export default class App {
    constructor () {
        this.ListData = [];
        this.Api = new Api();
        this.components = {
            searchBar: SearchBar
                .fromDefaultElement()
                .withSearchHandler(this.search.bind(this)) // Must bind the handler to the App class
                .initializeListeners(),

            cardList: ProgramList
                .fromDefaultElement()
                .withDefaultCardPrototype(),

            userButton: UserButton
                .fromDefaultElement()
                .withClickHandler(this.handleUserButtonClick.bind(this)),

            loginModal: LoginModal
                .fromDefaultElement()
                .withLoginHandler(this.login.bind(this))
                .withRegistrationHandler(this.register.bind(this)),

            profileModal: ProfileModal
                .fromDefaultElement()
                .withProfileEditHandler(this.editUser.bind(this))
        };
        this.stateFromUrl();
        this.CurrentUser = {
            id: 'real@test.com',
            name: 'testy testerson',
            registrationDate: 'a date',
            loginDate: 'today'
        };
    }

    stateFromUrl () {
        const urlParams = new URLSearchParams(window.location.search);

        if (window.location.pathname === '/search') {
            const searchValue = urlParams.get('q');
            if (searchValue) {
                this.components.searchBar.Active = true;
                this.components.searchBar.Value = searchValue;
                this.search();
            }
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
        this.components.profileModal
            .withUserData(this.CurrentUser);
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

    editUser (name) {
        return this.Api.editAuthor(this.CurrentUser.id, name)
            .then(async res => {
               this.CurrentUser = res;
            });
    }

    handleUserButtonClick () {
        if (this.IsLoggedIn) {
            this.components.profileModal.show();
        } else {
            this.components.loginModal.show();
        }
    }

    handleRuntimeError (msg) {

    }
}
