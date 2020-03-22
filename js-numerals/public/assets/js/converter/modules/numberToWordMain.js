/*
 
                         _                 _                                _                   _        
   _ __  _   _ _ __ ___ | |__   ___ _ __  | |_ ___   __      _____  _ __ __| |  _ __ ___   __ _(_)_ __   
  | '_ \| | | | '_ ` _ \| '_ \ / _ \ '__| | __/ _ \  \ \ /\ / / _ \| '__/ _` | | '_ ` _ \ / _` | | '_ \  
  | | | | |_| | | | | | | |_) |  __/ |    | || (_) |  \ V  V / (_) | | | (_| | | | | | | | (_| | | | | | 
  |_| |_|\__,_|_| |_| |_|_.__/ \___|_|     \__\___/    \_/\_/ \___/|_|  \__,_| |_| |_| |_|\__,_|_|_| |_| 
                                                                                                         
 
*/
import {
    validate,
    removeAdditionalChar,
    splitFloatAndInt,
    stringNumberToArray,
    intToWord,
    createFinalResult,
    negativeDetector,
    floatDetectAndToWord,
    removeNegativeSign
} from './index.js';

/***************************
 * INPUT MUST BE IN STRING *
 ***************************/
export function numberToWordMain(num) {
    if (!validate(num)) return 'not valid input';

    const strNumber = removeAdditionalChar(num);

    const { strFloat, strInt } = splitFloatAndInt(strNumber);

    const negative = negativeDetector(strInt); //return true or false //

    const positiveIntStr = removeNegativeSign(strInt);// if exists

    const strIntOfArr = stringNumberToArray(positiveIntStr);

    const intWord = intToWord(strIntOfArr);

    const floatWord = floatDetectAndToWord(strFloat); //return number or ''

    return createFinalResult(negative, intWord, floatWord);
}
