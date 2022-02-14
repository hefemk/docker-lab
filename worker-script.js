const { parentPort, isMainThread } = require('worker_threads');

if (!isMainThread) {
    let temp = 0;
    const startTime = new Date();
    const endTime = new Date();
    endTime.setMinutes(startTime.getMinutes() + 1);
    
    while (true) {
        const now = new Date();
        if (now < endTime) {
            temp += Math.random() * Math.random();
        } else {
            console.log('stress stop.');
            break;
        }
    }
    
    parentPort.postMessage('');    
}
