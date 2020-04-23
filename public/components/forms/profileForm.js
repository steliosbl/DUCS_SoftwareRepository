import Form from './form.js';

export default class ProfileForm extends Form {
    constructor (element) {
        super(element);
        this.innerElements = {
            emailInput: this.element.querySelector('[data-input="email"]'),
            nameInput: this.element.querySelector('[data-input="name"]'),
            submitButton: this.element.querySelector('button[type="submit"]')
        };
        this.innerElements.nameInput.addEventListener('input', e => {
            this.SubmitButtonVisible = true;
        });
    }

    static fromDefaultElement () {
        return new ProfileForm(document.getElementById('profile_form'));
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

    get Data () {
        return {
            id: this.Email,
            name: this.Name
        };
    }

    set Data (u) {
        this.Email = u.id;
        this.Name = u.name;
    }

    withEditableName (n) {
        this.NameEditable = n;
        return this;
    }

    set NameEditable (n) {
        if (n) {
            this.innerElements.nameInput.removeAttribute('disabled');
        } else {
            this.innerElements.nameInput.setAttribute('disabled', '');
        }
    }

    withVisibleSubmitButton (v) {
        this.SubmitButtonVisible = v;
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

    reset () {
        super.reset();
        this.SubmitButtonVisible = false;
    }
};
