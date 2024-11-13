'use strict';
/* Variables for the game */
const variables = Object.seal({
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
const elements = Object.freeze({
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
    for (let img of elements.img)
        img.classList.add('hidden');
    elements.img[imageNumber].classList.remove('hidden');
    }
function cleanUp() {
    /* Clears variables and elements */
    [variables.positive, variables.negative, variables.usedLetters] = [0, 0, []];
    showImage(0);
    elements.wordOutput.innerHTML = '';
    }
function setUp() {
    /* Chooses word and preperes elements */
    variables.word = variables.wordList[Math.floor(Math.random() * variables.wordList.length)].split('');
    for (let i = 0, span = null; i < variables.word.length; i++) {
        span = document.createElement('span');
        span.className = variables.word.at(i);
        span.innerText = '_';
        elements.wordOutput.appendChild(span);
        }
    }
function showElements(styleValue) {
    /* Shows and hides overlay and info box */
    if (styleValue) {
        elements.infoBox.classList.remove('hidden');
        elements.overlay.classList.remove('hidden');
        elements.infoBox.classList.remove('anima-box-out');
        elements.infoBox.classList.add('anima-box-in');
        elements.overlay.classList.remove('anima-overlay-out');
        elements.overlay.classList.add('anima-overlay-in');
        }
    else {
        elements.infoBox.classList.add('anima-box-out');
        elements.infoBox.classList.remove('anima-box-in');
        elements.overlay.classList.add('anima-overlay-out');
        elements.overlay.classList.remove('anima-overlay-in');
        setTimeout(() => {
            elements.infoBox.classList.add('hidden');
            elements.overlay.classList.add('hidden');
            }, variables.animationTime);
        }
    }
function visStyle(bool, elem) {
    bool ?
        elements[elem].classList.remove('hidden') :
        elements[elem].classList.add('hidden');
    }
function showEndMessage(win, lose, end) {
    /* Manages info box */
    visStyle(win, 'win');
    visStyle(lose, 'lose');
    visStyle(end, 'end');
    }
function endGame(endType) {
    /* Ends the game */
    elements.gameWord.innerText = variables.word.join('');
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
    variables.letterValue = elements.letter.value.toLowerCase();
    if (variables.letterValue.length == 0 || variables.usedLetters.some(e => e == variables.letterValue))
        return;
    
    /* Stacks letter, clears input and tests the letter */
    variables.usedLetters.push(variables.letterValue);
    elements.letter.value = '';
    let lengthCheck = 0;
    for (let i = 0; i < variables.word.length; i++)
        if (variables.word.at(i) !== variables.letterValue)
            lengthCheck++;

    /* Negative result */
    if (lengthCheck == variables.word.length) {
        variables.negative++;
        showImage(variables.negative);
        if (variables.loseValue <= variables.negative)
            endGame('lose');
        }
        
    /* Positive result */
    else {
        let matchingPlaces = document.getElementsByClassName(variables.letterValue);
        for (let i = 0; i < matchingPlaces.length; i++) {
            matchingPlaces[i].textContent = variables.letterValue;
            variables.positive++;
            }
        if (variables.word.length <= variables.positive)
            endGame('win');
        }
    }
function loadImages() {
    /* Loads and prepares images */
    let imageSpace = document.getElementById('picture');
    for (let i = 0, img = null; i <= variables.loseValue; i++) {
        img = document.createElement('img');
        imageSpace.appendChild(img);
        img.src = `img/${i}.png`;
        img.alt = `Wisielec ${i} stopień`;
        img.id = `img-${i}`;
        img.classList.add('hidden');
        elements.img.push(img);
        }
    }
function colorText() {
    /* Colors the text */
    const text = [];
    for (const letter of elements.win.innerText)
        text.push(`<span>${letter}</span>`);
    elements.win.innerHTML = text.join('');
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