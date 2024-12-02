function exec_limit_safe_iterator(options, itemProcessor){
    const properties = File_properties_service.getFileProperties();
    const tokenKey = options.iterationTokenKey;
    const prefix = [tokenKey, ' - '].join('');
    const mode = options.useFileIterator ? "FILE" : "FOLDER";
    const continuationToken = properties.getProperty(tokenKey);
    console.log(prefix + "Iteration token: " + continuationToken);

    const maxTime = options.maxTime;
    const start = new Date();
    let end = new Date();

    let iterator;

    if(continuationToken == null ){
        console.log(prefix + "No continuation token set for the execution. Initalising new iteration. Mode " + mode);
        iterator = options.useFileIterator ? Iterator_collection.fileIterator() : Iterator_collection.folderIterator();
        iterator.addIterator(options.iterator());
    }else{
        console.log(prefix + "Continue previous iteration. Mode " + mode);
        iterator = options.useFileIterator ? Iterator_collection.continueFileIterator(continuationToken) : Iterator_collection.continueFolderIterator(continuationToken);
    }

    while (iterator.hasNext() && end.getTime() - start.getTime() <= maxTime) {
        const item = iterator.next();
        itemProcessor(item);

        if(!options.useFileIterator && options.enableSubFolderIteration && item.getFolders().hasNext()){
            console.log("Subfolder iteration enabled and folder " + item.getName() + " - " + item.getId() +  " has subfolder. Extending iteration set.");
            iterator.addIterator(item.getFolders());
        }

        end = new Date();
    }

    if(iterator.hasNext()){
        console.log(prefix + "Time execution limit reached. Saving iteration state to continuation token.")
        properties.setProperty(tokenKey, iterator.getContinuationToken());
    } else {
        console.log(prefix + "Iteration finished. Removing continuation token.")
        properties.deleteProperty(tokenKey);
    }
}