/*
 
              _   _                
    __ _  ___| |_| |_ ___ _ __ ___ 
   / _` |/ _ \ __| __/ _ \ '__/ __|
  | (_| |  __/ |_| ||  __/ |  \__ \
   \__, |\___|\__|\__\___|_|  |___/
   |___/                           
 
*/

/* -------------------------------------------------------------------------- */
/*                               get from array                               */
/* -------------------------------------------------------------------------- */

export function getD1(index, i, units) {
    return units[index][i];
}

export function getD2(index, units) {
    return units[index][2];
}

export function getD3(index, units) {
    return getD1(index, 0, units) !== ''
        ? getD1(index, 0, units) + 'hundred '
        : '';
}
