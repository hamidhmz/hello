/*
 
    __ _             _     _                                _ 
   / _| | ___   __ _| |_  | |_ ___   __      _____  _ __ __| |
  | |_| |/ _ \ / _` | __| | __/ _ \  \ \ /\ / / _ \| '__/ _` |
  |  _| | (_) | (_| | |_  | || (_) |  \ V  V / (_) | | | (_| |
  |_| |_|\___/ \__,_|\__|  \__\___/    \_/\_/ \___/|_|  \__,_|
                                                              
 
*/

export function floatToWord(float, getD1, units) {
    return float.reduce((result, value, i) => {
        let tempResult = '';
        [...value].forEach(element => {
            tempResult += getD1(element, 0, units);
        });
        return 'point ' + tempResult;
    }, '');
}
