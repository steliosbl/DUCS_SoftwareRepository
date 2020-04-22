import LoadingSpinner from './loadingSpinner.js';
import ProgramCard from './programCard.js';

export class ProgramList {
    constructor (element) {
        this.element = element;
        this.Loading = LoadingSpinner
            .fromParent(this.element);

        this.cards = [];
    }

    static fromDefaultElement () {
        return new ProgramList(document.getElementById('card_container'));
    }

    withDefaultCardPrototype () {
        this.cardPrototype = document.getElementById('card_proto');
        return this;
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
    }

    removeCard (card) {
        this.element.removeChild(card.element);
    }

    addCard (data) {
        if (this.cardPrototype) {
            const newCard = ProgramCard
                .fromPrototype(this.cardPrototype)
                .withData(data)
                .build()
                .appendTo(this.element)
                .show();

            this.cards.push(newCard);
        } else {
            throw new Error('Cannot add new card. No card prototype exists. Have you called withCardPrototype?');
        }
    }
};
