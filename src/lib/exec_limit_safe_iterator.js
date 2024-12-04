function exec_limit_safe_iterator(options, itemProcessor) {
    const properties = FilePropertiesService.getFileProperties();
    const tokenKey = options.iterationTokenKey;
    const prefix = [tokenKey, ' - '].join('');
    const continuationToken = properties.getProperty(tokenKey);
    console.log(prefix + "Iteration token: " + continuationToken);

    const maxTime = options.maxTime;
    const start = new Date();
    let end = new Date();

    let iterator;

    if (continuationToken == null) {
        console.log(prefix + "No continuation token set for the execution. Initialising new iteration.");
        iterator = options.iterator();
    } else {
        console.log(prefix + "Continue previous iteration. Token: " + continuationToken);
        iterator = options.continueIterator(continuationToken);
    }

    while (iterator.hasNext() && end.getTime() - start.getTime() <= maxTime) {
        const item = iterator.next();
        itemProcessor(item);
        end = new Date();
    }

    if (iterator.hasNext()) {
        console.log(prefix + "Time execution limit reached. Saving iteration state to continuation token.")
        properties.setProperty(tokenKey, iterator.getContinuationToken());
    } else {
        console.log(prefix + "Iteration finished. Removing continuation token.")
        properties.deleteProperty(tokenKey);
    }
}

