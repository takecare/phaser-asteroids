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
    friction: 200,
    maxVelocity: 300,
    angularVelocity: 200
};

var gameState = function (game) {
  this.shipSprite;
  this.key_left;
  this.key_right;
  this.key_thrust;
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
    this.initKeyboard();
  },
  update: function() {
    this.pollKeyboard();
  },
  initGraphics: function () {
    // GameObjectFactory class. method: sprite(x, y, key, frame, group)
    this.shipSprite = game.add.sprite(shipProperties.startX,
                                      shipProperties.startY,
                                      graphicAssets.ship.name);
    // AnimationManager class. method: add(name, frames, frameRate, loop, useNumericIndex)
    this.shipSprite.animations.add('moving', [1], 10, true);
    this.shipSprite.angle = -90; // rotate 90d cw
    this.shipSprite.anchor.set(0.5, 0.5); // translate the sprite anchor point to its center
  },
  initPhysics: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(this.shipSprite);
    this.shipSprite.body.drag.set(shipProperties.friction);
    this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);
    this.shipSprite.body.collideWorldBounds = true;
  },
  initKeyboard: function() {
    // game.input -> Input class. input.keyboard -> Keyboard class
    // addKey(keycode), returns Key object
    this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  },
  pollKeyboard: function() {
    if (this.key_left.isDown) {
      this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
    } else if (this.key_right.isDown) {
      this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
    } else {
      this.shipSprite.body.angularVelocity = 0;
    }

    if (this.key_thrust.isDown) {
      // Physics.Arcade class
      // accelerationFromRotation(rotation, speed, point)
      game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation,
                                                   shipProperties.acceleration,
                                                   this.shipSprite.body.acceleration);
      this.shipSprite.animations.play('moving');
    } else {
      this.shipSprite.animations.stop('moving', 0);
      this.shipSprite.body.acceleration.set(0);
    }
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
