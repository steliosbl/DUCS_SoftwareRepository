export default class Modal {
    constructor (element) {
        this.element = element;
        this.Visible = false;
    }

    static fromElement (element) {
        return new Modal(element);
    }

    static fromElementId (id) {
        return new Modal(document.getElementById(id));
    }

    withSubmitHandler (handler) {
        this.submitHandler = handler;
        return this;
    }

    initializeListeners () {
        this.element.querySelector('.modal-footer .btn-primary').onclick(e => {
            this.submitHandler(e);
        });
        return this;
    }

    modal (args) {
        // Evil JQuery but it wouldn't work otherwise
        return $(this.element).modal(args);
    }

    show () {
        this.modal('show');
        return this;
    }

    hide () {
        this.modal('hide');
        return this;
    }

    get Visible () {
        return this.element === document.activeElement;
    }

    set Visible (v) {
        if (v) {
            this.show();
        } else {
            this.hide();
        }
    }
};
