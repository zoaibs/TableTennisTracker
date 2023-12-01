const createTournamentBtn = document.getElementById('create-tournament-btn');
const participantInput = document.getElementById('participant-input');
const enterButton = document.getElementById('enter-participant');
const adminKey = document.getElementById('admin-key');
let popup = document.getElementById("myPopup");
let tournamentMembers = [];


// Hide the participant input and enter button initially
participantInput.style.display = 'none';
enterButton.style.display = 'none';

// Function to show popup in the center of the screen
function showPopup(message) {
    popup.textContent = message;
    popup.style.position = 'fixed'; // Use fixed position
    popup.style.top = '50%'; // Center vertically
    popup.style.left = '50%'; // Center horizontally
    popup.style.transform = 'translate(-50%, -50%)'; // Adjust the position
    popup.style.zIndex = '1000'; // Ensure it's on top
    popup.classList.add("show");
}


createTournamentBtn.addEventListener('click', async function() {
    // Show the participant input and enter button
    const response = await fetch('/create-tournament', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({admin: true}),
    });

    const data = await response.json();
    participantInput.style.display = 'block';
    enterButton.style.display = 'block';
    popup.textContent = "Tournament created" //data.message;
    popup.classList.add("show")

    
    participantInput.value = ''; 
});

enterButton.addEventListener('click', async function() {
    const participantName = participantInput.value;
    const response = await fetch('/add-player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: participantName}),
    });

    const data = await response.json();

    let popupMessage = data.message;
    

    if(data.message === "User added!"){
        if(tournamentMembers.includes(participantName)) {
            popupMessage = "This user has already been added!"
        } else {
            tournamentMembers.push(participantName)
        }
        
        console.log(tournamentMembers)
    }
    popup.textContent = popupMessage;
    popup.classList.add("show")
    
})
            


createTournamentBtn.addEventListener('click', function() {
    const participantName = participantInput.value;
    // Perform necessary actions with the participant name
    console.log('Participant Name:', participantName);
    // Clear the input field
    participantInput.value = '';
});