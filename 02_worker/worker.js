onmessage = function(messageObject) {

  var message = messageObject.data;
  switch (message) {
    case 'hello worker':
      postMessage('hello main!');
      break;
    case 'please send array buffer':
      sendArrayBuffer();
      break;
    case 'please crash':
      throw new Error("I crashed");
      break;
  }
}

function sendArrayBuffer() {
  var buffer = new ArrayBuffer(100);
  var int16View = new Uint16Array(buffer, 0, 20);

  for (var i = 0; i < int16View.length; i++) {
    int16View[i] = i;
  }

  console.log('array buffer size', buffer.byteLength);
  postMessage(buffer, [buffer]);
  console.log('array buffer size?', buffer.byteLength);
}
