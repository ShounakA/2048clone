var gameSize=10;
var tileModel = [];
var starterChoices = [2,2,2,4];
var tilesToSpawn=0;
var toggle=true;
var move = '';
var score = 0;
var isGameOver=false;
function setup(){
    let myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('game-board');
    initBoard()

}
function draw(){
    clear()
    let mainBoxWidth=windowHeight;
    let mainBoxHeight=windowHeight;
    let xPos = ((windowWidth/2)-(mainBoxWidth/2));
    let yPos = ((windowHeight/2)-(mainBoxHeight/2));
    let xscorePos=20;
    let yscorePos=20;
    padding = 10;
    strokeWeight(2);
    fill(0,0,0);
    text("2048",xscorePos,yscorePos);
    text("Score: "+score,xscorePos+100,yscorePos);
    noFill();
    mainBorder = rect(xPos,yPos,mainBoxWidth,mainBoxHeight);
    strokeWeight(1);
    tileWidth= mainBoxWidth-2*padding;
    tileBoard = rect(xPos+padding,yPos+padding, tileWidth, tileWidth);
    for (x=0;x<gameSize;x++){
        for (j=0;j<gameSize;j++){
            if (tileModel[x][j]!=0){
                drawTile(x,j,tileWidth,xPos+padding,yPos+padding,gameSize,tileModel[x][j]);
            }
        }
    }

}
function drawTile( tileX, tileY, mainTileWid, xPos, yPos, tileSize, tileValue){
    off=5
    squarePosX=xPos+off;
    squarePosY=yPos+off;
    squareWidth = (mainTileWid-(2*off))/tileSize;
    colors =getColor(tileValue);
    colorMode(HSB);
    fill(colors[0],colors[1],colors[2])
    rect((squarePosX+tileX*squareWidth),(squarePosY+tileY*squareWidth), squareWidth, squareWidth);
    noFill();
    colorMode(RGB);
    fill(255,255,255)
    text(tileValue,(squarePosX+tileX*squareWidth),(squarePosY+tileY*squareWidth),squareWidth,squareWidth)
    noFill();
    textAlign(CENTER, CENTER);
}
function tileRoll(){
    count=0;
    let x = int(random(0, gameSize));
    let y = int(random(0,gameSize));
    let value=tileModel[x][y];
    while(value!=0){
        x = int(random(0, gameSize));
        y = int(random(0,gameSize));
        value=tileModel[x][y];
    }
    tileModel[x][y]=random(starterChoices);;
    return;

}
function touchDragged(event) {
    if (event.movementX<0){
        move='left'
    } else if (event.movementX>0){
        move='right'
    }else if (event.movementY<0){
        move='up'
    }else if (event.movementY>0){
        move='down'
    }else{
        move=''
    }
}
function touchReleased(){
    if (keyCode==='down'){
        moveDown(boardCopy)
        spawn(boardCopy);
    }else if (keyCode==='up'){
        moveUp(boardCopy)
        spawn(boardCopy);
    }else if (keyCode==='left'){
        moveLeft(boardCopy)
        spawn(boardCopy);
    }else if (keyCode==='right'){
        moveRight(boardCopy)
        spawn(boardCopy);
    }else{
        
    }
}
function keyPressed(){
    boardCopy =JSON.parse(JSON.stringify(tileModel))
    if (keyCode===DOWN_ARROW){
        moveDown(boardCopy)
        spawn(boardCopy);
    }else if (keyCode===UP_ARROW){
        moveUp(boardCopy)
        spawn(boardCopy);
    }else if (keyCode===LEFT_ARROW){
        moveLeft(boardCopy)
        spawn(boardCopy);
    }else if (keyCode===RIGHT_ARROW){
        moveRight(boardCopy)
        spawn(boardCopy);
    }
    if (gameEnded(boardCopy)) {
        alert('GAME OVER!\n Final Score: '+score);
        resetTiles();
    }
}
function initBoard(){
    resetTiles();
    boardCopy =JSON.parse(JSON.stringify(tileModel))
    spawn(boardCopy);
    score=0;
}
function spawn(board){
    let initialized = false;
    let x,y;
    let r,len=0;
    let  n;
    let mylist=[];
    for (let i=0;i<gameSize*gameSize;i++){
        mylist.push([0,0]);
    }
    for (x=0;x<gameSize;x++) {
        for (y=0;y<gameSize;y++) {
            if (board[x][y]==0) {
                mylist[len][0]=x;
                mylist[len][1]=y;
                len++;
            }
        }
    }

    if (len>0) {
        r = int(random(0,len)%len);
        x = mylist[r][0];
        y = mylist[r][1];
        n = random(starterChoices);
        board[x][y]=n;
    }
    tileModel=board;
}
function resetTiles(){
    for (i=0;i<gameSize;i++){
        tileModel.push([]);
        for (j=0;j<gameSize;j++){
            tileModel[i].push(0);
        }
    }
}
function findTarget(row,x,stop){
    if (x==0){
        return x;
    }
    for (let t=x-1;;t--){
        if (row[t]!=0){
            if (row[t]!=row[x]){
                return t+1;
            }
            return t;
        }else{
            if (t==stop){
                return t;
            }
        }
    }
    //did not find target
    return x;
}
function slideArray(row){
    success=false
    stop=0;
    for (let x=0;x<gameSize;x++){
        if (row[x]!=0){
            t= findTarget(row, x,stop);
            if (t!=x){
                if (row[t]===0){
                    row[t]=row[x]
                }else if (row[t]===row[x]) {
					// merge (increase power of two)
					row[t]+=row[x];
					// increase score
                    score+=1<<row[t];
					// set stop to avoid double merge
					stop = t+1;
				}
				row[x]=0;
				success = true;
            }
        }
    }
    return success;
}
 function rotateBoard(board) {
	let n=gameSize;
	
	for (let i=0; i<n/2; i++) {
		for (let j=i; j<n-i-1; j++) {
			tmp = board[i][j];
			board[i][j] = board[j][n-i-1];
			board[j][n-i-1] = board[n-i-1][n-j-1];
			board[n-i-1][n-j-1] = board[n-j-1][i];
			board[n-j-1][i] = tmp;
		}
    }
}
function moveUp(board) {
	let success = false;
	for (x=0;x<gameSize;x++) {
		success |= slideArray(board[x]);
    }
    tileModel=board;
	return success;
}
function moveLeft(board) {
	// success;
	rotateBoard(board);
	let success = moveUp(board);
	rotateBoard(board);
	rotateBoard(board);
    rotateBoard(board);
    tileModel=board;
	return success;
}

function moveDown(board) {
	// success;
	rotateBoard(board);
	rotateBoard(board);
	let success = moveUp(board);
	rotateBoard(board);
    rotateBoard(board);
    tileModel=board;
	return success;
}
function moveRight(board) {
	// success =false;
	rotateBoard(board);
	rotateBoard(board);
	rotateBoard(board);
	let success = moveUp(board);
    rotateBoard(board);
    tileModel=board;
	return success;
}
function countEmpty(board) {
	
	let count=0;
	for (let x=0;x<gameSize;x++) {
		for (let y=0;y<gameSize;y++) {
			if (board[x][y]==0) {
				count++;
			}
		}
	}
	return count;
}
function gameEnded(board) {
    let ended = true;
	if (countEmpty(board)>0) return false;
	if (findPairDown(board)) return false;
	rotateBoard(board);
	if (findPairDown(board)) ended = false;
	rotateBoard(board);
	rotateBoard(board);
	rotateBoard(board);
	return ended;
}
function findPairDown(board) {
	let success = false;
	for (let x=0;x<gameSize;x++) {
		for (let y=0;y<gameSize-1;y++) {
			if (board[x][y]==board[x][y+1]) return true;
		}
	}
	return success;
}
function getColor(value){
    let length = Math.log(value) * Math.LOG10E + 1|0;
    let toDivide = 10*length;
    let h = (value/toDivide)*360;
    let s = 100;
    let l = value/toDivide*50;
    return [h,s,l];
}