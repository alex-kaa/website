// Randomising functions.
export const rnd = (max, min = 0) => ( (Math.random() * (max - min)) + min );

export const rndColor = () => Math.floor(rnd(255));

export const rndRGB = () => (
    'rgb( ' + rndColor() + ', ' + rndColor() + ', ' + rndColor() + ' )'
);

export const combineByTwo = (arr, f) => {
    for (let n = 0; n < arr.length; n++) {
        for (let m = (n + 1); m < arr.length; m++) {
            f( arr[n], arr[m] );
        };
    };
};

// Working with DOM.
export const html = document.firstElementChild;

export const addEventToId = (IdName, event, f) => document.getElementById(IdName).addEventListener(event, f);
export const removeEventFromId = (IdName, event, f) => document.getElementById(IdName).removeEventListener(event, f);

export const addEventToTags = (className, tagName, event, f) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.addEventListener(event, f);
        }
    }
};

export const removeEventFromTags = (className, tagName, event, f) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.removeEventListener(event, f);
        }
    }
};

export const idValueGet = (idElem) => document.getElementById(idElem).value;
export const idNumberGet = (idElem) => document.getElementById(idElem).valueAsNumber;
export const idCheckedGet = (idElem) => document.getElementById(idElem).checked;

export const idValueSet = (idElem, value) => document.getElementById(idElem).value = value;
export const idCheckedSet = (idElem, bool) => document.getElementById(idElem).checked = bool;

export const innerHtmlGet = (className, tagName) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            return t.innerHTML;
        }
    }
};

export const innerHtmlSet = (className, tagName, text) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.innerHTML = text;
        }
    }
};
