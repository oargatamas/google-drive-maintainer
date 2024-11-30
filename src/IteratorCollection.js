// V8 runtime
class IteratorCollection{

  constructor(tokens, type) {
    this.iterators = tokens.map(token => type.toUpperCase() === 'FOLDER'? DriveApp.continueFolderIterator(token) : DriveApp.continueFileIterator(token));
    this.type = type
  }

  addIterator(iterator){
    if(Array.isArray(iterator)){
      this.iterators = this.iterators.concat(iterator);
    }else{
      this.iterators.push(iterator);
    }
  }

  hasNext(){
    const iterator = this.findIterator();
    return iterator === undefined ? false : iterator.hasNext();
  }

  next(){
    const iterator = this.findIterator();
    if(iterator === undefined){
      throw Error('None of the iterators are containing elements.');
    }
    return iterator.next();
  }

  findIterator(){
    return this.iterators.find(iterator => iterator.hasNext());
  }

  getContinuationToken(){
    return JSON.stringify(this.iterators.map(iterator => iterator.getContinuationToken()));
  }

  static folderIterator(){
    return new IteratorCollection([],"FOLDER");
  }

  static fileIterator(){
    return new IteratorCollection([],"FILE");
  }

  static continueFolderIterator(token){
    return new IteratorCollection(JSON.parse(token), "FOLDER");
  }

  static continueFileIterator(token){
    return new IteratorCollection(JSON.parse(token), "FILE");
  }
}