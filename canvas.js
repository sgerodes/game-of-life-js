// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width;
canvas.height;
let generationCounter = document.getElementById("generationCounter");

// Variables
let resolution = document.getElementById("resolutionSlider").value;
let n;
let m;
let universe;
const liveCellColor = "#327257";
const deadCellColor = "#D2E9E5";
let agingSpeed = document.getElementById("speedSlider").value;
let interval;

//click and press event handlers
canvas.addEventListener('click',function (event) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    let universeX = Math.floor(mouseX/resolution);
    let universeY = Math.floor(mouseY/resolution);
    let universeCell = new Point(universeX,universeY);
    let cellIsAlive = universe.isAlive(universeCell);
    if (cellIsAlive === undefined){
        return;
    }
    if (cellIsAlive){
        universe.killCell(universeCell);
    } else {
        universe.vivifyCell(universeCell);
    }
    drawSquare(universeCell);
});
window.addEventListener("keyup", function dealWithKeyboard(e) {
    if (e.keyCode === 32){
        if (interval){
            stopAnimate();
        } else {
            animateCanvas();
        }
    }
});


function resSliderChange(val){
    document.getElementById("resolutionText").innerHTML = "Resolution " + val;
    resolution = val;
    init();
}
function speedSliderChange(val){
    document.getElementById("speedText").innerHTML = "Aging speed " + (val/1000.0) + " s";
    agingSpeed = val;
    if (interval){
        stopAnimate();
        animateCanvas();
    }
}

function square (x, y, resolution,color) {
    this.x = x;
    this.y = y;
    this.resolution = resolution;
    this.color = color;

    this.draw = function () {
        c.beginPath();
        c.rect(this.x, this.y, this.resolution, this.resolution);
        c.fillStyle = this.color;
        c.fill();
        c.strokeStyle = "white";
        c.stroke();
        c.closePath();
    };
}

function createSquare(cell, isAlive){
    let color = isAlive ? liveCellColor : deadCellColor;
    return new square(cell.x * resolution, cell.y * resolution, resolution, color);
}

function redraw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    let squaresArray = [];
    for (let i = 0; i < universe.width; ++i) {
        for (let j = 0; j < universe.height; ++j) {
            let cell=new Point(i,j);
            if (universe.isAlive(cell)){
                squaresArray.push(createSquare(cell,true));
            } else {
                squaresArray.push(createSquare(cell,false));
            }
        }
    }
    squaresArray.forEach(square => {square.draw();});
}

function ageAndDraw(){
    universe.ageOneGeneration();
    redraw();
    generationCounter.innerHTML = "Generation " + universe.generation;
}

function init() {
    stopAnimate();
    n = Math.floor(canvas.width / resolution);
    m = Math.floor(canvas.height / resolution);
    universe = new Universe(n,m);
    generationCounter.innerHTML = "Generation 0";
    redraw();
}

function canvasInit(){
    canvas.width = innerWidth;
    canvas.height = innerHeight*0.7;
    init();
}

function drawSquare(cell){
    createSquare(cell, universe.isAlive(cell)).draw();
}

function createRandomUniverse(){
    init();
    universe.randomiseUniverse();
    redraw();
}

function animateCanvas(){
    interval = setInterval(ageAndDraw, agingSpeed);
}

function stopAnimate(){
    clearInterval(interval);
    interval = false;
}

canvasInit();
redraw();