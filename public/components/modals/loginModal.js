import LoadingSpinner from '../loadingSpinner.js';
import LoginForm from '../forms/loginForm.js';
import Modal from './modal.js';

export class LoginModal extends Modal {
    constructor (element) {
        super(element);
        this.Registration = false;
        this.Loading = LoadingSpinner
            .fromParent(this.element);
        this.Form = LoginForm
            .fromDefaultElement()
            .withSubmitHandler(this.handleFormSubmission.bind(this));
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
};
