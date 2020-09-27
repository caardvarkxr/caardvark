import {  AvGrabButton, AvStandardGrabbable, AvTransform, MoveableComponent  } from '@aardvarkxr/aardvark-react';
import { AvNodeTransform, EndpointAddr, g_builtinModelBox, g_builtinModelGear, g_builtinModelHook, g_builtinModelPlus, stringToEndpointAddr } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import React, {useState} from 'react';
import { CaCustomGrabbable } from './caardvark_custom_grabbable';
import { PlayingCard } from './card';
import { CardValue} from './types';

type DeckProps = {
}

type DeckState = {
    drawnCards: CardValue[];
    remainingCards: CardValue[];
}


class CardDeck extends React.Component<DeckProps, DeckState>{

    private m_newCardGrabbableRef=React.createRef<CaCustomGrabbable>();
    private m_cardRefs= [];

	constructor( props: any )
	{
        super( props );

        let fullDeck = []
        for (let i = 0; i < 52; i++) {
            fullDeck.push(i);
            this.m_cardRefs.push(React.createRef<PlayingCard>())
        }                        

        this.shuffle(fullDeck);

        this.state = {
            drawnCards: [],
            remainingCards: fullDeck
        }

    }

    @bind
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
    
    @bind
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

    @bind
    public onNewCard(cardVal: CardValue, ref: any ) {
        console.log("wweeee new card " + cardVal);
        const trans: AvNodeTransform = { };
        this.m_newCardGrabbableRef.current.moveableComponent.triggerRegrab(ref, trans);
    }
    public render(){
        return(
            <AvStandardGrabbable modelUri={ "models/grabber.glb" } modelScale={ 0.5 } remoteInterfaceLocks={[]}>
                <AvTransform translateY={ 0.05 } translateX={0.1} rotateX={45} >
                    <CaCustomGrabbable modelUri={ "models/draw_card_icon.glb" } onGrab={ this.drawCard } ref={this.m_newCardGrabbableRef} />
                </AvTransform>
                <AvTransform translateZ={ 0.15 } translateX={0.1} rotateX={90}>
                    {this.state.drawnCards.map(cardVal => (
                        <PlayingCard card={cardVal} constrCallback={this.onNewCard} key={cardVal} ref={this.m_cardRefs[cardVal]} />
                    ))}
                </AvTransform>
                <AvTransform translateY={ 0.05 } translateX={-0.10} rotateX={45} rotateY={45}>
                    <AvGrabButton modelUri={ "models/return_card_icon.glb" } onClick={ this.gather } />
                </AvTransform>
            </AvStandardGrabbable>
        );
    }
} 

export default CardDeck;