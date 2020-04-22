export default class ProgramCard {
    constructor (element) {
        this.element = element;
        this.innerElements = {
            title: this.element.querySelector('[data-card-title]'),
            description: this.element.querySelector('[data-card-description]'),
            author: this.element.querySelector('[data-card-author]'),
            modificationDate: this.element.querySelector('[data-card-modification-date]'),
            creationDate: this.element.querySelector('[data-card-creation-date]')
        };
    }

    static fromPrototype (proto) {
        const clone = proto.cloneNode(true);
        clone.removeAttribute('id');
        return new ProgramCard(clone);
    }

    withData (d) {
        this.data = d;

        return this;
    }

    build () {
        if (!this.element) {
            throw new Error('Tried to build card without a corresponding DOM element. Have you called fromPrototype?');
        }
        if (!this.data) {
            throw new Error('Tried to build card without data to put in it. Have you called withData?');
        }

        this.innerElements.title.innerText = this.data.name;
        this.innerElements.description.innerText = this.data.description;
        this.innerElements.author.innerText = this.data.author.name;
        this.innerElements.modificationDate.innerText = this.data.modificationDate;
        this.innerElements.creationDate.innerText = this.data.creationDate;
        return this;
    }

    appendTo (elem) {
        elem.appendChild(this.element);
        return this;
    }

    get Element () {
        return this.element;
    }

    show () {
        this.element.classList.remove('d-none');
        return this;
    }
};
