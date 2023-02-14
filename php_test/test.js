

const evtSource = new EventSource("test.php");


evtSource.addEventListener("ping", (event) => {
    /*
    const newElement = document.createElement("li");
    const eventList = document.getElementById("list");
    const time = JSON.parse(event.data).time;
    newElement.textContent = `ping at ${time}`;
    eventList.appendChild(newElement);
    */

    console.log(`message:${event.data}`)

  });
