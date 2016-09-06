var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
};

var states = {
    game: "game",
};

var graphicAssets = {
  ship: {URL:'assets/ship.png', name:'ship', width: 22, height: 15},
  bullet: {URL:'assets/bullet.png', name:'bullet'},
  asteroidLarge: {URL:'assets/asteroidLarge.png', name:'large'},
  asteroidMedium: {URL:'assets/asteroidMedium.png', name:'medium'},
  asteroidSmall: {URL:'assets/asteroidSmall.png', name:'small'},
};

var shipProperties = {
  startX: gameProperties.screenWidth / 2,
  startY: gameProperties.screenHeight / 2,
  acceleration: 300,
  friction: 200,
  maxVelocity: 300,
  angularVelocity: 200,
  lives: 3,
  respawnInvulnerability: 3, //sec
};

var bulletProperties = {
  velocity: 400,
  interval: 250,
  lifespan: 2000,
  maxCount: 30
};

var asteroidProperties = {
  startingAsteroids: 4,
  maxAsteroids: 20,
  incrementAsteroids: 2,
  large: { minVelocity: 50, maxVelocity: 150, minAngularVelocity: 0, maxAngularVelocity: 200, score: 20, next: graphicAssets.asteroidMedium.name },
  medium: { minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50, next: graphicAssets.asteroidSmall.name },
  small: { minVelocity: 50, maxVelocity: 300, minAngularVelocity: 0, maxAngularVelocity: 200, score: 100 }
}

var fontAssets = {
  counterStyle: {font: '20px Arial', fill: '#ffffff', align: 'center'}
}

var gameState = function (game) {
  this.shipSprite;
  this.key_left;
  this.key_right;
  this.key_thrust;
  this.key_fire;

  this.bulletGroup;
  this.bulletLastFired = 0;

  this.asteroidGroup;
  this.asteroidCount = asteroidProperties.startingAsteroids;

  this.lives = shipProperties.lives;
  this.livesUi;
};

gameState.prototype = {
  preload: function () {
    // game.load -> Loader class
    game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
    game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
    game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
    game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);

    // Loader class. method: spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)
    game.load.spritesheet(graphicAssets.ship.name, graphicAssets.ship.URL, graphicAssets.ship.width, graphicAssets.ship.height);
  },
  create: function() {
    this.initGraphics();
    this.initPhysics();
    this.initKeyboard();
    this.resetAsteroids();
  },
  update: function() {
    this.pollKeyboard();

    isMoving = function(body) {
      return body
        && (Math.abs(body.velocity.x) > 0 || Math.abs(body.velocity.y > 0))
    }

    if (!isMoving(this.shipSprite.body)) {
      this.shipSprite.animations.stop('moving', 0);
      this.shipSprite.animations.getAnimation('moving').frame = 0;
    }

    this.checkBoundaries(this.shipSprite.body);
    this.bulletGroup.forEachExists(this.checkBoundaries, this);
    this.asteroidGroup.forEachExists(this.checkBoundaries, this);

    game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.collideWithAsteroid, null, this);
    game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.collideWithAsteroid, null, this);
  },
  initGraphics: function() {
    // GameObjectFactory class. method: sprite(x, y, key, frame, group)
    this.shipSprite = game.add.sprite(shipProperties.startX,
                                      shipProperties.startY,
                                      graphicAssets.ship.name);
    // AnimationManager class. method: add(name, frames, frameRate, loop, useNumericIndex)
    this.shipSprite.animations.add('moving', [0, 1], 10, true);
    this.shipSprite.angle = -90; // rotate 90d cw
    this.shipSprite.anchor.set(0.5, 0.5); // translate the sprite anchor point to its center

    // GameObjectFactory class. method: group(parent, name, addToStage, enableBody, physicsBodyType)
    this.bulletGroup = game.add.group();
    this.bulletGroup.createMultiple(bulletProperties.maxCount, graphicAssets.bullet.name);
    this.bulletGroup.setAll('anchor.x', 0.5);
    this.bulletGroup.setAll('anchor.y', 0.5);
    this.bulletGroup.setAll('lifespan', bulletProperties.lifespan);

    this.asteroidGroup = game.add.group();

    this.livesUi = game.add.text(10, 5, this.lives, fontAssets.counterStyle);
  },
  initPhysics: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enable(this.shipSprite);
    this.shipSprite.body.drag.set(shipProperties.friction);
    this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);

    game.physics.arcade.enable(this.bulletGroup);
    this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;

    game.physics.arcade.enable(this.asteroidGroup);
    this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.asteroidGroup.enableBody = true;
  },
  initKeyboard: function() {
    // game.input -> Input class. input.keyboard -> Keyboard class
    // addKey(keycode), returns Key object
    this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
      this.shipSprite.body.acceleration.set(0);
    }

    if (this.key_fire.isDown) {
      this.fire();
    }
  },
  checkBoundaries: function(body) {
    if (body.x > game.width) {
      body.x = 0;
    } else if (body.x < 0) {
      body.x = game.width;
    }
    if (body.y > game.height) {
      body.y = 0;
    } else if (body.y < 0) {
      body.y = game.height;
    }
  },
  fire: function() {
    if (game.time.now > this.bulletLastFired + bulletProperties.interval) {
      bullet = this.bulletGroup.getFirstExists(false);
      if (bullet) {
        length = this.shipSprite.width * 0.5;
        x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length)
        y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length)

        bullet.reset(x, y);
        bullet.lifespan = bulletProperties.lifespan;
        bullet.rotation = this.shipSprite.rotation;

        game.physics.arcade.velocityFromRotation(this.shipSprite.rotation,
                                                 bulletProperties.velocity,
                                                 bullet.body.velocity);
        this.bulletLastFired = game.time.now;
      }
    }
  },
  createAsteroid: function(x, y, sizeKey) { // key <=> index
    asteroid = this.asteroidGroup.create(x, y, sizeKey);
    let asteroidSize = asteroidProperties[sizeKey];
    asteroid.anchor.set(0.5, 0.5);
    asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidSize.minAngularVelocity, asteroidSize.maxAngularVelocity);
    let randomRotationAngle = game.math.degToRad(game.rnd.angle());
    let randomVelocity = game.rnd.integerInRange(asteroidSize.minVelocity, asteroidSize.maxVelocity);
    game.physics.arcade.velocityFromRotation(randomRotationAngle, randomVelocity, asteroid.body.velocity);
  },
  resetAsteroids: function() {
    for (i=0; i<this.asteroidCount; i++) {
      let side = Math.round(Math.random()), x, y;
      if (side) {
        x = Math.round(Math.random()) * gameProperties.screenWidth;
        y = Math.random() * gameProperties.screenHeight;
      } else {
        x = Math.random() * gameProperties.screenWidth;
        y = Math.round(Math.random()) * gameProperties.screenHeight;
      }
      this.createAsteroid(x, y, graphicAssets.asteroidLarge.name);
    }
  },
  collideWithAsteroid: function(target, asteroid) {
    target.kill();
    asteroid.kill();
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
