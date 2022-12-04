export function numberConverter(number) {
    let numRound = null;
    let numString = '';

    // Якщо рейтинг від 0 до 10 не включно
    // але цілі числа
    if (number.toString().length === 1) {
        numString = String(number) + ".0";
        return numString;
    }

    // Якщо рейтинг від 0 до 10 не включно
    // але не цілі числа
    if (number / 10 < 1) {
        numRound = (Math.round(number * 10) / 10).toString();
        if (numRound.length === 1) {
            numString = String(numRound) + ".0";
            return numString;
        }
        numString = String(numRound).padEnd(3, '0');
        return numString;
    }

    if (number === 10) {
        return '10.0';
    }

    if (number > 10) {
        numRound = (Math.round(number * 10) / 10).toString();
        return numRound;
    }
}

