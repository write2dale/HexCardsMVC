/// <reference path="phaser.js" />
/// <reference path="main.js" />
//test merge
Card = function (point, values, elementNum, frameNum, cardScale) {
    this.position = point;
    this.values = values || [1, 7, 3];
    this.owner = 0; //1 for playerOne;  2 for playerTwo

    this.cardImg = game.add.sprite(this.position.x, this.position.y, 'elementalBGs', this.frame);
    this.cardImg.anchor.setTo(0.5, 0.5);
    this.cardImg.scale.setTo(cardScale);

    var frameImage = game.add.sprite(0, 0, 'cardFrameSheet', frameNum)
    var numberLeft = game.add.sprite(-62, -20, 'numberSheet', this.values[0]);
    var numberBottom = game.add.sprite(0, 53, 'numberSheet', this.values[1]);
    var numberRight = game.add.sprite(62, -20, 'numberSheet', this.values[2]);
    var character = game.add.sprite(0, -32, 'wolf');

    numberLeft.anchor.setTo(0.5, 0.5);
    numberBottom.anchor.setTo(0.5, 0.5);
    numberRight.anchor.setTo(0.5, 0.5);
    frameImage.anchor.setTo(0.5, 0.5);
    character.anchor.setTo(0.5, 0.5);

    //we'll bing all the sprites to the this.cardImg one and then they'll follow the this.cardImg as it's dragged
    this.cardImg.addChild(frameImage);
    this.cardImg.addChild(numberLeft);
    this.cardImg.addChild(numberBottom);
    this.cardImg.addChild(numberRight);
    this.cardImg.addChild(character);
    this.cardImg.hitArea = new Phaser.Circle(0, 0, 125);

    this.origPos = CopyObject(point);
    this.cardImg.inputEnabled = true;
    this.cardImg.input.enableDrag(true);
    this.cardImg.events.onDragStop.add(this.dragStop, this);

}

Card.prototype.dragStop = function (cardImg) {
    //can't play if it isn't your turn
    if (!game.myTurn) {
        cardImg.position = CopyObject(this.origPos);
        return;
    }

    //lets check to see if it landed on the board, otherwise return to original location
    var onBoard = false;
    var cardCenter = { x: cardImg.position.x + cardImg.width / 2, y: cardImg.position.y + cardImg.height / 2 };

    for (var i = 0; i < mainState.emptyGameBoardHexes.length; i++) {
        var boardHex = mainState.emptyGameBoardHexes.getAt(i);
        if (boardHex.position.x < cardCenter.x && cardCenter.x < boardHex.position.x + boardHex.width &&
         boardHex.position.y < cardCenter.y && cardCenter.y < boardHex.position.y + boardHex.width) {
            //only place if not already on the board
            if (mainState.board.slots[i] == null) {
                //found hex on board
                onBoard = true;
                cardImg.position = CopyObject(boardHex.position);
                mainState.board.PlaceCard(i, this);
                cardImg.inputEnabled = false;
                break;
            }
        }
    }
    //return to origPos
    if (!onBoard) {
        cardImg.position = CopyObject(this.origPos);
    }
}

Card.prototype.SetOwner = function (owner) {

    this.owner = owner;

    //the children[0] is the first sprite added to the cardImg sprite group, hence the frame image
    if (this.owner == 1) {
        this.cardImg.children[0].frame = 4;
    } else {
        this.cardImg.children[0].frame = 5;
    }

}

//will contain all the cards that have been played to the board.
//for now the board will only worry about dealing with the cards that have been played
//eventually will probably have the emptyhexes also contain in here as well as the background image.
function Board() {
    //slots will either be null or contain a card
    this.slots = [];

    //called by this player
    this.PlaceCard = function (slotIndex, card) {
        this.UpdateBoard(card);
        this.slots[slotIndex] = card;
        mainState.toggleTurn(false);

        //websocket, send info to other player
        websocket.send(JSON.stringify({ action: 'go', card: { slotIndex: slotIndex, values: card.values, owner: card.owner } }));
        
    }

    //called by opponent
    //will only be called from websocket, hence the other player played a card, later we'll have to pass more card info in when we have card img's pass into card constructor
    this.CreateCard = function (slotIndex, values, owner) {
        //get the point coords
        var point = { x: mainState.emptyGameBoardHexes.getAt(slotIndex).x, y: mainState.emptyGameBoardHexes.getAt(slotIndex).y };

        var card = new Card(point, values, 0, 3, globalScale);
        card.SetOwner(owner);        
        this.UpdateBoard(card);

        this.slots[slotIndex] = card;
        mainState.toggleTurn(true);
    }

    //flips neighbor cards if they should be flipped
    this.UpdateBoard = function (card) {
        for (var i = 0; i < this.slots.length; i++) {
            if (slots[i] != null) {
                //check to see if its a neighbor
                var cardInSlot = slots[i];
                
            }
        }
    }
}


