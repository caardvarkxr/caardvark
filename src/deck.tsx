import {  AvComposedEntity, AvGadget, AvGrabButton, AvModel, AvStandardGrabbable, AvTransform, GrabbableStyle, MoveableComponent, MoveableComponentState  } from '@aardvarkxr/aardvark-react';
import { AvVolume, EVolumeType, g_builtinModelBox, g_builtinModelGear, g_builtinModelHook, g_builtinModelPlus, InitialInterfaceLock } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import React, {useState} from 'react';
import { PlayingCard } from './card';
import { CardValue} from './types';

const k_DeckInterface = "CardDeckState@1";

interface DeckNetworkEvent  {
    type: "draw" | "reset" | "gather";
    drawnCards?: CardValue[];
    remainingCards?: CardValue[];
}

type DeckProps = {
}

enum SpawnerPhase
{
	Idle,
	WaitingForRef,
}

type DeckState = {
    spawnerPhase: SpawnerPhase;
    drawnCards: CardValue[];
    remainingCards: CardValue[];
    newlyDrawnCard?: CardValue;
}


class CardDeck extends React.Component<DeckProps, DeckState>{

    private m_grabbableRef = React.createRef<AvStandardGrabbable>();
    private grabspawnerMoveableComp = new MoveableComponent(this.onGrabspawnerUpdate, false, false);
    private grabspawner = React.createRef< AvComposedEntity >();


	constructor( props: any )
	{
        super( props );

        let fullDeck = []
        for (let i = 0; i < 52; i++) {
            fullDeck.push(i);
        }                        

        this.shuffle(fullDeck);

        this.state = {
            spawnerPhase: SpawnerPhase.Idle,
            drawnCards: [],
            remainingCards: fullDeck
        }

    }


    public componentDidMount(){
        if( !AvGadget.instance().isRemote )
		{
			//AvGadget.instance().registerForSettings( this.onSettingsReceived );
		}
		else // We are remote!
		{
            let params = AvGadget.instance().findInitialInterface( k_DeckInterface )?.params as DeckState;
            if(params){
                this.setState( params );			
            } 
		}
    }

    public componentDidUpdate()
    {
        if( !AvGadget.instance().isRemote )
		{
		}
    }


    @bind
    public onRemoteEvent(event: DeckNetworkEvent){
        switch(event.type){
            case "reset":
                if(!AvGadget.instance().isRemote){
                    console.log("Received unexpected reset event on non-remote");
                }
                else{
                    this.setState({drawnCards: event.drawnCards, remainingCards: event.remainingCards});
                }
                break;
            case "draw":
                this.drawCard();
                break;
            case "gather":
                this.gatherCards();
                break;
        }
    }

    @bind
    public onGrabspawnerUpdate(){
        if (this.grabspawnerMoveableComp.state == MoveableComponentState.Grabbed
            && this.state.spawnerPhase == SpawnerPhase.Idle){

            this.drawCard();
        }
    }

    @bind
    public gatherCards(){
         if( AvGadget.instance().isRemote )
		{
			let e: DeckNetworkEvent = { type: "gather" };
			this.m_grabbableRef.current?.sendRemoteEvent( e, true );
		}
		else
		{
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

            let e: DeckNetworkEvent = { type: "reset",
                                       remainingCards: deck,
                                       drawnCards: [] };
            this.m_grabbableRef.current?.sendRemoteEvent( e, true );

        }
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
         if( AvGadget.instance().isRemote )
		{
            console.log("remote drawCard()")
			let e: DeckNetworkEvent = { type: "draw" };
			this.m_grabbableRef.current?.sendRemoteEvent( e, true );
		}
		else
		{
            console.log("local drawCard()")
            if(this.state.remainingCards.length == 0){
                console.log("out of cards, drawcard is no-op")
                return;
            }
            let deck = this.state.remainingCards;

            let newCard = deck.pop();

            this.setState({
                spawnerPhase: SpawnerPhase.WaitingForRef,
                remainingCards: deck,
                drawnCards: this.state.drawnCards,
                newlyDrawnCard: newCard
            });
            let e: DeckNetworkEvent = { type: "reset",
                                       remainingCards: deck,
                                       drawnCards: [...this.state.drawnCards, newCard] };
            this.m_grabbableRef.current?.sendRemoteEvent( e, true );
        }
    }

    @bind
    public onNewCardSpawned(newSpawn: AvStandardGrabbable ){
        if(!newSpawn  ){
            console.log("onNewCardSpawned() newSpawn == null :O ");
            return;
        }
        
        console.log("onNewCardSpawned() triggering regrab " );
        this.grabspawnerMoveableComp.triggerRegrab(newSpawn.globalId, 
            {rotation:{x:0.7071, y:0,z: 0, w:0.7071}});

        this.setState({
            spawnerPhase: SpawnerPhase.Idle,
            remainingCards: this.state.remainingCards,
            drawnCards: [...this.state.drawnCards, this.state.newlyDrawnCard ],
            newlyDrawnCard: null
        })
    }
    
    public render(){
        let remoteInitLocks: InitialInterfaceLock[] = [];

		if( !AvGadget.instance().isRemote )
		{
			remoteInitLocks.push( {
				iface: k_DeckInterface,
				receiver: null,
				params: this.state
			} );
        }

        let  grabspawnerVolume : AvVolume = {
            type: EVolumeType.ModelBox,
            uri: "models/draw_card_icon.glb"
        }

        let drawnCards: JSX.Element[] = [];

        this.state.drawnCards.map(cardVal => (
            drawnCards.push(<PlayingCard card={cardVal} key={cardVal}/>)
            ))

        if(this.state.newlyDrawnCard){
            drawnCards.push(<PlayingCard card={this.state.newlyDrawnCard} key={this.state.newlyDrawnCard} 
                spawnerCallback={this.onNewCardSpawned}/>);
            console.log("Rendering new card");
        }


        return(
            <AvStandardGrabbable style={GrabbableStyle.Gadget} modelUri={ "models/caardvark_icon.glb" } 
                modelScale={ 0.25 } remoteInterfaceLocks={remoteInitLocks} ref={this.m_grabbableRef}
                remoteGadgetCallback={this.onRemoteEvent}>
                <AvTransform translateY={ 0.05 } translateX={0.1} rotateX={0} >
                    <AvComposedEntity components={[this.grabspawnerMoveableComp]} ref={this.grabspawner}
                        volume={grabspawnerVolume} debugName="Spawner">
                        <AvModel uri={ "models/draw_card_icon.glb" } />
                    </AvComposedEntity>
                    <AvTransform rotateX={90} >
                        { drawnCards }
                    </AvTransform>
                </AvTransform>
                <AvTransform translateY={ 0.05 } translateX={-0.10} rotateX={45} rotateY={45}>
                    <AvGrabButton modelUri={ "models/return_card_icon.glb" } onClick={ this.gatherCards.bind(this) } />
                </AvTransform>
            </AvStandardGrabbable>
        );
    }
} 

export default CardDeck;