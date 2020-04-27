import LoadingSpinner from './loadingSpinner.js';
import ProgramCard from './programCard.js';

export class ProgramList {
    constructor (element) {
        this.element = element;
        this.Loading = LoadingSpinner
            .fromParent(this.element);

        this.cards = [];
        this.UserId = null;
    }

    static fromDefaultElement () {
        return new ProgramList(document.getElementById('card_container'));
    }

    get UserId () {
        return this.userId;
    }

    set UserId (u) {
        this.userId = u;
        this.onUserIdChanged();
    }

    onUserIdChanged () {
        this.cards.forEach(card => {
            card.ControlsVisible = card.Data.authorId === this.UserId;
        });
    }

    withEditHandler (handler) {
        this.editHandler = handler;
        return this;
    }

    handleEdit (card) {
        return this.editHandler(card.data);
    }

    withDeleteHandler (handler) {
        this.deleteHandler = handler;
        return this;
    }

    handleDelete (card) {
        card.Loading.show();
        this.deleteHandler(card).then(() => {
            this.removeCard(card);
        }).finally(() => {
            card.Loading.hide();
        });
    }

    withProfileHandler (handler) {
        this.profileHandler = handler;
        return this;
    }

    handleProfile (card) {
        this.profileHandler(card.Data.author);
    }

    async display (dataPromise) {
        this.clearAllCards();
        this.Loading.show();
        dataPromise.then(data => {
            data.forEach(item => this.addCard(item));
        }).finally(() => {
            this.Loading.hide();
        });

        return this;
    }

    clearAllCards () {
        this.cards.forEach(card => this.removeCard(card));
        this.cards = [];
    }

    removeCard (card) {
        this.element.removeChild(card.element);
    }

    addCard (data) {
        const newCard = ProgramCard
            .fromDefaultPrototype()
            .withData(data)
            .withControlsVisible(data.author.id === this.userId)
            .withEditHandler(this.handleEdit.bind(this))
            .withDeleteHandler(this.handleDelete.bind(this))
            .withProfileHandler(this.handleProfile.bind(this))
            .appendTo(this.element)
            .show();

        this.cards.push(newCard);
    }
};
