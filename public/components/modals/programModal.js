import LoadingSpinner from '../loadingSpinner.js';
import Modal from './modal.js';
import ProgramForm from '../forms/programForm.js';

export class ProgramModal extends Modal {
    constructor (element) {
        super(element);
        this.editing = false;
        this.Loading = LoadingSpinner
            .fromParent(this.element);
        this.Form = ProgramForm
            .fromDefaultElement()
            .withSubmitHandler(this.handleFormSubmission.bind(this));
    }

    static fromDefaultElement () {
        return new ProgramModal(document.getElementById('program_modal'));
    }

    handleFormSubmission () {
        this.Loading.show();
        const promise = this.editing
            ? this.editHandler(this.Form.Data)
            : this.newHandler(this.Form.Data);

        promise
            .then(() => {
                this.reset();
            })
            .catch(err => {
                this.hide();
                throw err;
            }).finally(() => {
                this.Loading.hide();
            });
    }

    withEditHandler (handler) {
        this.editHandler = handler;
        return this;
    }

    withNewHandler (handler) {
        this.newHandler = handler;
        return this;
    }

    show (data) {
        this.Form.reset();
        this.Form.Data = data;
        this.editing = Boolean(data.id);
        this.Form.EmailEditable = Boolean(data.id);
        super.show();
    }

    reset () {
        this.hide();
        this.Form.reset();
    }
};
