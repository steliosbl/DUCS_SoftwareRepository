import LoadingSpinner from './loadingSpinner.js';
import DateFormat from '../dateFormat.js';

export default class ProgramCard {
    constructor (element) {
        this.element = element;
        this.Loading = LoadingSpinner
            .fromParent(this.element);
        this.innerElements = {
            title: this.element.querySelector('[data-card-title]'),
            description: this.element.querySelector('[data-card-description]'),
            author: this.element.querySelector('[data-card-author]'),
            modificationDate: this.element.querySelector('[data-card-modification-date]'),
            creationDate: this.element.querySelector('[data-card-creation-date]'),
            id: this.element.querySelector('[data-card-id]'),
            image: this.element.querySelector('[data-card-img]'),
            editButton: this.element.querySelector('[data-card-button-edit]'),
            deleteButton: this.element.querySelector('[data-card-button-delete]'),
            profileButton: this.element.querySelector('[data-card-button-profile]')
        };
    }

    static fromDefaultPrototype () {
        const clone = document.getElementById('card_proto')
            .cloneNode(true);
        clone.removeAttribute('id');
        return new ProgramCard(clone);
    }

    withData (d) {
        this.Data = d;
        return this;
    }

    get Data () {
        return this.data;
    }

    set Data (d) {
        this.data = d;
        this.onDataChanged();
    }

    onDataChanged () {
        this.innerElements.title.innerText = this.Data.title;
        this.innerElements.description.innerText = this.Data.description;
        this.innerElements.author.innerText = this.Data.author.name;
        this.innerElements.modificationDate.innerText = DateFormat.format(new Date(this.Data.modificationDate));
        this.innerElements.creationDate.innerText = DateFormat.format(new Date(this.Data.creationDate));
        this.innerElements.id.innerText = this.Data.id;
        this.innerElements.image.src = '/image/' + this.Data.id;
    }

    withControlsVisible (c) {
        this.ControlsVisible = c;
        return this;
    }

    set ControlsVisible (c) {
        if (c) {
            this.innerElements.editButton.classList.remove('invisible');
            this.innerElements.deleteButton.classList.remove('invisible');
        } else {
            this.innerElements.editButton.classList.add('invisible');
            this.innerElements.deleteButton.classList.add('invisible');
        }
    }

    withEditHandler (handler) {
        this.innerElements.editButton.addEventListener('click', e => handler(this));
        return this;
    }

    withDeleteHandler (handler) {
        this.innerElements.deleteButton.addEventListener('click', e => handler(this));
        return this;
    }

    withProfileHandler (handler) {
        this.innerElements.profileButton.addEventListener('click', e => handler(this));
        return this;
    }

    appendTo (elem) {
        elem.appendChild(this.element);
        return this;
    }

    show () {
        this.element.classList.remove('d-none');
        return this;
    }
};
