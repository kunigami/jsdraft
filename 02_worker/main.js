function simpleMessaging() {
  var myWorker = new Worker("worker.js");
  myWorker.postMessage('hello worker');
  myWorker.onmessage = function(e) {
    console.log('Message received from worker: ' + e.data);
  };
}

function tranferrableObjects() {
  var myWorker = new Worker("worker.js");
  myWorker.postMessage('please send array buffer');
  myWorker.onmessage = function(e) {
    buffer = e.data;
    // Number of bytes or number of elements
    var int32View = new Uint32Array(buffer, 0, 10);
    console.log('int32 view length: ' + int32View.length);
    for (var i = 0; i < int32View.length; i++) {
      console.log("Entry " + i + ": " + int32View[i]);
    }
  }
}

function errorHandling() {
  var myWorker = new Worker("worker.js");
  myWorker.postMessage('please crash');
  myWorker.onerror = function(e) {
    console.log('an error occurred', e);
    e.preventDefault();
  }
}

// Test examples
simpleMessaging();
tranferrableObjects();
errorHandling();
