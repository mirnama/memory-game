import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppComponent} from "../app.component";
import {AppModule} from "../app.module";

export interface Card {
  id: number;
  value: string;
  suits: string;
  flipped: boolean;
  matched: boolean;
  imagePath: string;
  backImagePath: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  // @Input() data: Card;
  // @Output() cardClicked= new EventEmitter();
  // constructor() {
  // }
  cards: Card[] = [];
  currentPlayer: number=0;
  players: { id: number; name: string; score: number }[]=[];


  ngOnInit() {
    // this.currentPlayer = 0;
    this.initializeGame();
  }

  initializeGame() {
    this.cards = this.generateCards();
    this.shuffleCards(this.cards);
    this.currentPlayer = Math.floor(Math.random() * 2);
    this.players = [
      { id: 0, name: 'Player 1', score: 0 },
      { id: 1, name: 'Player 2', score: 0 }
    ];
  }

  generateCards(): Card[] {
    const values = ['A','7','J','K','Q'];
    const suits: string[] = ['C','D']
    const cards: Card[] = [];

    let cardId = 0;
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        const card: { flipped: boolean; imagePath: string; matched: boolean; id: number; value: string; suits: string; backImagePath: string } = {
          id: cardId++,
          value: values[i],
          suits: suits[j],
          flipped: false,
          matched: false,
          backImagePath: '/assets/cards/red_back.png',
          imagePath: `assets/cards/${values[i]}${suits[j]}.png`
        };
        cards.push({ ...card});
        cards.push({ ...card});
      }
    }

    return cards;
  }

  shuffleCards(cards: Card[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  flipCard(card: Card) {
    if (!card.flipped && !card.matched) {
      card.flipped = true;


      const flippedCards = this.cards.filter(c => c.flipped && !c.matched);
      if (flippedCards.length === 2) {
        this.checkMatch(flippedCards);
      }
    }
  }

  checkMatch(flippedCards: Card[]) {
    const [card1, card2] = flippedCards;

    if (card1.value === card2.value && card1.suits === card2.suits) {
      card1.matched = true;
      card2.matched = true;
      this.players[this.currentPlayer].score++;
    } else {
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        this.changeTurn();
      }, 1000);
    }
  }

  changeTurn() {
    this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
  }

  isGameOver(): boolean {
    return this.cards.every(card => card.matched);
  }

  restartGame() {
    this.initializeGame();
  }
}

