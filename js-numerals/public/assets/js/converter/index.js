import { numberToWordMain } from './modules/index.js';

/* -------------------------------------------------------------------------- */
/*                       call function with each keyup                        */
/* -------------------------------------------------------------------------- */
const numberInput = document.getElementById('number');
const wordsTag = document.getElementById('words');
numberInput.onkeyup = function() {
    wordsTag.innerHTML = numberToWordMain(numberInput.value);
};
