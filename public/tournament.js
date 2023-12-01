const createTournamentBtn = document.getElementById('create-tournament-btn');
const generateBracketBtn = document.getElementById('generate-bracket');
const participantInput = document.getElementById('participant-input');
const enterButton = document.getElementById('enter-participant');
const adminKey = document.getElementById('admin-key');
let popup = document.getElementById("myPopup");
let tournamentMembers = [];

// Hide the participant input and enter button initially
participantInput.style.display = 'none';
enterButton.style.display = 'none';
generateBracketBtn.style.display = 'none';

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
        let bracket = generateBracket(tournamentMembers);
        console.log(bracket);
        // Generate and insert the bracket HTML into the page
        let bracketHTML = generateBracketHTML(bracket);
        document.getElementById('bracket').innerHTML = bracketHTML;
    }
})

class MatchNode {
    constructor(player1 = null, player2 = null) {
        this.player1 = player1;
        this.player2 = player2;
        this.left = null;  // next round for winner
        this.right = null; // not used in this structure, but could be for other purposes
    }
}

function generateBracket(players) {
    let numberOfRounds = Math.ceil(Math.log2(players.length));
    let matchesInRound = Math.pow(2, numberOfRounds - 1);

    // Create the initial round
    let currentRound = [];
    for (let i = 0; i < matchesInRound; i++) {
        let player1 = players[i * 2] || null;
        let player2 = players[i * 2 + 1] || null;
        currentRound.push(new MatchNode(player1, player2));
    }

    // Build subsequent rounds until only one match remains
    while (currentRound.length > 1) {
        let nextRound = [];
        for (let i = 0; i < currentRound.length; i += 2) {
            let combinedMatch = new MatchNode(currentRound[i], currentRound[i + 1]);
            nextRound.push(combinedMatch);
        }
        currentRound = nextRound;
    }

    return currentRound[0];
}

function generateBracketHTML(node, round = 0, isLeftChild = true) {
    if (!node) return '';
    
    // Ensure we're using string values, not objects
    let player1 = node.player1
    let player2 = node.player2

    // Create a match element
    let matchHTML = `<div class="match round-${round} ${isLeftChild ? 'left-child' : 'right-child'}">
        <div class="player">${player1}</div>
        <div class="player">${player2}</div>
    </div>`;

    // Generate HTML for the next round
    let childrenHTML = '';
    if (node.left || node.right) {
        childrenHTML += `<div class="round-container round-container-${round + 1}">
            ${generateBracketHTML(node.left, round + 1, true)}
            ${generateBracketHTML(node.right, round + 1, false)}
        </div>`;
    }

    return matchHTML + childrenHTML;
}





module.exports = router;