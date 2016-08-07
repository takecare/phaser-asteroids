var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
};

var states = {
    game: "game",
};

var graphicAssets = {
  ship: {URL:'assets/ship.png', name:'ship'},
  bullet: {URL:'assets/bullet.png', name:'bullet'},
  asteroidLarge: {URL:'assets/asteroidLarge.png', name:'asteroidLarge'},
  asteroidMedium: {URL:'assets/asteroidMedium.png', name:'asteroidMedium'},
  asteroidSmall: {URL:'assets/asteroidSmall.png', name:'asteroidSmall'},
};

var shipProperties = {
    startX: gameProperties.screenWidth / 2,
    startY: gameProperties.screenHeight / 2,
    acceleration: 300,
    friction: 100,
    maxVelocity: 300,
    angularVelocity: 200
};

var gameState = function (game) {
  this.shipSprite;
};

gameState.prototype = {
  preload: function () {
    // game.load -> Loader class
    game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
    game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
    game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
    game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);

    // Loader class. method: spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)
    game.load.spritesheet(graphicAssets.ship.name, graphicAssets.ship.URL, 22, 15); // TODO move dimens to obj
  },
  create: function() {
    this.initGraphics();
    this.initPhysics();
  },
  update: function() {
    // TODO ...
  },
  initGraphics: function () {
    // GameObjectFactory class. method: sprite(x, y, key, frame, group)
    this.shipSprite = game.add.sprite(shipProperties.startX,
                                      shipProperties.startY,
                                      graphicAssets.ship.name);
    // AnimationManager class. method: add(name, frames, frameRate, loop, useNumericIndex)
    this.shipSprite.animations.add('moving', [0, 1], 10, true, false);
    this.shipSprite.angle = -90; // rotate 90d cw
    this.shipSprite.anchor.set(0.5, 0.5); // translate the sprite anchor point to its center
  },
  initPhysics: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(shipSprite)
  }
}

var game = new Phaser.Game(
  gameProperties.screenWidth,
  gameProperties.screenHeight,
  Phaser.AUTO,
  'gameDiv'
);
game.state.add(states.game, gameState);
game.state.start(states.game);
