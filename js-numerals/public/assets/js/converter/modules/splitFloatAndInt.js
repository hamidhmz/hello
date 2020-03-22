export function splitFloatAndInt(strNumber) {
    return {
        strInt: strNumber.split('.')[0],
        strFloat: strNumber.split('.')[1]
    };
}
