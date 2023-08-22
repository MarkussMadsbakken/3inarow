var source = new EventSource("/serverMessages");

source.onmessage = function(message){
    console.log(message.data)
}

function displayGames(games){
    document.getElementById("showgames").innerHTML = "";
    Object.keys(games).forEach(game => {
        document.getElementById("showgames").innerHTML = document.getElementById("showgames").innerHTML + "<div class = 'gameBox'>" + "<div class = 'owner'>"+games[game].owner +"</div>"+ "<div class = 'users'>"+games[game].users +"</div>"+"<div class = 'users'>"+game +"</div>"+ '<button id = "join" type = "button" onclick="join('+"'"+game+"'"+')"> join </button>' +"</div>"
    });
}

function sendMessage(link, cb){
    let xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST",link ,true); //man setter url til meldingen
    xhp.send();

    xhp.timeout = 2000;
  
    xhp.onload = () => {
      	console.log(xhp.response)
      	cb(xhp.response);
	  	return
    }
    
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      	console.log("timeout, try again");
		return
    }

}

function fetchGames(){
    //returnerer test data
    //let data = {"KLDM":{"users":"1/2","owner":"test"},"ANCD":{"users":"5/8","owner":"test2"}};
    let games = sendMessage("/getgames/", function(res){
		displayGames(JSON.parse(games))
	})
}

function join(gameid){
    window.location.href = "/game/"+gameid;
}

function makegame(){
    sendMessage("/creategame/", function(res){
      	if (res.includes("id:")){
        	fetchGames();
		}
	});
}

//window.setInterval(fetchGames,5000) //henter spill hvert femte sekund

fetchGames();

