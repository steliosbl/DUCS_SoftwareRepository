import Form from './form.js';

export default class ProfileForm extends Form {
    constructor (element) {
        super(element);
        this.innerElements = {
            emailInput: this.element.querySelector('[data-input="email"]'),
            nameInput: this.element.querySelector('[data-input="name"]'),
            submitButton: this.element.querySelector('button[type="submit"]')
        };
    }

    static fromDefaultElement () {
        return new ProfileForm(document.getElementById('profile_form'));
    }

    withUserData (userObject) {
        this.Email = userObject.id;
        this.Name = userObject.name;
        return this;
    }

    get Email () {
        return this.innerElements.emailInput.value;
    }

    set Email (e) {
        this.innerElements.emailInput.value = e;
    }

    get Name () {
        return this.innerElements.nameInput.value;
    }

    set Name (n) {
        this.innerElements.nameInput.value = n;
    }

    get SubmitButtonVisible () {
        return !this.innerElements.submitButton.classList.contains('d-none');
    }

    set SubmitButtonVisible (v) {
        if (v) {
            this.innerElements.submitButton.classList.remove('d-none');
        } else {
            this.innerElements.submitButton.classList.add('d-none');
        }
    }

    initializeListeners () {
        super.initializeListeners();

        this.innerElements.nameInput.addEventListener('input', e => {
            this.SubmitButtonVisible = true;
        });

        return this;
    }

    reset () {
        super.reset();
        this.SubmitButtonVisible = false;
    }
};
