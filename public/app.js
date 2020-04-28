import Api from './api.js';
import { SearchBar, UserButton, ProgramList } from './components/index.js';
import { ProfileModal, LoginModal, ProgramModal } from './components/modals/index.js';
import ToastContainer from './components/toastContainer.js';

export default class App {
    constructor () {
        this.currentUser = {
            id: null,
            name: null,
            registrationDate: null,
            loginDate: null
        };
        this.errorToasts = [];
        this.Api = new Api()
            .withErrorHandler(this.handleApiError.bind(this));
        this.components = {
            searchBar: SearchBar
                .fromDefaultElement()
                .withSearchHandler(this.handleSearchTrigger.bind(this))
                .withNewHandler(this.handleNewButtonClick.bind(this)),

            cardList: ProgramList
                .fromDefaultElement()
                .withEditHandler(this.handleEditButtonClick.bind(this))
                .withDeleteHandler(this.deleteProgram.bind(this))
                .withProfileHandler(this.handleProfileButtonClick.bind(this)),

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
                .withLogoutHandler(this.logout.bind(this)),

            programModal: ProgramModal
                .fromDefaultElement()
                .withEditHandler(this.editProgram.bind(this))
                .withNewHandler(this.createProgram.bind(this)),

            toastContainer: ToastContainer
                .fromDefaultElement()
        };
    }

    initialize () {
        this.stateFromUrl();
    }

    stateFromUrl () {
        const urlParams = new URLSearchParams(window.location.search);

        if (window.location.pathname === '/search') {
            const searchValue = urlParams.get('q');
            if (searchValue) {
                this.SearchTerm = searchValue;
            }
        }
    }

    get SearchTerm () {
        if (window.location.pathname === '/search') {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('q');
        } else {
            return this.components.searchBar.Value;
        }
    }

    set SearchTerm (s) {
        window.history.pushState({
            hasSearched: true
        }, 'Search Results', '/search?q=' + s);
        this.components.searchBar.Value = s;
        this.components.searchBar.Active = true;
        this.onSearchTermChanged();
    }

    onSearchTermChanged () {
        const dataPromise = this.Api.searchPrograms({
            q: this.SearchTerm
        });
        this.components.cardList.display(dataPromise);
    }

    get IsLoggedIn () {
        return Boolean(this.CurrentUser.id);
    }

    get CurrentUser () {
        return this.currentUser;
    }

    set CurrentUser (c) {
        this.currentUser = c;
        this.onCurrentUserChanged();
    }

    onCurrentUserChanged () {
        this.components.userButton.Name = this.CurrentUser.name;
        this.components.cardList.UserId = this.CurrentUser.id;
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

    logout () {
        this.CurrentUser = {
            id: null,
            name: null,
            registrationDate: null,
            loginDate: null
        };
    }

    register (id, name) {
        return this.Api.createAuthor(id, name)
            .then(res => this.login(res.id));
    }

    editUser (data) {
        return this.Api.editAuthor(this.CurrentUser.id, data)
            .then(async res => {
                this.CurrentUser = res;
            });
    }

    editProgram (data) {
        return this.Api.editProgram(this.CurrentUser.id, data).then(res => {
            this.SearchTerm = res.id;
        });
    }

    createProgram (data) {
        return this.Api.createProgram(this.CurrentUser.id, data).then(res => {
            this.SearchTerm = res.id;
        });
    }

    deleteProgram (card) {
        return this.Api.deleteProgram(this.CurrentUser.id, card.data.id);
    }

    handleSearchTrigger (term) {
        this.SearchTerm = term;
    }

    handleUserButtonClick () {
        if (this.IsLoggedIn) {
            this.components.profileModal.User = this.CurrentUser;
            this.components.profileModal.show({
                editable: true
            });
        } else {
            this.components.loginModal.show();
        }
    }

    handleProfileButtonClick (userData) {
        this.components.profileModal
            .withUserData(userData)
            .show({
                editable: userData.id === this.CurrentUser.id
            });
    }

    handleNewButtonClick () {
        if (this.IsLoggedIn) {
            this.components.programModal.show(this.CurrentUser.id);
        } else {
            this.components.loginModal.show();
        }
    }

    handleEditButtonClick (data) {
        this.components.programModal.show(data);
    }

    handleApiError (msg) {
        this.components.toastContainer.add(msg);
    }
}
