export default class LoadingSpinner {
    constructor (element) {
        this.element = element;
    }

    static fromParent (parent) {
        return new LoadingSpinner(parent.querySelector('[data-loading]'));
    }

    show () {
        this.element.classList.remove('d-none');
    }

    hide () {
        this.element.classList.add('d-none');
    }
}
