import Form from './form.js';

export default class LoginForm extends Form {
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
};