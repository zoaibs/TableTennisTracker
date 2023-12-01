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
        let k = ["hi", "player 2"]
        console.log(k)
        console.log(tournamentMembers)
        // let bracket = generateBracket(tournamentMembers);
        // console.log(bracket);
        // // Generate and insert the bracket HTML into the page
        // let bracketHTML = generateBracketHTML(bracket);
        // document.getElementById('bracket').innerHTML = bracketHTML;
        //generateBracket(tournamentMembers);
    }
})

// class MatchNode {
//     constructor(player1 = null, player2 = null) {
//         this.player1 = player1;
//         this.player2 = player2;
//         this.left = null;  // next round for winner
//         this.right = null; // not used in this structure, but could be for other purposes
//     }
// }

// function generateBracket(players) {
//     let numberOfRounds = Math.ceil(Math.log2(players.length));
//     let matchesInRound = Math.pow(2, numberOfRounds - 1);

//     // Create the initial round
//     let currentRound = [];
//     for (let i = 0; i < matchesInRound; i++) {
//         let player1 = players[i * 2] || null;
//         let player2 = players[i * 2 + 1] || null;
//         currentRound.push(new MatchNode(player1, player2));
//     }

//     // Build subsequent rounds until only one match remains
//     while (currentRound.length > 1) {
//         let nextRound = [];
//         for (let i = 0; i < currentRound.length; i += 2) {
//             let combinedMatch = new MatchNode(currentRound[i], currentRound[i + 1]);
//             nextRound.push(combinedMatch);
//         }
//         currentRound = nextRound;
//     }

//     return currentRound[0];
// }

// function generateBracketHTML(node, round = 0, isLeftChild = true) {
//     if (!node) return '';

//     // Ensure we're using string values, not objects
//     let player1 = node.player1
//     let player2 = node.player2

//     // Create a match element
//     let matchHTML = `<div class="match round-${round} ${isLeftChild ? 'left-child' : 'right-child'}">
//         <div class="player">${player1}</div>
//         <div class="player">${player2}</div>
//     </div>`;

//     // Generate HTML for the next round
//     let childrenHTML = '';
//     if (node.left || node.right) {
//         childrenHTML += `<div class="round-container round-container-${round + 1}">
//             ${generateBracketHTML(node.left, round + 1, true)}
//             ${generateBracketHTML(node.right, round + 1, false)}
//         </div>`;
//     }

//     return matchHTML + childrenHTML;
// }

$(document).on('ready', function() {
				
    var knownBrackets = [2,4,8,16,32], // brackets with "perfect" proportions (full fields, no byes)
    
    //exampleTeams  = _.shuffle(["New Jersey Devils","New York Islanders","New York Rangers","Philadelphia Flyers","Pittsburgh Penguins","Boston Bruins","Buffalo Sabres","Montreal Canadiens","Ottawa Senators","Toronto Maple Leafs","Carolina Hurricanes","Florida Panthers","Tampa Bay Lightning","Washington Capitals","Winnipeg Jets","Chicago Blackhawks","Columbus Blue Jackets","Detroit Red Wings","Nashville Predators","St. Louis Blues","Calgary Flames","Colorado Avalanche","Edmonton Oilers","Minnesota Wild","Vancouver Canucks","Anaheim Ducks","Dallas Stars","Los Angeles Kings","Phoenix Coyotes","San Jose Sharks","Montreal Wanderers","Quebec Nordiques","Hartford Whalers"]), // because a bracket needs some teams!
    
    exampleTeams = _.shuffle(["user1", "user2", "user3", "user4"])
    bracketCount = 0;

    
    
    /*
     * Build our bracket "model"
     */
    function getBracket(base) {
    
        var closest 		= _.find(knownBrackets, function(k) { return k>=base; }),
            byes 			= closest-base;
            
        if(byes>0)	base = closest;
    
        var brackets 	= [],
            round 		= 1,
            baseT 		= base/2,
            baseC 		= base/2,
            teamMark	= 0,
            nextInc		= base/2;
            
        for(i=1;i<=(base-1);i++) {
            var	baseR = i/baseT,
                isBye = false;
                
            if(byes>0 && (i%2!=0 || byes>=(baseT-i))) {
                isBye = true;
                byes--;
            }
            
            var last = _.map(_.filter(brackets, function(b) { return b.nextGame == i; }), function(b) { return {game:b.bracketNo,teams:b.teamnames}; });
            
            brackets.push({
                lastGames:	round==1 ? null : [last[0].game,last[1].game],
                nextGame:	nextInc+i>base-1?null:nextInc+i,
                teamnames:	round==1 ? [exampleTeams[teamMark],exampleTeams[teamMark+1]] : [last[0].teams[_.random(1)],last[1].teams[_.random(1)]],
                bracketNo:	i,
                roundNo:	round,
                bye:		isBye
            });
            teamMark+=2;
            if(i%2!=0)	nextInc--;
            while(baseR>=1) {
                round++;
                baseC/= 2;
                baseT = baseT + baseC;
                baseR = i/baseT;
            }
        }
        
        renderBrackets(brackets);
    }
    
    /*
     * Inject our brackets
     */
    function renderBrackets(struct) {
        var groupCount	= _.uniq(_.map(struct, function(s) { return s.roundNo; })).length;
        
        var group	= $('<div class="group'+(groupCount+1)+'" id="b'+bracketCount+'"></div>'),
            grouped = _.groupBy(struct, function(s) { return s.roundNo; });

        for(g=1;g<=groupCount;g++) {
            console.log(g);
            var round = $('<div class="r'+g+'"></div>');
            _.each(grouped[g], function(gg) {
                if(gg.bye)
                    round.append('<div></div>');
                else
                    if(g<2)
                        round.append('<div><div class="bracketbox"><span class="info">'+gg.bracketNo+'</span><span class="teama">'+gg.teamnames[0]+'</span><span class="teamb">'+gg.teamnames[1]+'</span></div></div>');
                    else
                        round.append('<div><div class="bracketbox"><span class="info">'+gg.bracketNo+'</span><span class="teama">'+'</span><span class="teamb">'+'</span></div></div>');
            });
            group.append(round);
        }
        group.append('<div class="r'+(groupCount+1)+'"><div class="final"><div class="bracketbox"><span class="teamc">'+'</span></div></div></div>');
        $('#brackets').append(group);
        
        bracketCount++;
        $('html,body').animate({
            scrollTop: $("#b"+(bracketCount-1)).offset().top
        });
    }
    
    $('#generate-bracket').on('click', function() {
        var opts = exampleTeams.length;//parseInt(prompt('Bracket size (number of teams):',32));
        
        if(!_.isNaN(opts) && opts <= _.last(knownBrackets))
            getBracket(opts);
        else
            alert('The bracket size you specified is not currently supported.');
    });
    
});



module.exports = router;