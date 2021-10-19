import { Controller } from "@hotwired/stimulus";
import { get } from "@rails/request.js";

// attaches an infinite-scroll listener on either a specific scrollable element or
// the entire window(<body>)

// if you want to attach the listener to the window, you can do this
// data-pagination-attach-to-body-value="true", then the listener will be attached on the window
// rather than the element.

// If you omit this option, the controller will attach the event listener-
// on the element that has the declaration
//<element data-controller="pagination">

// make sure to return a <element data-pagination-target="lastPage" /> in the turbo stream response
// to indicate that there are no more pages. Thus, no more requests being sent.

export default class extends Controller {
    static targets = ['lastPage']

    static values = {
        url: String,
        page: Number,
    };

    initialize() {
        this.scroll = this.scroll.bind(this);
        this.pageValue = this.pageValue || 1;
    }

    connect() {
        if(!this.scrollValue) return;
        document.addEventListener("scroll", this.scroll);
    }

    scroll() {
        if (this.scrollReachedEnd && !this.hasLastPageTarget) {
            this._fetchNewPage()
        }
    }

    async _fetchNewPage() {
        const url = new URL(this.urlValue);
        url.searchParams.set('page', this.pageValue)

        await get(url.toString(), {
            responseKind: 'turbo-stream'
        });

        this.pageValue +=1;
    }

    async paginate(e) {
        await this._fetchNewPage();
        e.target.blur();
    }

    get scrollReachedEnd() {
        const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        return distanceFromBottom < 20; // adjust the number 20 yourself
    }
}
