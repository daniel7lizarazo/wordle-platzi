import { fromEvent } from "rxjs";
import WORDS_LIST from './words.json';

const letterRows = document.getElementsByClassName('letter-row');
const messageText = document.getElementById('message-text');
const restartButton = document.getElementById('restart-button');
const onKeyDown$ = fromEvent(document, 'keyup');
let rowIndex = 0;
let columnIndex = 0;
let gameOver = false;

let randomWord = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];

console.log(randomWord);

const pressKey = {
    next: (event) => {
        if(gameOver) return;
        if(event.key.match(/[a-z]/i) && event.key.length === 1) {
            letterPressed(event.key);
            return;
        };
        if(event.key === 'Backspace') {
            backspacePressed();
            return;
        };
        if(event.key === 'Enter'){
            enterPressed();
            return;
        }
        
    },
    error: (err) => console.error(err),
    complete: () => console.log('thas it'),
}

function letterPressed(letter){
    if(columnIndex > 4) return;
    let letterBox = Array.from(letterRows)[rowIndex].children[columnIndex];
    letterBox.classList.add('filled-letter');
    letterBox.textContent = letter.toUpperCase();
    columnIndex+=1;
}

function backspacePressed(){
    if(columnIndex <= 0) return;
    columnIndex-=1;
    let letterBox = Array.from(letterRows)[rowIndex].children[columnIndex];
    letterBox.textContent = '';
    letterBox.classList.remove('filled-letter');
}

function enterPressed(){
    if(columnIndex <= 4) {
        const letrasFaltantes = 5 - columnIndex;
        messageText.textContent = `Te falta${letrasFaltantes == 1 ? '' : 'n'} ${letrasFaltantes} letra${letrasFaltantes == 1 ? '' : 's'}`;
        return;
    }
    let answerArray = randomWord.split('');
    const playerRows = Array.from(letterRows)[rowIndex].children
    let arrayPerfect = [];
    for(let i = 0; i <= 4; i++){
        if(answerArray[i] === playerRows[i].innerHTML){
            arrayPerfect.push(i);
            answerArray[i] = '';
            playerRows[i].classList.add('letter-green')
        }
    }
    for(let i = 0; i <= 4; i++){
        if(arrayPerfect.includes(i)) continue;
        const inperfectIndex = answerArray.indexOf(playerRows[i].innerHTML);
        if(inperfectIndex >= 0){
            answerArray[inperfectIndex] = '';
            playerRows[i].classList.add('letter-yellow')
            continue;
        }
        playerRows[i].classList.add('letter-grey')
    }

    if(arrayPerfect.length == 5) {
        messageText.textContent = '¡¡¡HAS GANADO!!!';
        restartButton.disabled = false;
        gameOver = true;
        return;
    }

    if(rowIndex >= 5){
        messageText.textContent = `Has perdido, la palabra era ${randomWord.toUpperCase()}`;
        restartButton.disabled = false;
        gameOver = true;
        return;
    }

    messageText.textContent = '¡Sigue intentandolo!';
    rowIndex+=1;
    columnIndex = 0;
}

const onRestart$ = fromEvent(restartButton, 'click');

const restart = () => {
    const elements = Array.from(letterRows);
    for(let i = 0; i <= rowIndex; i ++){
        for(let j = 0; j < elements[i].children.length; j ++){
           elements[i].children[j].classList = ['letter'];
           elements[i].children[j].textContent = '';
        }
    };
    rowIndex = 0;
    columnIndex = 0;
    randomWord = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];    
    restartButton.disabled = true;
    gameOver = false;
}

onRestart$.subscribe(restart);
onKeyDown$.subscribe(pressKey);