Document.getElementById("test_button").onclick = function(){test("test")};

function test(message){
    console.log(message);
    // Sending messages, a simple POST

    function sendMessage(message) {
      fetch(url, {
        method: 'POST',
        body: message
      });
    }
  
    form.onsubmit = function() {
      let message = form.message.value;
      if (message) {
        form.message.value = '';
        sendMessage(message);
      }
      return false;
    };
}

function ssetest(){
    Document.getElementById("sse_test").innerHTML = "test"
}