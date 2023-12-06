const createTournamentBtn = document.getElementById('create-tournament-btn');
const generateBracketBtn = document.getElementById('generate-bracket');
const participantInput = document.getElementById('participant-input');
const enterButton = document.getElementById('enter-participant');
const adminKey = document.getElementById('admin-key');
let popup = document.getElementById("myPopup");
let matchups = document.getElementById("matchups-container")
let tournamentMembers = [];
//const TournamentHeap = require('./TournamentHeap');
import { TournamentHeap } from './TournamentHeap.js'
//let bracket;

// Hide the participant input and enter button initially
participantInput.style.display = 'none';
enterButton.style.display = 'none';
generateBracketBtn.style.display = 'none';
matchups.style.display = 'none';

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
    generateBracketBtn.style.display = 'block';
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
            updatePlayerList(tournamentMembers);
            participantInput.value = '';
        }
        
        console.log(tournamentMembers)
    }
    popup.textContent = popupMessage;
    popup.classList.add("show")
    
})
            
function updatePlayerList(members) {
    const list = document.getElementById('player-list');
    list.innerHTML = ''; // Clear existing list

    members.forEach(member => {
        const listItem = document.createElement('li');
        listItem.textContent = member;
        list.appendChild(listItem);
    });
}

createTournamentBtn.addEventListener('click', function() {
    const participantName = participantInput.value;
    // Perform necessary actions with the participant name
    console.log('Participant Name:', participantName);
    // Clear the input field
    participantInput.value = '';
});


generateBracketBtn.addEventListener('click', function() {
    if(tournamentMembers.length === 0){
        popup.textContent = "Not enough players!"
    } else {
        console.log("generating bracket...")
        console.log(tournamentMembers)
        let bracket = new TournamentHeap(tournamentMembers);
        let heap = bracket.getPlayers();
        console.log(heap)
        let currentMatchups = bracket.getCurrentMatchups()
        matchups.style.display = 'block';

        displayMatchups(bracket);
       
    }
})

// function displayMatchups(matchups) {
//     const container = document.getElementById('matchups-container');
//     container.innerHTML = ''; // Clear existing content

//     matchups.forEach(match => {
//         const matchElement = document.createElement('div');
//         matchElement.className = 'matchup';
//         matchElement.textContent = `${match.player1} vs ${match.player2}`;
//         container.appendChild(matchElement);
//     });
// }

function displayMatchups(tournament) {
    const container = document.getElementById('matchups-container');
    container.innerHTML = ''; // Clear existing content

    tournament.upcomingMatchups.forEach((match, index) => {

        let player1 = match.player1;
        let player2 = match.player2;

        const matchElement = document.createElement('div');
        matchElement.className = 'matchup';

        const matchText = document.createTextNode(`${match.player1} vs ${match.player2}`);
        matchElement.appendChild(matchText);

        // Winner input
        const winnerInput = document.createElement('input');
        winnerInput.type = 'text';
        winnerInput.placeholder = 'Enter winner';
        winnerInput.id = 'winner' + index;

        // Winner score input
        const winnerScoreInput = document.createElement('input');
        winnerScoreInput.type = 'number';
        winnerScoreInput.placeholder = 'Winner score';
        winnerScoreInput.id = 'winnerScore' + index;

        // Loser score input
        const loserScoreInput = document.createElement('input');
        loserScoreInput.type = 'number';
        loserScoreInput.placeholder = 'Loser score';
        loserScoreInput.id = 'loserScore' + index;

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.onclick = function() {
            const winnerName = document.getElementById('winner' + index).value;
            const loserName = player1 ? !(player1 === winnerName) : player2;

            
            const winnerScore = document.getElementById('winnerScore' + index).value;
            const loserScore = document.getElementById('loserScore' + index).value;
            const winnerIndex = tournament.heap.indexOf(winnerName);
        
            if (winnerIndex !== -1) {
                // Prepare data to be sent
                const matchData = {
                    winner: winnerName,
                    loser: loserName,
                    winnerScore: winnerScore,
                    loserScore: loserScore
                };
        
                // Send data using fetch API
                fetch('/submit-match', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(matchData),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    tournament.playMatch(winnerIndex);
                    displayMatchups(tournament); // Refresh the display
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            } else {
                alert('Invalid winner name');
            }
        };
        

        matchElement.appendChild(winnerInput);
        matchElement.appendChild(winnerScoreInput);
        matchElement.appendChild(loserScoreInput);
        matchElement.appendChild(submitButton);
        container.appendChild(matchElement);
    });
}
