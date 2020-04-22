export default class Form {
    constructor (element) {
        this.element = element;
        this.initialized = false;
    }

    static fromElement (e) {
        return new Form(e);
    }

    static fromElementId (id) {
        return new Form(document.getElementById(id));
    }

    get PassesValidation () {
        return this.element.checkValidity();
    }

    get DisplayValidation () {
        return this.element.classList.contains('was-validated');
    }

    set DisplayValidation (v) {
        if (v) {
            this.element.classList.add('was-validated');
        } else {
            this.element.classList.remove('was-validated');
        }
    }

    initializeListeners () {
        this.element.addEventListener('submit', e => {
            e.preventDefault();
            e.stopPropagation();
            if (this.element.checkValidity()) {
                this.submitHandler(e);
            }

            this.DisplayValidation = true;
        });

        this.initialized = true;
        return this;
    }

    withSubmitHandler (handler) {
        if (!this.initialized) {
            this.submitHandler = handler;
            return this;
        }

        throw new Error('Cannot add submit handler now. The form has already been initialized');
    }

    reset () {
        this.element.reset();
        this.DisplayValidation = false;
        return this;
    }
};
