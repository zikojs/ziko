/*
 [
    {
        query: '(min-width: 600px)',
        callback: () => console.log(1)
    },
    {
        query: '(max-width: 300px)',
        callback: () => console.log(2)
    }
 ]
*/

class UseMediaQuery {
    #mediaQueryRules;
    #fallback;
    #lastCalledCallback = null;

    constructor(mediaQueryRules = [], fallback = () => {}) {
        this.#mediaQueryRules = mediaQueryRules;
        this.#fallback = fallback;

        this.#init();
    }

    // PRIVATE: check if ANY rule matches
    #checkAllRules() {
        return this.#mediaQueryRules.some(
            ({ query }) => globalThis.matchMedia(query).matches
        );
    }

    // PRIVATE: installs listeners and initial checks
    #init() {
        this.#mediaQueryRules.forEach(({ query, callback }) => {
            const mediaQueryList = globalThis.matchMedia(query);

            const checkMatches = () => {
                const anyMatch = this.#checkAllRules();

                if (mediaQueryList.matches) {
                    callback();
                    this.#lastCalledCallback = callback;
                } else if (!anyMatch && this.#lastCalledCallback !== this.#fallback) {
                    this.#fallback();
                    this.#lastCalledCallback = this.#fallback;
                }
            };

            checkMatches();
            mediaQueryList.addEventListener("change", checkMatches);
        });
    }
}

const useMediaQuery = (mediaQueryRules, fallback) =>
    new UseMediaQuery(mediaQueryRules, fallback);

export { useMediaQuery };
