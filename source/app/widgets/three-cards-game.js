class ThreeCardsGame extends ControllerInstance {
    // 1. Internal State
    state = {
        score: 0,
        acePosition: 1, // 0, 1, or 2
        isRevealed: false,
        isShuffling: false,
        cardMapping: [0, 1, 2], // Visual position to Card ID
        message: 'Find the Ace of Hearts!'
    };

    shuffleTimer = null;

    onCreate() {
        const self = this;

        // 2. Declare View Context for Directives
        this.declare({
            pickCard: (id) => self.handlePick(id),
            isRevealed: () => self.state.isRevealed,
            startShuffle: () => self.startShuffle()
        });

        // 3. Initial Setup
        this.refreshUI();
    }

    onDispose() {
        if (this.shuffleTimer) {
            clearTimeout(this.shuffleTimer);
        }
    }

    startShuffle() {
        if (this.state.isShuffling) return;

        this.state.isRevealed = false;
        this.state.isShuffling = true;
        this.state.message = "Watch closely...";
        this.field('btn_start').get().disabled = true;
        
        this.refreshUI();

        let swaps = 0;
        const maxSwaps = 7;

        const performSwap = () => {
            if (swaps >= maxSwaps) {
                this.state.isShuffling = false;
                this.state.message = "Pick a card!";
                this.field('btn_start').get().disabled = false;
                return;
            }

            // Pick two random indices to swap
            let idx1 = Math.floor(Math.random() * 3);
            let idx2 = Math.floor(Math.random() * 3);
            while (idx1 === idx2) idx2 = Math.floor(Math.random() * 3);

            // Swap them in our mapping
            const temp = this.state.cardMapping[idx1];
            this.state.cardMapping[idx1] = this.state.cardMapping[idx2];
            this.state.cardMapping[idx2] = temp;

            this.animatePositions();
            
            swaps++;
            this.shuffleTimer = setTimeout(performSwap, 500);
        };

        // Delay start to allow cards to flip back down
        this.shuffleTimer = setTimeout(performSwap, 600);
    }

    animatePositions() {
        // We use CSS transforms to move the wrappers based on their mapping
        const cardWidth = 140; // card + gap
        this.state.cardMapping.forEach((cardId, visualPos) => {
            const offset = (visualPos - cardId) * cardWidth;
            this.field(`card_${cardId}`).css({
                'transform': `translateX(${offset}px)`
            });
        });
    }

    handlePick(cardId) {
        if (this.state.isShuffling || this.state.isRevealed) return;

        this.state.isRevealed = true;
        
        if (cardId === this.state.acePosition) {
            this.state.score += 10;
            this.state.message = "CORRECT! You found the Ace!";
        } else {
            this.state.score = Math.max(0, this.state.score - 5);
            this.state.message = "WRONG! Better luck next time.";
        }

        this.refreshUI();
    }

    refreshUI() {
        // Update data-bound fields
        this.model().score_val = this.state.score;
        this.model().game_message = this.state.message;

        // Set the content of the cards (Ace vs Joker)
        for (let i = 0; i < 3; i++) {
            const contentEl = this.field(`content_${i}`);
            if (i === this.state.acePosition) {
                contentEl.html('<span class="ace">♥A</span>');
            } else {
                contentEl.html('<span class="joker">♣J</span>');
            }
        }
    }
}
