import Form from './form.js';

export default class ProgramForm extends Form {
    constructor (element) {
        super(element);
        this.innerElements = {
            titleInput: this.element.querySelector('[data-input="title"]'),
            emailInput: this.element.querySelector('[data-input="email"]'),
            descriptionInput: this.element.querySelector('[data-input="description"]'),
            imageInput: this.element.querySelector('[data-input="image"]'),
            imageInputLabel: this.element.querySelector('[data-program-image-label]')
        };

        this.innerElements.imageInput.addEventListener('change', e => {
            this.innerElements.imageInputLabel.innerText = this.innerElements.imageInput.value.split('\\').pop();
            this.innerElements.imageInput.setCustomValidity(this.validateImage());
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
            id: this.programId,
            title: this.innerElements.titleInput.value,
            authorId: this.innerElements.emailInput.value,
            description: this.innerElements.descriptionInput.value,
            image: this.innerElements.imageInput.files[0]
        };
    }

    set Data (d) {
        if (!d.id) {
            this.innerElements.emailInput.value = d;
        } else {
            this.programId = d.id;
            this.innerElements.titleInput.value = d.title;
            this.innerElements.emailInput.value = d.author.id;
            this.innerElements.descriptionInput.value = d.description;
        }
    }

    validateImage () {
        const files = this.innerElements.imageInput.files;
        if (files.length === 1) {
            if (files[0].size < 1024 ** 2) {
                if (files[0].type === 'image/png') {
                    return '';
                }
            }
        }

        return 'Invalid';
    }
};
