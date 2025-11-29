// UI Management
class UI {
    constructor() {
        this.player1ScoreElement = document.querySelector('#player1-score .score');
        this.player2ScoreElement = document.querySelector('#player2-score .score');
        this.timerElement = document.getElementById('timer-display');
        this.gameOverlay = document.getElementById('game-overlay');
        this.startScreen = document.getElementById('start-screen');
        this.endScreen = document.getElementById('end-screen');
        this.winnerAnnouncement = document.getElementById('winner-announcement');
        this.finalScores = document.getElementById('final-scores');
    }

    updateScores(player1Score, player2Score) {
        this.player1ScoreElement.textContent = player1Score;
        this.player2ScoreElement.textContent = player2Score;
    }

    updateTimer(seconds) {
        this.timerElement.textContent = seconds;

        // Add warning class if less than 10 seconds
        if (seconds <= 10) {
            this.timerElement.classList.add('warning');
        } else {
            this.timerElement.classList.remove('warning');
        }
    }

    showStartScreen() {
        this.gameOverlay.classList.remove('hidden');
        this.startScreen.classList.add('active');
        this.endScreen.classList.remove('active');
    }

    showEndScreen(player1Score, player2Score, isOnePlayerMode = false) {
        this.gameOverlay.classList.remove('hidden');
        this.startScreen.classList.remove('active');
        this.endScreen.classList.add('active');

        // Determine winner
        let winnerText = '';
        if (player1Score > player2Score) {
            winnerText = 'Player 1 Wins!';
        } else if (player2Score > player1Score) {
            // Check if one-player mode to show "The Bot Wins!"
            winnerText = isOnePlayerMode ? 'The Bot Wins!' : 'Player 2 Wins!';
        } else {
            winnerText = "It's a Tie!";
        }

        this.winnerAnnouncement.textContent = winnerText;

        // Update final scores display
        const player2Label = isOnePlayerMode ? 'The Bot' : 'Player 2';
        this.finalScores.innerHTML = `
            <div>Player 1: ${player1Score} bats</div>
            <div>${player2Label}: ${player2Score} bats</div>
        `;
    }

    hideOverlay() {
        this.gameOverlay.classList.add('hidden');
    }
}
