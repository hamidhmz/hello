import { numberToWordMain } from '../public/assets/js/converter/modules/index.js';

// NOTE: these are not special numbers these are just random numbers
describe('Convert number to word', () => {
    it('should return zero', () => {
        expect(numberToWordMain('0')).toBe('zero');
    });
    it('it should return word of one digit number', () => {
        expect(numberToWordMain('5')).toBe('five');
        expect(numberToWordMain('1')).toBe('one');
    });
    it('should return word of two digit number less than 20', () => {
        expect(numberToWordMain('11')).toBe('eleven');
        expect(numberToWordMain('19')).toBe('nineteen');
        expect(numberToWordMain('15')).toBe('fifteen');
        expect(numberToWordMain('10')).toBe('ten');
    });
    it('should return word of two digit number bigger than 20', () => {
        expect(numberToWordMain('20')).toBe('twenty');
        expect(numberToWordMain('54')).toBe('fifty four');
        expect(numberToWordMain('73')).toBe('seventy three');
        expect(numberToWordMain('96')).toBe('ninety six');
    });
    it('should return word of three digit number ', () => {
        expect(numberToWordMain('100')).toBe('one hundred');
        expect(numberToWordMain('394')).toBe('three hundred and ninety four');
        expect(numberToWordMain('568')).toBe('five hundred and sixty eight');
    });
    it('should return word of four digit number ', () => {
        expect(numberToWordMain('1000')).toBe('one thousand');
        expect(numberToWordMain('2458')).toBe(
            'two thousand four hundred and fifty eight'
        );
        expect(numberToWordMain('4896')).toBe(
            'four thousand eight hundred and ninety six'
        );
        expect(numberToWordMain('6878')).toBe(
            'six thousand eight hundred and seventy eight'
        );
        expect(numberToWordMain('1579')).toBe(
            'one thousand five hundred and seventy nine'
        );
        expect(numberToWordMain('8618')).toBe(
            'eight thousand six hundred and eighteen'
        );
        expect(numberToWordMain('9900')).toBe('nine thousand nine hundred');
    });

    it('should return word of octillion number', () => {
        expect(numberToWordMain('158496358785200664887862315154')).toBe(
            'one hundred fifty eight octillion four hundred ninety six septillion three hundred fifty eight sextillion seven hundred eighty five quintillion two hundred quadrillion six hundred sixty four trillion eight hundred eighty seven billion eight hundred sixty two million three hundred fifteen thousand one hundred and fifty four'
        );
        expect(numberToWordMain('9000000000000000000000000000')).toBe(
            'nine octillion'
        );
        expect(numberToWordMain('90000000000000000000000000000')).toBe(
            'ninety octillion'
        );
        expect(numberToWordMain('900000000000000000000000000000')).toBe(
            'nine hundred octillion'
        );
    });
    it('should return word of septillion number', () => {
        expect(numberToWordMain('158496358785200664887862315')).toBe(
            'one hundred fifty eight septillion four hundred ninety six sextillion three hundred fifty eight quintillion seven hundred eighty five quadrillion two hundred trillion six hundred sixty four billion eight hundred eighty seven million eight hundred sixty two thousand three hundred and fifteen'
        );
        expect(numberToWordMain('9000000000000000000000000')).toBe(
            'nine septillion'
        );
        expect(numberToWordMain('90000000000000000000000000')).toBe(
            'ninety septillion'
        );
        expect(numberToWordMain('900000000000000000000000000')).toBe(
            'nine hundred septillion'
        );
    });
    it('should return word of sextillion number', () => {
        expect(numberToWordMain('158496358785200664887862')).toBe(
            'one hundred fifty eight sextillion four hundred ninety six quintillion three hundred fifty eight quadrillion seven hundred eighty five trillion two hundred billion six hundred sixty four million eight hundred eighty seven thousand eight hundred and sixty two'
        );
        expect(numberToWordMain('6000000000000000000000')).toBe('six sextillion');
        expect(numberToWordMain('60000000000000000000000')).toBe(
            'sixty sextillion'
        );
        expect(numberToWordMain('600000000000000000000000')).toBe(
            'six hundred sextillion'
        );
    });
    it('should return word of quintillion number', () => {
        expect(numberToWordMain('158496358785200664887')).toBe(
            'one hundred fifty eight quintillion four hundred ninety six quadrillion three hundred fifty eight trillion seven hundred eighty five billion two hundred million six hundred sixty four thousand eight hundred and eighty seven'
        );
        expect(numberToWordMain('3000000000000000000')).toBe('three quintillion');
        expect(numberToWordMain('80000000000000000000')).toBe(
            'eighty quintillion'
        );
        expect(numberToWordMain('500000000000000000000')).toBe(
            'five hundred quintillion'
        );
    });
    it('should return word of quadrillion number', () => {
        expect(numberToWordMain('158496358785200664')).toBe(
            'one hundred fifty eight quadrillion four hundred ninety six trillion three hundred fifty eight billion seven hundred eighty five million two hundred thousand six hundred and sixty four'
        );
        expect(numberToWordMain('1000000000000000')).toBe('one quadrillion');
        expect(numberToWordMain('60000000000000000')).toBe('sixty quadrillion');
        expect(numberToWordMain('200000000000000000')).toBe(
            'two hundred quadrillion'
        );
    });
    it('should return word of trillion number', () => {
        expect(numberToWordMain('158496358785200')).toBe(
            'one hundred fifty eight trillion four hundred ninety six billion three hundred fifty eight million seven hundred eighty five thousand two hundred'
        );
        expect(numberToWordMain('3000000000000')).toBe('three trillion');
        expect(numberToWordMain('50000000000000')).toBe('fifty trillion');
        expect(numberToWordMain('700000000000000')).toBe(
            'seven hundred trillion'
        );
    });
    it('should return word of billion number', () => {
        expect(numberToWordMain('158496358785')).toBe(
            'one hundred fifty eight billion four hundred ninety six million three hundred fifty eight thousand seven hundred and eighty five'
        );
        expect(numberToWordMain('2000000000')).toBe('two billion');
        expect(numberToWordMain('60000000000')).toBe('sixty billion');
        expect(numberToWordMain('100000000000')).toBe('one hundred billion');
    });
    it('should return word of million number', () => {
        expect(numberToWordMain('158496358')).toBe(
            'one hundred fifty eight million four hundred ninety six thousand three hundred and fifty eight'
        );
        expect(numberToWordMain('5000000')).toBe('five million');
        expect(numberToWordMain('20000000')).toBe('twenty million');
        expect(numberToWordMain('700000000')).toBe('seven hundred million');
    });
    it('should return word of thousand number', () => {
        expect(numberToWordMain('158496')).toBe(
            'one hundred fifty eight thousand four hundred and ninety six'
        );
        expect(numberToWordMain('80000')).toBe('eighty thousand');
        expect(numberToWordMain('500000')).toBe('five hundred thousand');
    });
    it('should return word of negative number', () => {
        expect(numberToWordMain('-1')).toBe('negative one');
        expect(numberToWordMain('-88')).toBe('negative eighty eight');
        expect(numberToWordMain('-1000')).toBe('negative one thousand');
        expect(numberToWordMain('-105.18')).toBe(
            'negative one hundred and five point one eight'
        );
        expect(numberToWordMain('-1052.1')).toBe(
            'negative one thousand fifty two point one'
        );
    });
    it('should return word of float number', () => {
        expect(numberToWordMain('88.5484')).toBe(
            'eighty eight point five four eight four'
        );
        expect(numberToWordMain('752.114')).toBe(
            'seven hundred and fifty two point one one four'
        );
        expect(numberToWordMain('0.15')).toBe('zero point one five');
    });
});
