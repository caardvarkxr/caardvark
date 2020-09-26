import { DefaultLanding } from '@aardvarkxr/aardvark-react';
import { Av } from '@aardvarkxr/aardvark-shared';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CardDeck from './deck';


interface CaardvarkProps
{
}


class Caardvark extends React.Component< {}, CaardvarkProps >
{
	constructor( props: any )
	{
		super( props );
	}

	public componentDidMount()
	{
	}

	public componentWillUnmount()
	{
	}

	public componentDidUpdate()
	{
	}


	public render()
	{
		return (
			<CardDeck/>
			 );
	}

}

let main = Av() ? <Caardvark/> : <DefaultLanding/>
ReactDOM.render( main, document.getElementById( "root" ) );
