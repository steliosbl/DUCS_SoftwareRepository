import LoadingSpinner from '../loadingSpinner.js';
import ProfileForm from '../forms/profileForm.js';
import Modal from './modal.js';
import DateFormat from '../../dateFormat.js';

export class ProfileModal extends Modal {
    constructor (element) {
        super(element);
        this.Loading = LoadingSpinner
            .fromParent(this.element);
        this.Form = ProfileForm
            .fromDefaultElement()
            .withSubmitHandler(this.handleFormSubmission.bind(this));
        this.innerElements = {
            registrationDate: this.element.querySelector('[data-registration-date]'),
            logoutButton: this.element.querySelector('[data-button-logout]')
        };
        this.withLogoutHandler(e => {
            this.hide();
        });
    }

    static fromDefaultElement () {
        return new ProfileModal(document.getElementById('profile_modal'));
    }

    set RegistrationDate (d) {
        this.innerElements.registrationDate.innerText = DateFormat.format(new Date(d));
    }

    withUserData (userObject) {
        this.User = userObject;
        return this;
    }

    get User () {
        return this.user;
    }

    set User (u) {
        this.user = u;
        this.onUserChanged();
    }

    onUserChanged () {
        this.Form.Data = this.User;
        this.RegistrationDate = this.User.registrationDate;
    }

    get LogoutButtonVisible () {
        return this.innerElements.logoutButton.classList.contains('d-none');
    }

    set LogoutButtonVisible (v) {
        if (v) {
            this.innerElements.logoutButton.classList.remove('d-none');
        } else {
            this.innerElements.logoutButton.classList.add('d-none');
        }
    }

    withProfileEditHandler (handler) {
        this.profileEditHandler = handler;
        return this;
    }

    withLogoutHandler (handler) {
        this.innerElements.logoutButton.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            handler(e);
        });
        return this;
    }

    handleFormSubmission () {
        this.Loading.show();
        if (this.profileEditHandler) {
            this.profileEditHandler(this.Form.Data)
                .then(() => {
                    this.hide();
                    this.Form.DisplayValidation = false;
                })
                .catch(err => {
                    this.hide();
                    throw err;
                })
                .finally(() => {
                    this.Loading.hide();
                });
        } else {
            throw new Error('There is no profileEditHandler to invoke. Have you called withProfileEditHandler?');
        }
    }

    reset () {
        this.hide();
        this.Form.reset();
        this.RegistrationDate = '{date}';
        return this;
    }

    show (args) {
        this.Form.NameEditable = Boolean(args && args.editable);
        this.LogoutButtonVisible = Boolean(args && args.editable);
        super.show();
    }
};
