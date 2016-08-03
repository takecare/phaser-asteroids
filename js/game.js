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
};

var gameState = function (game) {
  this.shipSprite;
};

gameState.prototype = {

  preload: function () {
      game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
      game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
      game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
      game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
      game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);
  }
}
