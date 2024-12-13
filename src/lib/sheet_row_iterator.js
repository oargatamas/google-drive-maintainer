// V8 runtime
class SheetRowIterator {
    constructor(dataSheet, position = '0') {
        this.data = dataSheet.getDataRange()
            .getValues()
            .filter(value => value[0] !== '');
        this.position = JSON.parse(position);
    }

    hasNext() {
        return this.data.length > this.position;
    }

    next() {
        const next_row = this.data[this.position];
        this.position++;
        return next_row;
    }

    getContinuationToken() {
        return JSON.stringify(this.position);
    }
}