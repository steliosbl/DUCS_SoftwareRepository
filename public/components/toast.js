export default class Toast {
    constructor (element) {
        this.element = element;
        this.innerElements = {
            body: this.element.querySelector('[data-body]')
        };
    }

    static fromDefaultPrototype () {
        const clone = document.getElementById('error_toast')
            .cloneNode(true);
        clone.removeAttribute('id');
        clone.classList.remove('d-none');
        return new Toast(clone);
    }

    withMessage (m) {
        this.Message = m;
        return this;
    }

    get Message () {
        return this.innerElements.body.innerText;
    }

    set Message (m) {
        this.innerElements.body.innerText = m;
    }

    set Visible (v) {
        if (v) {
            this.show();
        } else {
            this.hide();
        }
    }

    appendTo (elem) {
        elem.insertBefore(this.element, elem.firstChild);
        return this;
    }

    show () {
        return new Promise((resolve, reject) => {
            $(this.element).toast('show');
            $(this.element).on('shown.bs.toast', () => {
                resolve();
            });
        });
    }

    hide () {
        return new Promise((resolve, reject) => {
            $(this.element).toast('hide');
            $(this.element).on('hidden.bs.toast', () => {
                resolve();
            });
        });
    }
}
