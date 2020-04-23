import Toast from './toast.js';

export default class ToastContainer {
    constructor (element) {
        this.element = element;
        this.toasts = [];
    }

    static fromDefaultElement () {
        return new ToastContainer(document.getElementById('toast_container'));
    }

    async add (message) {
        if (this.toasts.length >= 2) {
            await this.toasts.shift().hide();
        }

        const newToast = Toast.fromDefaultPrototype()
            .withMessage(message)
            .appendTo(this.element);

        this.toasts.push(newToast);

        newToast.show();
    }
}
