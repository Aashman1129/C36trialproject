var dog,hungryDod,happyDog,database,foodS,foodStock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var currentTime;
var milk,input,name;
var gameState="hungry";
var gameStateRef;
var foodStockRef;
var frameCountNow=0;
var input,button;
var bedroomIMG,gardenIMG,washroomIMG,sleepIMG,runIMG;

function preload()
{
hungryDog=loadImage("images/dogImg.png");
 happyDog=loadImage("images/happydogImg.png");
 bedroomIMG=loadImage("images/Bed Room.png");
 gardenIMG=loadImage("images/Garden.png");
 washroomIMG=loadImage("images/Wash Room.png");
 sleepIMG=loadImage("images/Lazy.png");
 runIMG=loadImage("images/running.png");
}

function setup() {
	createCanvas(1200,500);
  database=firebase.database();

  foodObj =  new Food();

  //foodStock=database.ref('Food')
  //foodStock.on("value",readStock);
  //foodStock.set(20);

  dog=createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("hungry",hungryDog);
  dog.addAnimation("happy",happyDog);
  dog.addAnimation("sleeping",sleepIMG);
  dog.addAnimation("run",runIMG);
  dog.scale=0.3;

getGameState;

  feed = createButton("Feed the Dog");
  feed.position(950,95);
  feed.mousePressed(feedDog);


  addFood = createButton("Add Food");
  addFood.position(1050,95);
  addFood.mousePressed(addFoods);


  input=createInput("Pet Name");
  input.position(950,120);



button=createButton("Confirm");
button.position(1000,145);
button.mousePressed(createName);

}


function draw() {  
background("green");
currentTime=hour();


if(currentTime === lastFed + 1){
  gameState="playing";
  updateGameState();
  foodObj.garden();
}
else if(currentTime===lastFed+2){
  gameState="sleeping";
  updateGameState();
  foodObj.bedroom();
}
else if(currentTime>lastFed+2&&currentTime<=lastFed+4){
  gameState="bathing";
  updateGameState();
  foodObj.washroom();
}
else{
  gameState="hungry";
  updateGameState();
  foodObj.display();
}

foodObj.getFoodStock();

getGameState();

fedTime = database.ref("Feed Time");
fedTime.on("value",function(data){
lastFed= data.val();
})


if(gameState==="hungry"){
feed.show();
addFood.show();
dog.addAnimation("hungry",hungryDog);
}
else{
  feed.hide();
  addFood.hide();
  dog.remove();
}


//foodObj.display();
drawSprites();


textSize(32);
fill("red");
textSize(20);
text("Last Fed:"+lastFed+":00",300,95);
text("Time since last fed:"+(currentTime-lastFed),300,125);

}



function feedDog(){
 foodObj.deductFood();
 foodObj.updateFoodStock();
 dog.changeAnimation("happy",happyDog);
 updateGameState();
}


function addFoods(){
 foodObj.addFood();
 foodObj.updateFoodStock();
}





function createName(){
  input.hide();
  button.hide();


  name= input.value();
  var greeting= createElement('h3');
  greeting.html("Pet's name:"+name);
  greeting.position(width/2+850,heght/2+200);

}


function getGameState(){
  gameStateRef=database.ref('gameState');
  gameStateRef.on("value",function(data){
gameState=data.val();
  })
}

function updateGameState(){
  database.ref('/').update({
    gameState:gameState
  })
}






