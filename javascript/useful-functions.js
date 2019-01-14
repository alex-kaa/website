// TODO: export
// Randomising functions.
const rnd = (max, min = 0) => ( (Math.random() * (max - min)) + min );

const rndColor = () => Math.floor(rnd(255));

const rndRGB = () => (
    'rgb( ' + rndColor() + ', ' + rndColor() + ', ' + rndColor() + ' )'
);

const combineByTwo = (arr, f) => {
    for (let n = 0; n < arr.length; n++) {
        for (let m = (n + 1); m < arr.length; m++) {
            f( arr[n], arr[m] );
        };
    };
};

// Working with DOM.
const html = document.firstElementChild;

const addEventToId = (IdName, event, f) => document.getElementById(IdName).addEventListener(event, f);
const removeEventFromId = (IdName, event, f) => document.getElementById(IdName).removeEventListener(event, f);

const addEventToTags = (className, tagName, event, f) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.addEventListener(event, f);
        }
    }
};

const removeEventFromTags = (className, tagName, event, f) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.removeEventListener(event, f);
        }
    }
};

const idValueGet = (idElem) => document.getElementById(idElem).value;
const idNumberGet = (idElem) => document.getElementById(idElem).valueAsNumber;
const idCheckedGet = (idElem) => document.getElementById(idElem).checked;

const idValueSet = (idElem, value) => document.getElementById(idElem).value = value;
const idCheckedSet = (idElem, bool) => document.getElementById(idElem).checked = bool;

const innerHtmlGet = (className, tagName) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            return t.innerHTML;
        }
    }
};

const innerHtmlSet = (className, tagName, text) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.innerHTML = text;
        }
    }
};
