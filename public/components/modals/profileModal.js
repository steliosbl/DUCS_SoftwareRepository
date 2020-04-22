import LoadingSpinner from '../loadingSpinner.js';
import ProfileForm from '../forms/profileForm.js';
import Modal from './modal.js';

export class ProfileModal extends Modal {
    constructor (element) {
        super(element);
        this.Loading = LoadingSpinner
            .fromParent(this.element);
        this.Form = ProfileForm
            .fromDefaultElement()
            .withSubmitHandler(this.handleFormSubmission.bind(this))
            .initializeListeners();
        this.innerElements = {
            registrationDate: this.element.querySelector('[data-registration-date]'),
            loginDate: this.element.querySelector('[data-login-date]'),
            logoutButton: this.element.querySelector('button[type="logout"]')
        };
        this.withLogoutHandler(e => {
            this.hide();
        });
    }

    static fromDefaultElement () {
        return new ProfileModal(document.getElementById('user_modal'));
    }

    set RegistrationDate (d) {
        this.innerElements.registrationDate.innerText = d;
    }

    set LoginDate (d) {
        this.innerElements.loginDate.innerText = d;
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

    withUserData (userObject) {
        this.Form.withUserData(userObject);
        this.RegistrationDate = userObject.registrationDate;
        this.LoginDate = userObject.loginDate;
    }

    handleFormSubmission () {
        this.Loading.show();
        if (this.profileEditHandler) {
            this.profileEditHandler(this.Form.Name)
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
        this.LoginDate = '{date}';
        return this;
    }
};
