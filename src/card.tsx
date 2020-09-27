import { AvComposedEntity,  AvGadget,  AvGadgetList,  AvModel,  AvPrimitive, AvStandardGrabbable, AvTransform, GadgetSeedContainerComponent, MoveableComponent, NetworkedGadgetComponent, PrimitiveType, RemoteGadgetComponent } from '@aardvarkxr/aardvark-react';
import { AvVolume, EVolumeType, g_builtinModelBox, g_builtinModelCylinder, g_builtinModelPanel, infiniteVolume, InitialInterfaceLock,  } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import {CardValue} from './types';
const equal = require( 'fast-deep-equal' );

type CardProps = {
	card: CardValue;
	moveCallback: Function;
}

type CardState = {
}

const k_PlayingCardInterface = "PlayingCardIf@1";

const cardWidth = 0.057;
const cardHeight = 0.08;
const cardDepth = 0.001;
const cardGrabMargin = 0.01;

export class PlayingCard extends React.Component<CardProps, CardState>{

	private moveableComponent: MoveableComponent;
	private networkedComponent: NetworkedGadgetComponent;
	private remoteComponent: RemoteGadgetComponent;
	private gadgetListRef: React.RefObject<AvGadgetList> = React.createRef<AvGadgetList>();

    private k_cardHitbox =
	{
		type: EVolumeType.AABB,
		aabb: 
		{
			xMin: -cardWidth - cardGrabMargin, xMax: cardWidth + cardGrabMargin,
			zMin: -cardDepth - cardGrabMargin, zMax: cardDepth + cardGrabMargin,
			yMin: -cardHeight - cardGrabMargin, yMax: cardHeight + cardGrabMargin,	
		}
	} as AvVolume;

	constructor( props: any )
	{

		super( props );

   		let remoteInitLocks: InitialInterfaceLock[] = [];

		if( !AvGadget.instance().isRemote )
		{
			remoteInitLocks.push( {
				iface: k_PlayingCardInterface,
				receiver: null,
				params: this.state
			} );
		}

		let remoteLock = AvGadget.instance().initialInterfaces.find( ( value ) => 
			value.iface == RemoteGadgetComponent.interfaceName );
		this.moveableComponent =  new MoveableComponent( () => {}, false, true );
		if( remoteLock )
		{
			this.remoteComponent = new RemoteGadgetComponent(this.onRemoteEvent);
		}else{
			// this gadget is master, or will be if the user enters a room
			this.networkedComponent = new NetworkedGadgetComponent( remoteInitLocks, this.onRemoteEvent );
		}

	}

	@bind
	public onRemoteEvent(){

	}

	componentDidUpdate( prevProps: CardProps )
	{
	}
	
	public onTransformUpdated() {			
	}

	/** Sends an event to another instance of this gadget. If this gadget is
	 * the master, the event is sent to all remote instances. If this gadget 
	 * is remote, the event is sent to the master. If this gadget is not networked,
	 * or if it is networked, but the user is not currently in a room, the 
	 * event is discarded.
	 */
	public sendRemoteEvent( event: object, reliable: boolean )
	{
		this.networkedComponent?.sendEventToAllRemotes( event, reliable );
		this.remoteComponent?.sendEventToMaster( event, reliable );
	}

	public render(){

		return (
			<AvComposedEntity components={[this.moveableComponent]} volume={this.k_cardHitbox}> 
				{ this.networkedComponent
				&& <AvComposedEntity components={ [ this.networkedComponent]} volume={infiniteVolume()} /> }
				<AvTransform scaleX={0.056 * 1.4} scaleY={0.001} scaleZ={0.0889 * 1.4} rotateX={90}> 
					<AvModel uri={g_builtinModelPanel} useTextureFromUrl={"card_textures/" + CardValue[this.props.card] + ".png"} />
				</AvTransform>
				<AvTransform translateZ={-0.001} scaleX={0.056 * 1.4} scaleY={0.001} scaleZ={0.0889 * 1.4} rotateX={90}> 
					<AvModel uri={g_builtinModelPanel} useTextureFromUrl={"card_textures/cardback.png"} />
				</AvTransform>
			</AvComposedEntity>
		);
	}
}