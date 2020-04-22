export class UserButton {
    constructor (element) {
        this.element = element;
        this.innerElements = {
            userName: this.element.querySelector('[data-user-name]')
        };
    }

    static fromDefaultElement () {
        return new UserButton(document.getElementById('user_button'));
    }

    withClickHandler (handler) {
        this.element.addEventListener('click', handler);
        return this;
    }

    get Name () {
        return this.innerElements.userName.innerText;
    }

    set Name (n) {
        if (n) {
            this.innerElements.userName.innerText = n;
            this.innerElements.userName.classList.add('text-success');
        } else {
            this.innerElements.userName.innerText = 'Stranger';
            this.innerElements.userName.classList.remove('text-success');
        }
    }
};
