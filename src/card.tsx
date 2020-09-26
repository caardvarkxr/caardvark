import { AvPanel, AvPrimitive, AvStandardGrabbable, AvTransform, DefaultLanding, PrimitiveType } from '@aardvarkxr/aardvark-react';
import { Av, g_builtinModelBox } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

type CardProps = {
    suit: number;
    index: number;
}

export const PlayingCard: React.FC<CardProps> = (props) => {
		return (
                <div>
					<AvStandardGrabbable modelUri={ g_builtinModelBox } modelScale={ 0.006 }>
                        <AvTransform translateY={ 0.1 } >
                            <AvPrimitive type={PrimitiveType.Cube} width={0.057} height={0.08} depth={0.001} />
                        </AvTransform>
					</AvStandardGrabbable>
				</div>
		);
}