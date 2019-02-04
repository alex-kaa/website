// ---------- Randomising functions. ----------
// Colours.
export const rnd = (max, min = 0) => ( (Math.random() * (max - min)) + min );

export const rndColor = () => Math.floor(rnd(255));

export const rndRGB = () => (
    'rgb( ' + rndColor() + ', ' + rndColor() + ', ' + rndColor() + ' )'
);


// ----------  Working with arrays. ----------
// [ "a", "b", "c", "d" ] -> [ "ab", "ac", "ad",
//                             "bc", "bd",
//                             "cd" ]
export const combineByTwo = (arr, f) => {
    for (let n = 0; n < arr.length; n++) {
        for (let m = (n + 1); m < arr.length; m++) {
            f( arr[n], arr[m] );
        };
    };
};

// [ "a", "b", "c", "d" ] -> [ "aa", "ab", "ac", "ad",
//                             "ba", "bb", "bc", "bd",
//                             "ca", "cb", "cc", "cd",
//                             "da", "db", "dc", "dd" ]
export const permuteByTwo = (arr, f) => {
    for (let n = 0; n < arr.length; n++) {
        for (let m = 0; m < arr.length; m++) {
            f( arr[n], arr[m] );
        };
    };
};

// ---------- Working with DOM. ----------
export const html = document.firstElementChild;
export const body = html.lastElementChild;

// Events.
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

// Values by id.
export const idValueGet = (idElem) => document.getElementById(idElem).value;
export const idNumberGet = (idElem) => document.getElementById(idElem).valueAsNumber;
export const idCheckedGet = (idElem) => document.getElementById(idElem).checked;

export const idValueSet = (idElem, value) => document.getElementById(idElem).value = value;
export const idCheckedSet = (idElem, bool) => document.getElementById(idElem).checked = bool;

// Inner html.
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

// Create elements.
export const createElement = (parent, el) => parent.appendChild( document.createElement(el) );
export const createElementNS = (parent, ns, el) => parent.appendChild( document.createElementNS(ns, el) );

export const createDivWithAttr = (parent, attr, attrName) => {
        const div = document.createElement("div");
        div.setAttribute(attr, attrName);
        parent.appendChild(div);
        return div;
    };
