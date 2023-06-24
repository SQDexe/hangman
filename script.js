
/* Options */
const variables = Object.seal({
    loseValue: 10,
    wordList: ["biedronka","dinozaur","drzewa","jabłko","jaszczurka","kamień","konstantynopolitańczykowianeczka","kosmos","kościół","kot","kwiatek","las","miasto","motyl","niebo","pies","polana","ryba","samochód","sklep","słońce","trawa","ulica","wiatr","woda"],
    word: "",
    letterValue: "",
    usedLetters: [],
    positive: 0,
    negative: 0
    });
const elements = Object.freeze({
    wordOutput: document.getElementById("word-space"),
    gameWord: document.getElementById("game-word"),
    letter: document.getElementById("letter"),
    win: document.getElementById("win-message"),
    lose: document.getElementById("lose-message"),
    end: document.getElementById("end-message"),
    infoBox: document.getElementById("info-box"),
    overlay: document.getElementById("overlay"),
    img: []
    });
/* --- */
exit = () => {
    window.location = "http://sqdexe.github.io/";
    }
showImage = imageNumber => {	
    for (let i = 0; i <= variables.loseValue; i++) elements.img[i].classList.add("hidden");
    elements.img[imageNumber].classList.remove("hidden");
    }
cleanUp = () => {
    variables.positive = 0, variables.negative = 0;
    variables.usedLetters = [];
    showImage(0);
    elements.wordOutput.innerHTML = "";
    }
setUp = () => {
    variables.word = variables.wordList[Math.floor(Math.random() * variables.wordList.length)].split("");
    for (let i = 0; i < variables.word.length; i++) {
        let span = document.createElement("span");
        span.className = variables.word.at(i);
        span.innerText = "_";
        elements.wordOutput.appendChild(span);
        }
    }
showElements = styleValue => {
    if (styleValue) {
        elements.infoBox.classList.remove("hidden");
        elements.overlay.classList.remove("hidden");
        elements.infoBox.classList.remove("anima-box-out");
        elements.infoBox.classList.add("anima-box-in");
        elements.overlay.classList.remove("anima-overlay-out");
        elements.overlay.classList.add("anima-overlay-in");
        }
    else {
        elements.infoBox.classList.add("anima-box-out");
        elements.infoBox.classList.remove("anima-box-in");
        elements.overlay.classList.add("anima-overlay-out");
        elements.overlay.classList.remove("anima-overlay-in");
        setTimeout(() => {
            elements.infoBox.classList.add("hidden");
            elements.overlay.classList.add("hidden");
            }, Number.parseFloat(getComputedStyle(document.querySelector(":root")).getPropertyValue("--animation-time")) * 1000);
        }
    }
visStyle = (bool, elem) => bool ? elements[elem].classList.remove("hidden") : elements[elem].classList.add("hidden");
showEndMessage = (win, lose, end) => {
    visStyle(win, "win");
    visStyle(lose, "lose");
    visStyle(end, "end");
    }
endGame = endType => {
    elements.gameWord.innerText = variables.word.join("");
    if (endType == "win") showEndMessage(true, false, false);
    else if (endType == "lose") showEndMessage(false, true, false);
    else showEndMessage(false, false, true);
    showElements(true);
    }
check = () => {
    variables.letterValue = elements.letter.value.toLowerCase();
    if (variables.letterValue.length == 0) return;
    for (let i = 0; i < variables.usedLetters.length; i++) if (variables.letterValue == variables.usedLetters[i]) return;
    variables.usedLetters.push(variables.letterValue);
    elements.letter.value = "";
    let lengthCheck = 0;
    for (let i = 0; i < variables.word.length; i++) if (variables.word.at(i) != variables.letterValue) lengthCheck++;
    if (lengthCheck == variables.word.length) {
        variables.negative++;
        showImage(variables.negative);
        if (variables.loseValue <= variables.negative) endGame("lose");
        }
    else {
        let matchingPlaces = document.getElementsByClassName(variables.letterValue);
        for (let i = 0; i < matchingPlaces.length; i++) {
            matchingPlaces[i].textContent = variables.letterValue;
            variables.positive++;
            }
        if (variables.word.length <= variables.positive) endGame("win");
        }
    }
loadImages = () => {
    let imageSpace = document.getElementById("picture");
    for (let i = 0; i <= variables.loseValue; i++) {
        let img = document.createElement("img");
        imageSpace.appendChild(img);
        img.src = `content/${i}.png`;
        img.alt = `Wisielec ${i} stopień`;
        img.id = `img-${i}`;
        img.classList.add("hidden");
        elements.img.push(img);
        }
    }
assignButtons = () => {
    document.getElementById("letter").addEventListener("keydown", Event => {
        if (Event.key == "Enter") check();
        });
    document.getElementById("check-button").addEventListener("click", check);
    document.getElementById("end-button").addEventListener("click", () => {
        endGame("break");
        });
    document.getElementById("info-box-button-left").addEventListener("click", () => {
        cleanUp();
        setUp();
        showElements(false);
        });
    document.getElementById("info-box-button-right").addEventListener("click", exit);
    }
load = () => {
    loadImages();
    assignButtons();
    cleanUp();
    setUp();
    }
window.addEventListener("load", load /*for (let elem of Array.from(document.getElementsByTagName("script"))) elem.remove();*/);