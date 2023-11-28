const createTournamentBtn = document.getElementById('create-tournament-btn');
const participantInput = document.getElementById('participant-input');
const enterButton = document.getElementById('enter-participant');
const adminKey = document.getElementById('admin-key');
let popup = document.getElementById("myPopup");


// Hide the participant input and enter button initially
participantInput.style.display = 'none';
enterButton.style.display = 'none';

createTournamentBtn.addEventListener('click', async function() {
    // Show the participant input and enter button
    const response = await fetch('/create-tournament', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });

    const data = await response.json();
    if(data.message = "Tournament created!"){
        participantInput.style.display = 'block';
        enterButton.style.display = 'block';
        popup.message = data.message;
        popup.add("show")
    } else {
        popup.message = data.message;
        popup.add("show")
    }
    
    participantInput.value = '';
});

enterButton.addEventListener('click', async function() {
    const participantName = participantInput.value;
    const response = await fetch('/add-player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({participantName}),
    });

    const data = await response.json();
    let popupMessage = data.message;

    popup.message = popupMessage;
    popup.add("show")
    //show popup

})
            


createTournamentBtn.addEventListener('click', function() {
    const participantName = participantInput.value;
    // Perform necessary actions with the participant name
    console.log('Participant Name:', participantName);
    // Clear the input field
    participantInput.value = '';
});