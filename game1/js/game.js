//create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;
document.body.appendChild(canvas);

//Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "img/back.jpg";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
    heroImage.width = 20;
    heroImage.height = 20;
};
heroImage.src = "img/player.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "img/monster.png";

//Game objects
var hero = {
    speed: 256,
};
var monster = {
    setX : [],
    setY : [],
    speedX : [],
    speedY : []
};
var monstersCaught = 0;

var timer = setInterval(function () {
    monstersCaught ++;
},1000);

//Handle keyboard controls
var keysDown = {};

addEventListener("keydown",function (e) {
    keysDown[e.keyCode] = true;
},false);

addEventListener("keyup",function (e) {
    delete keysDown[e.keyCode];
},false);

//Reset the game when player catches a monster
var reset = function () {
    hero.x = canvas.width/2;
    hero.y = canvas.height/2;

    //Throw the monster somewhere on th screen randomly
    for(var i =0;i<20;i++){
        monster.setX[i] = 32 + (Math.random()*(canvas.width - 64));
        monster.setY[i] = 32 + (Math.random()*(canvas.height - 64));
        monster.speedX[i] = Math.random()*3;
        monster.speedY[i] = Math.random()*3;
    }
    // monster.x = 32 + (Math.random()*(canvas.width - 64));
    // monster.y = 32 + (Math.random()*(canvas.height - 64));
}

// Update game objects
var update = function (modifier) {
    // var timer = setInterval(function () {
    //     monstersCaught ++;
    // },1000);
    if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
    }
    if(hero.x <= 0){
        hero.x = 0;
    }else if(hero.x>=870){
        hero.x = 870
    }
    if(hero.y <= 0){
        hero.y = 0;
    }else if(hero.y>=570){
        hero.y = 570
    }


    for(var i =0;i<20;i++){
        if(monster.setX[i]>=870){
            monster.speedX[i] = -monster.speedX[i];
        }else if(monster.setX[i]<=0){
            monster.speedX[i] = -monster.speedX[i];
        }
        if(monster.setY[i]>=570){
            monster.speedY[i] = -monster.speedY[i];
        }else if(monster.setY[i]<=0){
            monster.speedY[i] = -monster.speedY[i];
        }
        monster.setX[i] += monster.speedX[i];
        monster.setY[i] += monster.speedY[i];


        if (
            hero.x <= (monster.setX[i] + 32)
            && monster.setX[i] <= (hero.x + 32)
            && hero.y <= (monster.setY[i] + 32)
            && monster.setY[i] <= (hero.y + 32)
        ) {
            monstersCaught = 0;
            reset();
        }
    }


    // Are they touching?
    // if (
    //     hero.x <= (monster.x + 32)
    //     && monster.x <= (hero.x + 32)
    //     && hero.y <= (monster.y + 32)
    //     && monster.y <= (hero.y + 32)
    // ) {
    //     ++monstersCaught;
    //     reset();
    // }
};

// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y,30,30);
    }

    if (monsterReady) {
        for(var i =0 ;i<30; i++){
            ctx.drawImage(monsterImage, monster.setX[i], monster.setY[i],30,30);
        }
    }

    // 计分
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
// Let's play this game!
// window.onload = function () {
reset();
main();
// }