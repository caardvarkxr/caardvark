import {  AvStandardGrabbable, AvTransform  } from '@aardvarkxr/aardvark-react';
import { g_builtinModelBox } from '@aardvarkxr/aardvark-shared';
import * as React from 'react';
import { PlayingCard } from './card';
import { CardValue} from './types';

type DeckProps = {
}
var drawnCards: CardValue[] = new Array();
var remainingCards: CardValue[] = new Array();

class CardDeck extends React.Component<{}, DeckProps>{

    cardComponents = [];

	constructor( props: any )
	{

        super( props );
        for (let i = 0; i < 52; i++) {
            remainingCards.push(i);
        }
        for(let i = 0; i<52; i++){
            this.cardComponents.push(<PlayingCard card={this.drawCard()} key={i} />)
        }
        this.shuffle();
    }

    public gather(){
        let len = drawnCards.length
        for(let i = 0; i < len; i++){
            remainingCards.push(drawnCards.pop());
        }
        this.shuffle();
    }

    public shuffle(){
        let len = remainingCards.length-1
        for(let i = 0; i< (len); i++){
            let j = Math.floor(Math.random()*(len));
            let tempval = remainingCards[i];
            remainingCards[i] = remainingCards[j];
            remainingCards[j] = tempval;
        }

    }

    public drawCard(){
        let temp = remainingCards.pop();
        drawnCards.push(temp);
        return temp;        
    }

    public render(){
        return(
            <AvStandardGrabbable modelUri={ g_builtinModelBox } modelScale={ 0.01 }>
                <AvTransform translateY={ 0.1 } >
                    {this.cardComponents}
                </AvTransform>
            </AvStandardGrabbable>
        );
    }
} 

export default CardDeck;