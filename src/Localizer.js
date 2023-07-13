export default class Localizer {

    /**
     * Formats a number with a specified number of significant digits.
     *
     * @param {Float} number A number
     * @param {Float} precision The number of significant digits
     * @return {String} Returns the number with a specified number of significant digits
     * @see https://github.com/pbo-dpb/readyreckoner.ca/blob/e237358123a46ea3583376eb55c0cfc0bbe2bc39/app/assets/javascripts/application.js#L45-L49
     */
    static roundCurrency(number, precision = 2) {
        var digits = number ? Math.floor(Math.log(Math.abs(number)) / Math.log(10) + 1) : 1
            , multiplier = Math.pow(10, digits - precision);
        return Math.round(number / multiplier) * multiplier;
    }

    static formatNumber(number, style = "countable") {

        const locale = `${document.documentElement.lang}-CA`;
        switch (style) {
            case 'currency':
                return new Intl.NumberFormat(locale, { style: 'currency', "currency": "CAD", maximumFractionDigits: 0, notation: 'compact' }).format(number);
            case 'percent':
                return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2, notation: 'compact' }).format(number / 100);
        }

        // countable
        return new Intl.NumberFormat(locale).format(number);
    }

    static cleanupNumber(number) {
        return +number.replace(/[^\d.-]/g, '');
    }



}