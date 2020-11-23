class Deck {
  constructor() {
    this.cards = Deck.#initialFullDeck();
  }

  static #initialFullDeck = () => {
    return Deck.#FULL_DECK.SUITS.reduce((deck, suit) => {
      Deck.#FULL_DECK.RANK.forEach(rank => deck.push(new Card(rank, suit)));

      return deck;
    }, []);
  }

  static #randomizer = (remainedCards, sortedCards = []) => {
    if (!remainedCards.length) {
      return sortedCards;
    }

    const cardRandomIndex = Math.floor(Math.random() * remainedCards.length);

    sortedCards.push(remainedCards.splice(cardRandomIndex, 1)[0]);

    return Deck.#randomizer(remainedCards, sortedCards);
  }

  static #FULL_DECK = {
    SUITS: ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
    RANK: ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King']
  }
  
  suffle() {
    return this.cards = Deck.#randomizer(this.cards);
  }

  draw(n) {
    return this.cards.splice(-n, n);
  }

  get count() {
    return this.cards.length;
  }
}

class Card {
  constructor(rank, suit) {
    this.suit = suit;
    this.rank = Card.#RANKS[rank.toUpperCase()];
    this.rankName = rank;

    const isFaceCard = this.rank === 1 || this.rank > 10;

    Object.defineProperty(this, 'isFaceCard', { value: isFaceCard });
  }

  static #RANKS = {
    ACE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    JACK: 11,
    QUEEN: 12,
    KING: 13
  }

  static compare(cardOne, cardTwo) {
    const WIN = 1;
    const FAIL_OR_TIE = 0;

    return cardOne.rank > cardTwo.rank ? WIN : FAIL_OR_TIE;
  }

  toString() {
    return `${this.rankName} of ${this.suit}`;
  }
}

class Player {
  constructor(name, deck) {
    this.name = name;
    this.deck = deck;
    this.wins = 0;
  }

  static #nextTurn = (playerOne, playerTwo) => {
    if (!playerOne.deck.count || !playerTwo.deck.count) {
      const playerOneScore = playerOne.wins;
      const playerTwoScore = playerTwo.wins;

      document.body.innerHTML += `<br> --------------------`;
      playerOneScore > playerTwoScore
       ? document.body.innerHTML += `<br> ${playerOne.name} wins ${playerOneScore} to ${playerTwoScore}`
       : playerOneScore === playerTwoScore
         ? document.body.innerHTML += `<br> Tie`
         : document.body.innerHTML += `<br> ${playerTwo.name} wins ${playerTwoScore} to ${playerOneScore}`;
      
      return;
    }

    const onePlayerCard = playerOne.deck.draw(1)[0];
    const twoPlayerCard = playerTwo.deck.draw(1)[0];
    const onePlayerTurn = `${onePlayerCard.toString()} (${playerOne.name})`;
    const twoPlayerTurn = `${twoPlayerCard.toString()} (${playerTwo.name})`;

    document.body.innerHTML += `<br> ${onePlayerTurn} vs ${twoPlayerTurn}`;

    playerOne.wins += Card.compare(onePlayerCard, twoPlayerCard);
    playerTwo.wins += Card.compare(twoPlayerCard, onePlayerCard);

    Player.#nextTurn(playerOne, playerTwo);
  }

  static play(playerOne, playerTwo) {
    playerOne.deck.suffle();
    playerTwo.deck.suffle();

    Player.#nextTurn(playerOne, playerTwo);
  }
}

Player.play(new Player('Tom', new Deck()), new Player('Bill', new Deck()));
