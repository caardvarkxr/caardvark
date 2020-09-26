import { AvGadget, AvPanel, AvStandardGrabbable, AvTransform, HighlightType, DefaultLanding } from '@aardvarkxr/aardvark-react';
import { EAction, EHand, g_builtinModelBox, InitialInterfaceLock, Av } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PlayingCard } from './card';

const k_TestPanelInterface = "test_panel_counter@1";

enum CardValue{
	Clubs1 = 0,	Clubs2 = 1,	Clubs3 = 2,	Clubs4 = 3,
	Clubs5 = 4,	Clubs6 = 5,	Clubs7 = 6,	Clubs8 = 7,
	Clubs9 = 8,	Clubs10 = 9, Clubs11 = 10, Clubs12 = 11,
	Clubs13 = 12, Spades1 = 13,	Spades2 = 14, Spades3 = 15,
	Spades4 = 16, Spades5 = 17,	Spades6 = 18, Spades7 = 19,
	Spades8 = 20, Spades9 = 21,	Spades10 = 22, Spades11 = 23,
	Spades12 = 24, Spades13 = 25, Diamonds1 = 26, Diamonds2 = 27,
	Diamonds3 = 28,	Diamonds4 = 29,	Diamonds5 = 30,	Diamonds6 = 31,
	Diamonds7 = 32,	Diamonds8 = 33,	Diamonds9 = 34,	Diamonds10 = 35,
	Diamonds11 = 36, Diamonds12 = 37, Diamonds13 = 38, Hearts1 = 39,
	Hearts2 = 40, Hearts3 = 41,	Hearts4 = 42, Hearts5 = 43,
	Hearts6 = 44, Hearts7 = 45, Hearts8 = 46, Hearts9 = 47,
	Hearts10 = 48, Hearts11 = 49, Hearts12 = 50, Hearts13 = 51
	}

interface TestPanelState
{
	count: number;
	grabbableHighlight: HighlightType;
}

interface TestSettings
{
	count: number;
}

interface TestPanelEvent
{
	type: "increment" | "set_count";
	count?: number;
}

class MyGadget extends React.Component< {}, TestPanelState >
{
	private m_actionListeners: number[];
	private m_grabbableRef = React.createRef<AvStandardGrabbable>();

	constructor( props: any )
	{
		super( props );
		this.state = 
		{ 
			count: 0,
			grabbableHighlight: HighlightType.None,
		};
	}

	public componentDidMount()
	{
		if( !AvGadget.instance().isRemote )
		{
			this.m_actionListeners = 
			[
				AvGadget.instance().listenForActionStateWithComponent( EHand.Invalid, EAction.A, this ),
				AvGadget.instance().listenForActionStateWithComponent( EHand.Invalid, EAction.B, this ),
				AvGadget.instance().listenForActionStateWithComponent( EHand.Invalid, EAction.Squeeze, this ),
				AvGadget.instance().listenForActionStateWithComponent( EHand.Invalid, EAction.Grab, this ),
				AvGadget.instance().listenForActionStateWithComponent( EHand.Invalid, EAction.Detach, this ),
			];

			AvGadget.instance().registerForSettings( this.onSettingsReceived );
		}
		else
		{
			let params = AvGadget.instance().findInitialInterface( k_TestPanelInterface )?.params as TestSettings;
			this.onSettingsReceived( params );			
		}
	}

	public componentWillUnmount()
	{
		if( !AvGadget.instance().isRemote )
		{
			for( let listener of this.m_actionListeners )
			{
				AvGadget.instance().unlistenForActionState( listener );
			}

			this.m_actionListeners = [];
		}
	}

	@bind public incrementCount()
	{
		if( AvGadget.instance().isRemote )
		{
			let e: TestPanelEvent = { type: "increment" };
			this.m_grabbableRef.current?.sendRemoteEvent( e, true );
		}
		else
		{
			this.setState( ( oldState ) => 
				{ 
					return { ...oldState, count: oldState.count + 1 };
				} );
		}
	}

	public componentDidUpdate()
	{
		if( !AvGadget.instance().isRemote )
		{
			let e: TestPanelEvent = { type: "set_count", count: this.state.count };
			this.m_grabbableRef.current?.sendRemoteEvent( e, true );
		}
	}


	@bind public onSettingsReceived( settings: TestSettings )
	{
		if( settings )
		{
			this.setState( { count: settings.count } );
		}
	}

	@bind
	private onRemoteEvent( event: TestPanelEvent )
	{
		switch( event.type )
		{
			case "increment":
				if( AvGadget.instance().isRemote )
				{
					console.log( "Received unexpected increment event on remote" );
				}
				else
				{
					this.incrementCount();
				}
				break;
			
			case "set_count":
				if( !AvGadget.instance().isRemote )
				{
					console.log( "Received unexpected set_count event on master" );
				}
				else
				{
					this.setState( { count: event.count } );
				}
				break;		
		}
	}

	public renderActionStateLabel( action: EAction )
	{
		if( AvGadget.instance().getActionStateForHand( EHand.Invalid, action ) )
			return <div className="Label">{ EAction[ action ] }: TRUE</div>;
		else
			return <div className="Label">{ EAction[ action ] }: false</div>;
	}

	public renderRemote()
	{
		return (
			<>
				<div className="Label">Count: { this.state.count }</div>
				<div className="Label">This gadget is owned by somebody else</div>
				<div className="Button" onMouseDown={ this.incrementCount }>
					Increment count...
				</div> 
			</>
		);
	}

	public renderLocal()
	{
		return <>
				<div className="Label">Count: { this.state.count }</div>
				<div className="Label">This gadget is owned by me</div>
				<div className="Button" onMouseDown={ this.incrementCount }>
					Increment count...
				</div> 
				{ this.renderActionStateLabel( EAction.A ) }
				{ this.renderActionStateLabel( EAction.B ) }
				{ this.renderActionStateLabel( EAction.Squeeze ) }
				{ this.renderActionStateLabel( EAction.Grab ) }
				{ this.renderActionStateLabel( EAction.Detach ) }
			</>
	}

	public render()
	{
		let sDivClasses:string = "FullPage";

		let remoteInitLocks: InitialInterfaceLock[] = [];

		if( !AvGadget.instance().isRemote )
		{
			remoteInitLocks.push( {
				iface: k_TestPanelInterface,
				receiver: null,
				params: 
				{
					count: this.state.count,
				}
			} );
		}

		return (
			<PlayingCard suit={2} index={8}/>
			 );
	}

}

let main = Av() ? <MyGadget/> : <DefaultLanding/>
ReactDOM.render( main, document.getElementById( "root" ) );
