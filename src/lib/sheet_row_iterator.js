// V8 runtime
class SheetRowIterator {
    constructor(dataSheet, position = '0') {
        this.dataSheet = dataSheet;
        this.position = JSON.parse(position);
    }

    hasNext() {
        return this.dataSheet.getLastRow() > this.position;
    }

    next() {
        const nextRow = this.dataSheet.getRow(this.position)

        this.position++;
        return nextRow.getValues();
    }

    getContinuationToken() {
        return JSON.stringify(this.position);
    }
}