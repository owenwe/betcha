import React from 'react'
import { Deck, Card, Hand, HAND_TYPES } from './lib'
import EvaluatedHand from './EvaluatedHand'
import styled from 'styled-components'
import './App.css'

const PlaySpaceContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 125px 125px auto auto;

    @media only screen and (min-width: 640px) {
        grid-template-rows: 200px 200px auto auto;
    }

    @media only screen and (min-width: 1024px) {
        grid-template-rows: 25% 25% auto auto;
    }
`
const DeckSpace = styled.div`
    grid-column-start: 1;
    grid-column-end: 2;
    display: flex;
    justify-content: space-around;
`
const DiscardContainer = styled.div`
    margin-left: 1em;
`
const HouseCards = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
    div {
        display: flex;
        flex-direction: row;
        margin: 0 .25rem;
    }
`
const GameCards = styled.div`
    display: flex;
    flex-direction: row;
    grid-column-start: 1;
    grid-column-end: 3;
    justify-content: center;
    div {
        margin: 0 2px;
    }

    @media only screen and (min-width: 640px) {
        div {
            margin: 0 5px;
        }
    }

    @media only screen and (min-width: 1024px) {
        div {
            margin: 0 10px;
        }
    }
`
const PlayerCards = styled.div`
    display: flex;
    flex-direction: row;
    grid-column-start: 1;
    grid-column-end: 2;
    div {
        margin: 0 .25rem;
    }
`
const GameUI = styled.div`
    button {
        margin: 5px 10px;
    }
`
const GameResult = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-evenly;
`
const FullWidthColumn = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;

    p {
        margin-top: 5px;
    }

    table {
        width: 100%;

        tbody tr.table-row-even {
            background-color: #eeeeee;
        }

        tbody tr td {
            text-align: center;
        }
    }
`
const PlayingCard = styled.div.attrs<{ $imageSrc?: string; }>(props => ({
    $imageSrc: props.$imageSrc || Card.backImageSrc
}))`
    border: 1px solid black;
    border-radius: 5px;
    
    width: 70px;
    min-width: 70px;
    height: 98px;
    background-color: white;
    background-image: url(${props => props.$imageSrc});
    background-size: 70px 98px;
    filter: drop-shadow(1px 2px 3px black);

    @media only screen and (min-width: 640px) {
        border-radius: 10px;
        width: 125px;
        min-width: 125px;
        height: 175px;
        background-size: 125px 175px;
    }

    @media only screen and (min-width: 1024px) {
        border-radius: 10px;
        width: 175px;
        min-width: 175px;
        height: 245px;
        background-size: 175px 245px;
    }
`

function initializeGame(): ReducerState {
    const deck: Deck = new Deck()
    deck.shuffle()
    return {
        deck: deck,
        houseCards: [],
        playerCards: [],
        gameCards: [],
        usedCards: [],
        playerMoney: 100,
        step: 0,
        round: 1,
        canBetTen: false,
        purse: 0,
        gameOver: false,
        results: {
            player: HAND_TYPES.HIGH_CARD,
            house: HAND_TYPES.HIGH_CARD,
            winner: ''
        }
    }
}

interface ReducerState {
    deck: {
        shuffle: () => void
        deal: (arg0: number) => any[]
        cardsTotal: number
    }
    houseCards: Card[]
    playerCards: Card[]
    gameCards: Card[]
    usedCards: Card[]
    playerMoney: number
    step: number
    round: number
    canBetTen: boolean
    purse: any
    gameOver: boolean
    results: {
        player: HAND_TYPES
        house: HAND_TYPES
        winner: string
    }
}

type Action = {
    type: string,
    amount: number
}

function reducer(state: ReducerState, action: Action): ReducerState {
    switch (action.type) {
        case 'reset-deck':
            state.deck.shuffle()
            return {
                ...state,
                houseCards: [],
                playerCards: [],
                gameCards: [],
                usedCards: [],
                step: 0,
                round: state.round + 1,
                canBetTen: false,
                gameOver: false,
                results: {
                    player: HAND_TYPES.HIGH_CARD,
                    house: HAND_TYPES.HIGH_CARD,
                    winner: ''
                }
            }
        case 'reset':
            return {
                ...state,
                houseCards: [],
                playerCards: [],
                gameCards: [],
                usedCards: [...state.usedCards].concat(state.gameCards).concat(state.houseCards).concat(state.playerCards),
                step: 0,
                round: state.round + 1,
                canBetTen: false,
                gameOver: false,
                results: {
                    player: HAND_TYPES.HIGH_CARD,
                    house: HAND_TYPES.HIGH_CARD,
                    winner: ''
                }
            }
        case 'bet':
            const nextState: ReducerState = {
                ...state,
                playerMoney: state.playerMoney - action.amount,
                step: state.step + 1,
                purse: state.purse + action.amount
            }

            if (action.amount === 10) {
                // get new cards
                nextState.usedCards = [...state.usedCards].concat(state.playerCards)
                nextState.playerCards = state.deck.deal(2)
            }

            // puts down 3 game cards, house and player each get 2
            if (state.step === 0) {
                nextState.houseCards = [...nextState.houseCards].concat(state.deck.deal(2))
                nextState.playerCards = [...nextState.playerCards].concat(state.deck.deal(2))
                nextState.gameCards = [...nextState.gameCards].concat(state.deck.deal(3))
                nextState.canBetTen = state.deck.cardsTotal >= 4 && nextState.playerMoney >= 20
            }

            // add the fourth card to the game cards
            if (state.step === 1) {
                const card4: Card = state.deck.deal(1)[0]
                nextState.gameCards = [
                    ...state.gameCards,
                    card4
                ]
                nextState.canBetTen = state.deck.cardsTotal >= 3 && nextState.playerMoney >= 15
            }

            // add the fifth card to the game cards
            if (state.step === 2) {
                const card5: Card = state.deck.deal(1)[0]
                nextState.gameCards = [
                    ...state.gameCards,
                    card5
                ]
                nextState.canBetTen = state.deck.cardsTotal >= 2 && nextState.playerMoney >= 10
            }

            // check to see who won
            if (state.step === 3) {
                const houseHand: Hand = new Hand(state.gameCards.concat(nextState.houseCards))
                const playerHand: Hand = new Hand(state.gameCards.concat(nextState.playerCards))
                nextState.results.house = houseHand.evaluate()
                nextState.results.player = playerHand.evaluate()
                if (nextState.results.player > nextState.results.house) {
                    nextState.results.winner = 'player'
                    const bonus: number = calculateBonusPoints(nextState.results.player)
                    nextState.playerMoney = nextState.playerMoney + nextState.purse + bonus
                    nextState.purse = 0
                } else if (nextState.results.house > nextState.results.player) {
                    nextState.results.winner = 'house'
                    nextState.purse = 0
                } else {
                    // tie - use each player's high card
                    const playerHighestCard: Card = Hand.highestCard(nextState.playerCards)
                    const houseHighestCard: Card = Hand.highestCard(nextState.houseCards)
                    if (playerHighestCard.isHigherThan(houseHighestCard)) {
                        // player wins
                        nextState.results.winner = 'player'
                        nextState.playerMoney = nextState.playerMoney + nextState.purse
                        nextState.purse = 0
                    } else {
                        // house wins
                        nextState.results.winner = 'house'
                        nextState.purse = 0
                    }
                }

                if (nextState.deck.cardsTotal < 9) {
                    nextState.gameOver = true
                }
            }

            return nextState
        default:
            console.error('reducer dispatched without an action')
            return state
    }
}

function calculateBonusPoints(hand: HAND_TYPES): number {
    switch (hand) {
        case HAND_TYPES.ROYAL_FLUSH:
            return 100
        case HAND_TYPES.STRAIGHT_FLUSH:
            return 50
        case HAND_TYPES.FOUR_OF_A_KIND:
            return 40
        case HAND_TYPES.FULL_HOUSE:
            return 30
        case HAND_TYPES.FLUSH:
            return 25
        case HAND_TYPES.STRAIGHT:
            return 20
        case HAND_TYPES.THREE_OF_A_KIND:
            return 15
        case HAND_TYPES.TWO_PAIR:
            return 10
        case HAND_TYPES.PAIR:
            return 5
        default:
            return 0
    }
}

export default function App() {
    const [game, dispatch] = React.useReducer<(state: ReducerState, actions: Action) => ReducerState>(reducer, initializeGame())

    function bet(): void {
        dispatch({ type: 'bet', amount: 5 })
    }

    function betTen(): void {
        dispatch({ type: 'bet', amount: 10 })
    }

    function resetRound(): void {
        dispatch({ type: 'reset', amount: 0 })
    }

    function resetDeck(): void {
        dispatch({ type: 'reset-deck', amount: 0 })
    }

    return (
        <div className="cards-container">
            <h1>Betcha <small>A simple poker game</small></h1>
            <PlaySpaceContainer>
                <DeckSpace>
                    <PlayingCard />
                    {game.usedCards.length > 0 ? <DiscardContainer>
                        Cards Used:
                        <select>
                            {game.usedCards.map((card: Card) => <option key={card.key} value={card.rank}>{card.toString()}</option>)}
                        </select>
                    </DiscardContainer> : null}
                </DeckSpace>
                <HouseCards>
                    {game.step === 4
                        ? (
                            <div>
                                {game.houseCards.map((card: Card) => <PlayingCard $imageSrc={card.imageSrc} key={card.key} />)}
                            </div>
                        )
                        : game.step >= 1 ? (
                            <div>
                                <PlayingCard />
                                <PlayingCard />
                            </div>
                        ) : null
                    }

                </HouseCards>
                <GameCards>
                    {game.gameCards.map((card: Card) => <PlayingCard $imageSrc={card.imageSrc} key={card.key} title={card.toString()} />)}
                </GameCards>
                <PlayerCards>
                    {game.playerCards.map((card: Card) => <PlayingCard $imageSrc={card.imageSrc} key={card.key} title={card.toString()} />)}
                </PlayerCards>
                <GameUI>
                    <table>
                        <tbody>
                            <tr>
                                <td>Score:</td>
                                <td>{game.playerMoney}</td>
                            </tr>
                            <tr>
                                <td>Prize:</td>
                                <td>{game.purse}</td>
                            </tr>
                            <tr>
                                <td>Round:</td>
                                <td>{game.round}</td>
                            </tr>
                            <tr>
                                <td>Cards Left:</td>
                                <td>{game.deck.cardsTotal}</td>
                            </tr>
                        </tbody>
                    </table>
                    {
                        game.results.winner === 'player'
                            ? <GameResult>
                                <h2>Winner!</h2>
                                <EvaluatedHand hand={game.results.player} />
                                +{calculateBonusPoints(game.results.player)}
                            </GameResult>
                            : null
                    }
                    {
                        game.results.winner === 'house'
                            ? <GameResult>
                                <h2>House Wins</h2>
                                <EvaluatedHand hand={game.results.house} />
                            </GameResult>
                            : null
                    }
                    {
                        game.step <=3 
                            ? <button onClick={bet}>Bet 5</button> 
                            : null
                    }
                    {
                        (game.step > 0 && game.step <=3 && game.canBetTen) 
                            ? <button onClick={betTen}>Bet 10</button> 
                            : null
                    }
                    {
                        (game.step === 4 && game.deck.cardsTotal > 8) 
                            ? <button onClick={resetRound}>new game</button> 
                            : null
                    }
                    {
                        game.gameOver 
                            ? <button onClick={resetDeck}>new deck</button> 
                            : null
                    }
                    {game.gameOver ? <h3>Game Over</h3> : null}
                </GameUI>
                <FullWidthColumn>
                    <h4>How to play</h4>
                    <p>
                        Bet 5 points at the start of the game to get 2 cards (lower left) and see the first 3 of 5 community cards. You 
                        can continue to bet 5 points to see the next community card, or find out if you won against the house (top right cards). 
                        Betting 10 points does the same, but will exchange your 2 cards for a fresh 2.
                    </p>
                    <p>
                        The game uses a standard 52-card deck. Remembering what cards were played would serve you well in 
                        later rounds when there are not that many cards left to play. When the round is over and there are not 
                        enough cards left, a new shuffled deck will be used.
                    </p>
                </FullWidthColumn>
                <FullWidthColumn>
                    <h4>Cheating</h4>
                    <p>
                        This game was made with React so using the browswer's dev tools along with the React extension will 
                        allow you to see what cards the house is holding. Sometimes this helps, sometimes.
                    </p>
                </FullWidthColumn>
                <FullWidthColumn>
                    <h4>Scoring</h4>
                    <p>
                        At the end of the round your 2 cards combined with the 5 community cards will be evaluated for the best 
                        5-card hand. If your hand is higher than the house's hand, you win and your prize points are given back 
                        plus points based on what kind of hand you had (see below). When there is a tie, the highest card 
                        between yours and the house's 2-card hand determines the winner. When it comes to 2 cards with the same 
                        value, suit order decides the higher of the two same-value cards (Spade, Heart, Diamond, Club).
                    </p>
                    <table>
                        <thead>
                            <tr>
                                <th>Hand</th>
                                <th>Points Awarded</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Pair</td>
                                <td>5</td>
                            </tr>
                            <tr className="table-row-even">
                                <td>Two Pair</td>
                                <td>10</td>
                            </tr>
                            <tr>
                                <td>Three of a Kind</td>
                                <td>15</td>
                            </tr>
                            <tr className="table-row-even">
                                <td>Straight</td>
                                <td>20</td>
                            </tr>
                            <tr>
                                <td>Flush</td>
                                <td>25</td>
                            </tr>
                            <tr className="table-row-even">
                                <td>Full House</td>
                                <td>30</td>
                            </tr>
                            <tr>
                                <td>Four of a Kind</td>
                                <td>40</td>
                            </tr>
                            <tr className="table-row-even">
                                <td>Straight Flush</td>
                                <td>50</td>
                            </tr>
                            <tr>
                                <td>Royal Flush</td>
                                <td>100</td>
                            </tr>
                        </tbody>
                    </table>
                </FullWidthColumn>
            </PlaySpaceContainer>
        </div>
    )
}