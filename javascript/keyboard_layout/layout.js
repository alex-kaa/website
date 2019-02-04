// "use strict";
// // --------------- Import section ---------------
// import * as F from "../libs/useful-functions.js";
// TODO: link home.

// --------------- TEST section ---------------
// --------------- TEST section ---------------

const F = {

    combineByTwo: (arr, f) => {
        for (let n = 0; n < arr.length; n++) {
            for (let m = (n + 1); m < arr.length; m++) {
                f( arr[n], arr[m] );
            };
        };
    },

    permuteByTwo: (arr, f) => {
        for (let n = 0; n < arr.length; n++) {
            for (let m = 0; m < arr.length; m++) {
                f( arr[n], arr[m] );
            };
        };
    },

    // ---------- Working with DOM. ----------
    html:  document.firstElementChild,
    
    // Events.
    addEventToId:  (IdName, event, f) => document.getElementById(IdName).addEventListener(event, f),
    removeEventFromId:  (IdName, event, f) => document.getElementById(IdName).removeEventListener(event, f),

    addEventToTags:  (className, tagName, event, f) => {

        const classes = document.getElementsByClassName(className);
        for (let el of classes) {

            const tags = el.getElementsByTagName(tagName);
            for (let t of tags) {
                t.addEventListener(event, f);
            }
        }
    },

    removeEventFromTags:  (className, tagName, event, f) => {

        const classes = document.getElementsByClassName(className);
        for (let el of classes) {

            const tags = el.getElementsByTagName(tagName);
            for (let t of tags) {
                t.removeEventListener(event, f);
            }
        }
    },

    // Values by id.
    idValueGet:  (idElem) => document.getElementById(idElem).value,
    idNumberGet:  (idElem) => document.getElementById(idElem).valueAsNumber,
    idCheckedGet:  (idElem) => document.getElementById(idElem).checked,

    idValueSet:  (idElem, value) => document.getElementById(idElem).value = value,
    idCheckedSet:  (idElem, bool) => document.getElementById(idElem).checked = bool,

    // Inner html.
    innerHtmlGet:  (className, tagName) => {

        const classes = document.getElementsByClassName(className);
        for (let el of classes) {

            const tags = el.getElementsByTagName(tagName);
            for (let t of tags) {
                return t.innerHTML;
            }
        }
    },

    innerHtmlSet:  (className, tagName, text) => {

        const classes = document.getElementsByClassName(className);
        for (let el of classes) {

            const tags = el.getElementsByTagName(tagName);
            for (let t of tags) {
                t.innerHTML = text;
            }
        }
    },

    // Create elements.
    createElement:  (parent, el) => parent.appendChild( document.createElement(el) ),
    createElementNS:  (parent, ns, el) => parent.appendChild( document.createElementNS(ns, el) ),

    createDivWithAttr: (parent, attr, attrName) => {
        const div = document.createElement("div");
        div.setAttribute(attr, attrName);
        parent.appendChild(div);
        return div;
    }
};
F.body = F.html.lastElementChild;

// --------------- TEST section ---------------




// --------------- Letters section ---------------

const lettersCombined = (letters) => {
    const temp = [];
    F.combineByTwo( letters,
                ((a, b) => ( temp.push(a + b),
                             temp.push(b + a) )));
    return temp;
};

const occurrences = (text, searched) => {

    if ( !Boolean(searched) ) { console.error("Can't search for an empty string."); return; }

    let pos = 0, count = 0;
    const step = searched.length;

    while ( -1 !== text.indexOf(searched, pos) ) {
        pos = text.indexOf(searched, pos) + step;
        count++;
        text.indexOf(searched, pos);
    };

    if (count > 0) {
        return ( count );
    }
};

const countLettersFrequency = (text, letters) => {
    let temp = [];

    letters.forEach( (n) => {
        if ( occurrences(text, n) ) {
            temp.push( [ n, occurrences(text, n) ] );
        }
    });

    return temp;
};

const layoutArr = (lang) => {

    switch (lang) { // TODO: other layouts. TODO: Maltron.
    case "dvorak": return ([ "'", ",", ".", "p", "y", "f", "g", "c", "r", "l", "/", "=",
                             "a", "o", "e", "u", "i", "d", "h", "t", "n", "s", "-",
                             ";", "q", "j", "k", "x", "b", "m", "w", "v", "z" ]); break;

    case "qwerty": return ([ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
                             "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'",
                             "z", "x", "c", "v", "b", "n", "m", ",", ".", "/" ]); break;

    case "colemak": return ([ "q", "w", "f", "p", "g", "j", "l", "u", "y", ";", "[", "]",
                              "a", "r", "s", "t", "d", "h", "n", "e", "i", "o", "'",
                              "z", "x", "c", "v", "b", "k", "m", ",", ".", "/" ]); break;

    case "colemak_modDH": return ([ "q", "w", "f", "p", "b", "j", "l", "u", "y", ";", "[", "]",
                                    "a", "r", "s", "t", "g", "k", "n", "e", "i", "o", "'",
                                    "z", "x", "c", "d", "v", "m", "h", ",", ".", "/" ]); break;

    case "workman": return ([ "q", "d", "r", "w", "b", "j", "f", "u", "p", ";", "[", "]",
                              "a", "s", "h", "t", "g", "y", "n", "e", "o", "i", "'",
                              "z", "x", "m", "c", "v", "k", "l", ",", ".", "/" ]); break;

    case "capewell": return ([ ".", "y", "m", "d", "f", "j", "p", "l", "u", "q", "[", "]",
                               "a", "e", "r", "s", "g", "b", "t", "n", "i", "o", "-",
                               "x", "z", "c", "v", ";", "k", "w", "h", ",", "'" ]); break;

    case "abc": return ([ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
                          "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w",
                          "x", "y", "z", "-", "'", "=", ";", ",", ".", "/" ]); break;

    // Slightly different from ordinary "йцукенг".
    // But the misplaced letters are so rare it doesn't matter.
    case "ycukeng": return ([ "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
                              "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э",
                              "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ё" ]); break;

    case "abv": return ([ "а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к",
                          "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х",
                          "ц", "ч", "ш", "щ", "ь", "ы", "ъ", "э", "ю", "я" ]); break;
    }
};

// --------------- TEST section ---------------
const text_en = "The moon shone bright; a sprinkling of snow covered the ground, and I reflected that she might, possibly, have taken it into her head to walk about the garden, for refreshment. I did detect a figure creeping along the inner fence of the park; but it was not my young mistress: on its emerging into the light, I recognised one of the grooms. He stood a considerable period, viewing the carriage-road through the grounds; then started off at a brisk pace, as if he had detected something, and reappeared presently, leading Miss's pony; and there she was, just dismounted, and walking by its side. The man took his charge stealthily across the grass towards the stable. Cathy entered by the casement-window of the drawing-room, and glided noiselessly up to where I awaited her. She put the door gently too, slipped off her snowy shoes, untied her hat, and was proceeding, unconscious of my espionage, to lay aside her mantle, when I suddenly rose and revealed myself. The surprise petrified her an instant: she uttered an inarticulate exclamation, and stood fixed.";

// --------------- TEST section ---------------
const text_ru = `Не помню, сколько времени простоял на табуретке с веревкой на шее. Наверное долго. Помню, что по лицу текли слезы, и ссадина на подбородке пощипывала. А потом я услышал, как в прихожей щелкнул замок. Звук показался громким как выстрел. И тогда я страшно испугался. А чего испугался - не знаю, но прямо сердце остановилось. Чего можно испугаться, когда уже стоишь с петлей на шее? Синтия не должна была сегодня прийти, но она пришла, словно что-то почувствовала. Потом я до утра рыдал на плече у Синтии, а она меня утешала, и говорила, что все наладится, что у меня стресс, и что у нее есть прекрасный знакомый врач, доктор Харви, и она завтра же ему позвонит, и обязательно меня к нему отведет, и он подберет мне лучшие в мире лекарства...

Синтия сдержала слово - созвонилась с этим Харви и наутро повезла меня в Кембридж. После всего пережитого мне было все равно - я не верил, что какой-то доктор Харви сможет мне помочь.

Харви оказался не совсем доктор - никакого кабинета в Кембридже у него не было, а побеседовать со мной он согласился после работы в местном пабе. И когда через окно я увидел, как молодой рыжий парень пристегивает велосипед у входа в паб, я и подумать не мог, что это тот самый доктор Харви, к которому меня везла Синтия полдня на поезде. О том, что Харви - ее бывший, она призналась уже потом. Да и правильно сделала, иначе я бы постеснялся рассказывать ему о своем состоянии. Они приветливо обнялись, затем Харви предложил мне прогуляться пешком и поговорить.

Мы шли вдоль каналов, а мимо все время проплывали спортивные байдарки, словно торопились на нерест. Сам Харви тоже выглядел спортивно - быстрый, энергичный, высокого роста. Я со своим весом и одышкой снова чувствовал себя лишним в этом мире и думал, что наверно зря Синтия сняла меня с табуретки. Сперва мы говорили ни о чем - о погоде, о Лондоне, о брексите и выборах в Италии.

Мне думалось, что Харви сильно старше меня. Но потом я подумал, что мы ровесники. А потом заметил, что в его хорошо поставленном голосе и красивых энергичных жестах проскакивает чуть больше энергии, увлеченности и интереса ко всему окружающему, чем это принято у настоящих взрослых, даже таких бестолковых, как я. И понял, что доктор Харви - почти мальчишка.`;


// --------------- Infographics section ---------------

// --------------- SVG section ---------------
const svg = F.createElementNS(F.body, "http://www.w3.org/2000/svg", "svg");
const svgNS = svg.namespaceURI;

svg.setAttributeNS(null, "id", "svg");
svg.setAttributeNS(null, "width", "100vw");
svg.setAttributeNS(null, "height", "100vh");
svg.setAttributeNS(null, "viewBox", "0 0 130 40");
svg.setAttributeNS(null, "preserveAspectRatio", "xMidYMin");

const svgLine = (fromX, fromY, toX, toY, width, color, id) => {
    const temp = F.createElementNS(svg, svgNS, "line");

    temp.setAttributeNS(null, "x1", fromX);
    temp.setAttributeNS(null, "y1", fromY);
    temp.setAttributeNS(null, "x2", toX);
    temp.setAttributeNS(null, "y2", toY);
    temp.setAttributeNS(null, "stroke-width", width);
    temp.setAttributeNS(null, "stroke", color);
    temp.setAttributeNS(null, "id", id);

    return temp;
};

const svgRect = (x, y, width, height, rx, ry, strokeWidth, color, id) => {
    const temp = F.createElementNS(svg, svgNS, "line");

    temp.setAttributeNS(null, "x", x);
    temp.setAttributeNS(null, "y", y);
    temp.setAttributeNS(null, "width", width);
    temp.setAttributeNS(null, "height", height);
    temp.setAttributeNS(null, "rx", rx);
    temp.setAttributeNS(null, "ry", ry);
    temp.setAttributeNS(null, "stroke-width", strokeWidth);
    temp.setAttributeNS(null, "stroke", color);
    temp.setAttributeNS(null, "id", id);

    return temp;
};

const svgBezierQ = (fromX, fromY, controlX, controlY, toX, toY, width, color, id) => {
    const temp = F.createElementNS(svg, svgNS, "path");
    const path = `M ${fromX} ${fromY} Q ${controlX} ${controlY}, ${toX} ${toY}`;

    temp.setAttributeNS(null, "d", path);
    temp.setAttributeNS(null, "stroke-width", width);
    temp.setAttributeNS(null, "stroke", color);
    temp.setAttributeNS(null, "fill", "none");
    temp.setAttributeNS(null, "id", id);

    return temp;
};

const svgTextMiddle = (x, y, text, id, color = "white") => {
    const temp = F.createElementNS(svg, svgNS, "text");

    temp.setAttributeNS(null, "text-anchor", "middle");
    temp.setAttributeNS(null, "baseline-shift", "-20%");    
    temp.setAttributeNS(null, "font-size", "50%");
    
    temp.setAttributeNS(null, "x", x);
    temp.setAttributeNS(null, "y", y);
    temp.setAttributeNS(null, "fill", color);
    temp.setAttributeNS(null, "id", id);
    temp.innerHTML = text;

    return temp;    
};

// TEST
// const lettersFrequency = countLettersFrequency(text_en, lettersCombined(layout("dvorak")));

// console.log(lettersFrequency[0][0].charAt(0), lettersFrequency[0][0].charAt(1), lettersFrequency[0][1]);

// --------------- Drawing section ---------------
const fingersArr = [ "left little", "left ring", "left middle", "left index", "left reach",
                     "right reach", "right index", "right middle", "right ring", "right little",
                     "right little 1", "right little 2" ];

const drawLetters = (layout) => {
    let x = 10, y = 10;
    const temp = [];

    for (let n = 0; n < layout.length; n++) {
        temp.push( svgTextMiddle( x, y,
                                  layout[n],
                                  layout[n],
                                  // "#1a0d00"
                                  "brown"
                                ));
        x += 10;

        if (( (x > 120) && (y === 10) ) || ( (x > 110) && (y === 20) )) {
            x = 10, y += 10;
        }
    }
    return temp;
};

// TEST
// const kbKeys = drawLetters( layoutArr("dvorak"));

const lineColor = (x1, y1, x2, y2) => {

    // Rows.
    
};

const drawCombinations = (text, layout) => {

    // svg.innerHTML = null;       // TODO place to a proper position.

    const letters = countLettersFrequency(text, lettersCombined(layout));

    const getXY = (i, l) => [
        Number( document.getElementById( letters[i][0].charAt(l) ).getAttributeNS(null, 'x') ),
        Number( document.getElementById( letters[i][0].charAt(l) ).getAttributeNS(null, 'y') )
    ];

    const from = (i) => getXY(i, 0);
    const to = (i) => getXY(i, 1);

    const dist = (i) => [
        Math.abs( from(i)[0] - to(i)[0] ),
        Math.abs( from(i)[1] - to(i)[1] )
    ];

    const control = (i) => [    // TODO check.
        ( Math.max( from(i)[0], to(i)[0] ) - (dist(i)[0] / 2) ),
        ( Math.max( from(i)[1], to(i)[1] ) - dist(i)[1] + (dist(i)[0] / 4) )
    ];

    const width = (i) => 20 * ( letters[i][1] / text.length );

    for (let n = 0; n < letters.length; n++) {
        svgBezierQ( from(n)[0], from(n)[1],
                    control(n)[0], control(n)[1],
                    to(n)[0], to(n)[1],
                    width(n),
                    // lineColor( from(n)[0], from(n)[1],
                    //            to(n)[0], to(n)[1] ),
                    "white",
                    letters[n][0] );

    }
};

// TEST
const tt = (text, layout) => ( drawLetters( layoutArr(layout)),
                               drawCombinations( text, layoutArr(layout) ));

tt( text_ru, "ycukeng" );
// tt( text_en, "qwerty" );
// tt( text_en, "dvorak" );
// tt( text_en, "colemak" );
// tt( text_en, "colemak_modDH" );
// tt( text_en, "workman" );
// tt( text_en, "capewell" );
// tt( text_en, "abc" );
// tt( text_ru, "abv" );