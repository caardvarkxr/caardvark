import {  AvGrabButton, AvStandardGrabbable, AvTransform  } from '@aardvarkxr/aardvark-react';
import { g_builtinModelBox, g_builtinModelGear, g_builtinModelPlus } from '@aardvarkxr/aardvark-shared';
import React, {useState} from 'react';
import { PlayingCard } from './card';
import { CardValue} from './types';

type DeckProps = {
}

type DeckState = {
    drawnCards: CardValue[];
    remainingCards: CardValue[];
}


class CardDeck extends React.Component<DeckProps, DeckState>{


	constructor( props: any )
	{

        super( props );

        let fullDeck = []
        for (let i = 0; i < 13; i++) {
            fullDeck.push(i);
        }                        
        this.shuffle(fullDeck);

        this.state = {
            drawnCards: [],
            remainingCards: fullDeck
        }

    }

    public gather(){
        let len = this.state.drawnCards.length
        let deck = this.state.remainingCards;
        let drawn = this.state.drawnCards;

        for(let i = 0; i < len; i++){
            deck.push(drawn.pop());
        }
        this.shuffle(deck);

        this.setState({
            remainingCards: deck,
            drawnCards: []
        });
    }

    public shuffle(cards: CardValue[]){
        let len = cards.length
        for(let i = 0; i < (len); i++){
            let j = Math.floor(Math.random()*(len));
            let tempval = cards[i];
            cards[i] = cards[j];
            cards[j] = tempval;
        }
        return cards;
    }
    
    public drawCard(){
        if(this.state.remainingCards.length == 0){
            return;
        }
        let deck = this.state.remainingCards;
        let drawn = this.state.drawnCards;

        let temp = deck.pop();
        drawn.push(temp);

        this.setState({
            remainingCards: deck,
            drawnCards: drawn
        });
    }

    public render(){
        return(
            <AvStandardGrabbable modelUri={ g_builtinModelBox } modelScale={ 0.01 }>
                <AvTransform translateY={ 0.1 } >
                    <AvTransform rotateX={90}>
                        <AvGrabButton modelUri={ g_builtinModelPlus } onClick={ this.drawCard.bind(this) } />
                    </AvTransform>
                    <AvTransform translateY={ 0.1 } >
                        {this.state.drawnCards.map(cardVal => (
                            <PlayingCard card={cardVal} key={cardVal} />
                        ))}
                    </AvTransform>
                </AvTransform>
                <AvTransform translateX={0.1} rotateX={90}>
                    <AvGrabButton modelUri={ g_builtinModelGear} onClick={ this.gather.bind(this) } />
                </AvTransform>
            </AvStandardGrabbable>
        );
    }
} 

export default CardDeck;