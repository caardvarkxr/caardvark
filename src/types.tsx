export type CardItem = {
	cardValue: CardValue;
	itemId?: string;
}

export enum CardValue{
	Loading = 0,

	Clubs1 = 101,	Clubs2,	Clubs3,	Clubs4,
	Clubs5,	Clubs6,	Clubs7,	Clubs8,
	Clubs9,	Clubs10, Clubs11, Clubs12,
	Clubs13,

	Diamonds1 = 201, Diamonds2,
	Diamonds3,	Diamonds4,	Diamonds5,	Diamonds6,
	Diamonds7,	Diamonds8,	Diamonds9,	Diamonds10,
	Diamonds11, Diamonds12, Diamonds13, 
	
	Hearts1 = 301, Hearts2, Hearts3,	Hearts4, Hearts5,
	Hearts6, Hearts7, Hearts8, Hearts9,
	Hearts10, Hearts11, Hearts12, Hearts13,

	Spades1 = 401,	Spades2, Spades3,
	Spades4, Spades5,	Spades6, Spades7,
	Spades8, Spades9,	Spades10, Spades11,
	Spades12, Spades13,

	}