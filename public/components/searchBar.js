export class SearchBar {
    constructor (element) {
        this.element = element;
        this.initialized = false;
        this.Active = false;
        this.innerElements = {
            searchButton: this.element.querySelector('[data-button-search]'),
            newButton: this.element.querySelector('[data-button-new]'),
            searchBox: this.element.querySelector('[data-input-search]'),
            spacer: this.element.querySelector('[data-spacer]'),
            buttons: this.element.querySelector('[data-container-buttons]')
        };
    }

    static fromDefaultElement () {
        return new SearchBar(document.getElementById('search_bar'));
    }

    withSearchHandler (handler) {
        this.innerElements.searchBox.addEventListener('keyup', e => {
            if (e.keyCode === 13) {
                e.preventDefault();
                if (this.Value) {
                    this.Active = true;
                    handler(e);
                }
            }
        });

        this.innerElements.searchButton.onclick = e => {
            e.preventDefault();
            if (this.Value) {
                this.Active = true;
                handler(e);
            }
        };

        return this;
    }

    withNewHandler (handler) {
        this.innerElements.newButton.onclick = e => {
            e.preventDefault();
            this.newHandler(e);
        };

        return this;
    }

    get Active () {
        return this.active;
    }

    set Active (a) {
        this.active = a;
        this.onActiveChanged();
    }

    get Value () {
        return this.innerElements.searchBox.value;
    }

    set Value (v) {
        this.innerElements.searchBox.value = v;
    }

    onActiveChanged () {
        if (this.Active) {
            this.element.classList.remove('vertical-center');
            this.innerElements.spacer.classList.add('d-none');
            this.innerElements.buttons.classList.remove('mx-auto', 'pt-4');
            this.innerElements.buttons.classList.add('input-group-append', 'ml-2');
            this.innerElements.searchBox.classList.remove('rounded');
        }
    }
}
