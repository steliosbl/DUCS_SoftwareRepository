import Form from './form.js';

export default class ProgramForm extends Form {
    constructor (element) {
        super(element);
        this.innerElements = {
            nameInput: this.element.querySelector('[data-input="name"]'),
            emailInput: this.element.querySelector('[data-input="email"]'),
            descriptionInput: this.element.querySelector('[data-input="description"]'),
            imageInput: this.element.querySelector('[data-input="image"]'),
            imageInputLabel: this.element.querySelector('[data-program-image-label]')
        };

        this.innerElements.imageInput.addEventListener('change', e => {
            this.innerElements.imageInputLabel.innerText = this.innerElements.imageInput.value.split('\\').pop();
            this.innerElements.imageInput.setCustomValidity('Lolll');
        });
    }

    static fromDefaultElement () {
        return new ProgramForm(document.getElementById('program_form'));
    }

    set EmailEditable (e) {
        if (e) {
            this.innerElements.emailInput.removeAttribute('disabled');
        } else {
            this.innerElements.emailInput.setAttribute('disabled', '');
        }
    }

    get Data () {
        return {
            id: this.id,
            name: this.innerElements.nameInput.value,
            authorId: this.innerElements.emailInput.value,
            description: this.innerElements.descriptionInput.value,
            image: this.innerElements.imageInput.files
        };
    }

    set Data (d) {
        if (!d.id) {
            this.innerElements.emailInput.value = d;
        } else {
            this.programId = d.id;
            this.innerElements.nameInput.value = d.name;
            this.innerElements.emailInput.value = d.author.id;
            this.innerElements.descriptionInput.value = d.description;
        }
    }
};
