'use strict';
/* Variables for the game */
const VARIABLES = Object.seal({
    loseValue: 10,
    wordList: ['biedronka','dinozaur','drzewa','jabłko','jaszczurka','kamień','konstantynopolitańczykowianeczka','kosmos','kościół','kot','kwiatek','las','miasto','motyl','niebo','pies','polana','ryba','samochód','sklep','słońce','trawa','ulica','wiatr','woda'],
    word: '',
    letterValue: '',
    usedLetters: [],
    positive: 0,
    negative: 0,
    animationTime: Number.parseFloat(getComputedStyle(document.querySelector(':root')).getPropertyValue('--animation-time')) * 1000
    });
/* Quick element access */
const ELEMENTS = Object.freeze({
    wordOutput: document.getElementById('word-space'),
    gameWord: document.getElementById('game-word').getElementsByTagName('span')[0],
    letter: document.getElementById('letter'),
    win: document.getElementById('win-message'),
    lose: document.getElementById('lose-message'),
    end: document.getElementById('end-message'),
    infoBox: document.getElementById('info-box'),
    overlay: document.getElementById('overlay'),
    img: []
    });
function exit() { window.location = 'https://sqdexe.github.io'; }
function showImage(imageNumber) {
    /* Hides all images and shows current one */
    for (let img of ELEMENTS.img)
        img.classList.add('hidden');
    ELEMENTS.img[imageNumber].classList.remove('hidden');
    }
function cleanUp() {
    /* Clears variables and elements */
    [VARIABLES.positive, VARIABLES.negative, VARIABLES.usedLetters] = [0, 0, []];
    showImage(0);
    ELEMENTS.wordOutput.innerHTML = '';
    }
function setUp() {
    /* Chooses word and preperes elements */
    VARIABLES.word = VARIABLES.wordList[Math.floor(Math.random() * VARIABLES.wordList.length)].split('');
    for (let i = 0, span = null; i < VARIABLES.word.length; i++) {
        span = document.createElement('span');
        span.className = VARIABLES.word.at(i);
        span.innerText = '_';
        ELEMENTS.wordOutput.appendChild(span);
        }
    }
function showElements(styleValue) {
    /* Shows and hides overlay and info box */
    if (styleValue) {
        ELEMENTS.infoBox.classList.remove('hidden');
        ELEMENTS.overlay.classList.remove('hidden');
        ELEMENTS.infoBox.classList.remove('anima-box-out');
        ELEMENTS.infoBox.classList.add('anima-box-in');
        ELEMENTS.overlay.classList.remove('anima-overlay-out');
        ELEMENTS.overlay.classList.add('anima-overlay-in');
        }
    else {
        ELEMENTS.infoBox.classList.add('anima-box-out');
        ELEMENTS.infoBox.classList.remove('anima-box-in');
        ELEMENTS.overlay.classList.add('anima-overlay-out');
        ELEMENTS.overlay.classList.remove('anima-overlay-in');
        setTimeout(() => {
            ELEMENTS.infoBox.classList.add('hidden');
            ELEMENTS.overlay.classList.add('hidden');
            }, VARIABLES.animationTime);
        }
    }
function visStyle(bool, elem) {
    bool ?
        ELEMENTS[elem].classList.remove('hidden') :
        ELEMENTS[elem].classList.add('hidden');
    }
function showEndMessage(win, lose, end) {
    /* Manages info box */
    visStyle(win, 'win');
    visStyle(lose, 'lose');
    visStyle(end, 'end');
    }
function endGame(endType) {
    /* Ends the game */
    ELEMENTS.gameWord.innerText = VARIABLES.word.join('');
    switch (endType) {
        case 'win' :
            showEndMessage(true, false, false); break;
        case 'lose' :
            showEndMessage(false, true, false); break;
        case 'break' :
        default :
            showEndMessage(false, false, true);
        }
    showElements(true);
    }
function check() {
    /* Gets letter and checks if correct */
    VARIABLES.letterValue = ELEMENTS.letter.value.toLowerCase();
    if (VARIABLES.letterValue.length == 0 || VARIABLES.usedLetters.some(e => e == VARIABLES.letterValue))
        return;
    
    /* Stacks letter, clears input and tests the letter */
    VARIABLES.usedLetters.push(VARIABLES.letterValue);
    ELEMENTS.letter.value = '';
    let lengthCheck = 0;
    for (let i = 0; i < VARIABLES.word.length; i++)
        if (VARIABLES.word.at(i) !== VARIABLES.letterValue)
            lengthCheck++;

    /* Negative result */
    if (lengthCheck == VARIABLES.word.length) {
        VARIABLES.negative++;
        showImage(VARIABLES.negative);
        if (VARIABLES.loseValue <= VARIABLES.negative)
            endGame('lose');
        }
        
    /* Positive result */
    else {
        let matchingPlaces = document.getElementsByClassName(VARIABLES.letterValue);
        for (let i = 0; i < matchingPlaces.length; i++) {
            matchingPlaces[i].textContent = VARIABLES.letterValue;
            VARIABLES.positive++;
            }
        if (VARIABLES.word.length <= VARIABLES.positive)
            endGame('win');
        }
    }
function loadImages() {
    /* Loads and prepares images */
    let imageSpace = document.getElementById('picture');
    for (let i = 0, img = null; i <= VARIABLES.loseValue; i++) {
        img = document.createElement('img');
        imageSpace.appendChild(img);
        img.src = `img/${i}.png`;
        img.alt = `Wisielec ${i} stopień`;
        img.id = `img-${i}`;
        img.classList.add('hidden');
        ELEMENTS.img.push(img);
        }
    }
function colorText() {
    /* Colors the text */
    const TEXT = [];
    for (let letter of ELEMENTS.win.innerText)
        TEXT.push(`<span>${letter}</span>`);
    ELEMENTS.win.innerHTML = TEXT.join('');
    }
function assignButtons() {
    /* Assigns the buttons */
    document.getElementById('letter').addEventListener('keydown', event => {
        if (event.key === 'Enter')
            check();
        });
    document.getElementById('check-button').addEventListener('click', check);
    document.getElementById('end-button').addEventListener('click', () => {
        endGame('break');
        });
    document.getElementById('info-box-button-left').addEventListener('click', () => {
        cleanUp();
        setUp();
        showElements(false);
        });
    document.getElementById('info-box-button-right').addEventListener('click', exit);
    }
function load() {
    loadImages();
    colorText();
    assignButtons();
    cleanUp();
    setUp();
    }
window.addEventListener('load', load);