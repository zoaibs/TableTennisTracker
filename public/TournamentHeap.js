export class TournamentHeap {
    constructor(players) {
        this.heap = this.buildHeap(players);
        this.upcomingMatchups = this.calculateInitialMatchups();
        this.completedMatchups = [];
    }

    getPlayers(){
        return this.heap;
    }

    buildHeap(players) {
        let heap = [];
        let totalSize = this.calculateHeapSize(players.length);
        for (let i = 0; i < totalSize; i++) {
            heap.push(null);
        }

        // Insert players at the bottommost layer
        let firstPlayerIndex = totalSize - players.length;
        for (let i = 0; i < players.length; i++) {
            heap[firstPlayerIndex + i] = players[i];
        }

        return heap;
    }

    calculateHeapSize(playerCount) {
        let count = 1;
        while (count < playerCount) {
            count *= 2;
        }
        return count * 2 - 1; // Total nodes in a complete binary tree
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    calculateInitialMatchups() {
        let matchups = [];
        for (let i = this.heap.length - 1; i > 0; i -= 2) {
            let player1 = this.heap[i];
            let player2 = this.heap[i - 1];

            if (player1 && !player2) {
                // Player1 automatically advances as they have no sibling
                let parentIndex = this.getParentIndex(i);
                this.heap[parentIndex] = player1;
            } else if (player1 && player2) {
                matchups.push({ player1, player2 });
            }
        }
        return matchups;
    }

    getCurrentMatchups() {
        let matchups = [];
        for (let i = 0; i < this.heap.length; i++) {
            let leftChildIndex = this.getLeftChildIndex(i);
            let rightChildIndex = this.getRightChildIndex(i);

            if (leftChildIndex < this.heap.length && rightChildIndex < this.heap.length) {
                let leftChild = this.heap[leftChildIndex];
                let rightChild = this.heap[rightChildIndex];

                // Include matchup only if the parent node is null (indicating the match is yet to be played)
                if (this.heap[i] === null && leftChild !== null && rightChild !== null) {
                    matchups.push({ player1: leftChild, player2: rightChild, matchIndex: i });
                }
            }
        }
        return matchups;
    }

    playMatch(playerIndex) {
        let parentIndex = this.getParentIndex(playerIndex);
        if (this.heap[playerIndex] !== null && (this.heap[parentIndex] === null || parentIndex === 0)) {
            let winningPlayer = this.heap[playerIndex];
            let losingPlayer = this.heap[this.getSiblingIndex(playerIndex)];
            
            // Add completed matchup
            if (losingPlayer) {
                this.completedMatchups.push({ player1: winningPlayer, player2: losingPlayer, winner: winningPlayer });
            }

            this.heap[parentIndex] = winningPlayer;

            // Update upcoming matchups
            this.upcomingMatchups = this.getCurrentMatchups();

            return true;
        }
        return false;
    }

    getSiblingIndex(index) {
        return index % 2 === 0 ? index - 1 : index + 1;
    }

    getLeftChildIndex(parentIndex) {
        return 2 * parentIndex + 1;
    }

    getRightChildIndex(parentIndex) {
        return 2 * parentIndex + 2;
    }

    isTournamentOver() {
        return this.heap[0] !== null;
    }

    getWinner() {
        return this.isTournamentOver() ? this.heap[0] : null;
    }

    displayHeap() {
        return this.heap;
    }
}



