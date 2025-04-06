let torres = [[1,2,0,0,0,0] , [0,0,0,0,0,0] , [0,0,0,0,0,0] , [0,0,0,0,0,0]] //quando alterado muda o estado inicial das torres

let cnv = document.getElementById('cnv')
let ctx = cnv.getContext('2d')

const canvasWidth = 1000;
const canvasHeight = 700;
const barWidth = 20;
const barHeight = 600;
const side = 100
let maxPiece = 2

let barPositions = []
let colors = {}
let selectedPiece = ''

cnv.addEventListener('click' , handleClick)
cnv.addEventListener('mousemove' , handleMouseMove)

function drawBackground(){ //desnha as barras
    barPositions = []
    const numberOfBars = 4;
    const spaceBetween = (canvasWidth - (barWidth * numberOfBars)) / (numberOfBars + 1);
  
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // limpa o canvas
    ctx.fillStyle = "orange";
  
    for (let i = 0; i < numberOfBars; i++) {
      const x = spaceBetween + i * (barWidth + spaceBetween);
      const y = canvasHeight - barHeight;
      barPositions.push(x)
      ctx.fillRect(x, y, barWidth, barHeight);
    }
}

function drawPieces() {
    const side = 100;

    for (let i = 0; i < torres.length; i++) {
        const barX = barPositions[i];
        const centerX = barX + Math.floor(barWidth / 2);
        const x = centerX - Math.floor(side / 2);

        for (let j = 0; j < torres[i].length; j++) {
            const number = torres[i][j];

            if (number === 0) continue;

            // Gera cor se ainda não existir
            if (!colors[number]) {
                const red = Math.floor(Math.random() * 255);
                const green = Math.floor(Math.random() * 255);
                const blue = Math.floor(Math.random() * 255);
                colors[number] = `rgb(${red}, ${green}, ${blue})`;
            }

            const y = canvasHeight - (j + 1) * side;
            const color = colors[number];

            // Desenha quadrado
            ctx.fillStyle = color;
            ctx.fillRect(x, y, side, side);

            // Borda
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 5;
            ctx.strokeRect(x + 0.5, y + 0.5, side - 1, side - 1);

            // Número
            ctx.fillStyle = 'white';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(number, x + side / 2, y + side / 2);
        }
    }
}


function drawSelectedPiece(bar){ //desenha a peça selecionada acima da barra
    updateCanvas()
    const side = 100
    const barX = barPositions[bar];
    const centerX = barX + Math.floor(barWidth / 2);
    const x = centerX - Math.floor(side / 2);
    const y = 0

    //desenha quadrado
    ctx.fillStyle = colors[String(selectedPiece)]
    ctx.fillRect(x , y , side , side)
    
    //desenha contorno
    ctx.strokeStyle = 'white'
    ctx.strokeRect(x , y, side , side)
    
    //escreve numero
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedPiece, x + side / 2, y + side / 2);
}

function handleClick(e){ //lida com um clique no canvas
    const x = e.clientX - cnv.offsetLeft
    const y = e.clientY - cnv.offsetTop
    for(let i = 0 ; i < barPositions.length ; i++){
        const barLimits = [barPositions[i] - 40 , barPositions[i] + 60]
        if(x > barLimits[0] && x < barLimits[1] && y > canvasHeight - barHeight){
            if(selectedPiece == ''){
                selectPiece(i)
            }else{
                placePiece(i)
            }
        }
    }

}

function handleMouseMove(e){ //lida com o movimento do mouse
    const x = e.clientX - cnv.offsetLeft
    const y = e.clientY - cnv.offsetTop
    for(let i = 0 ; i < barPositions.length ; i++){
        const barLimits = [barPositions[i] - 40 , barPositions[i] + 60]
        if(x > barLimits[0] && x < barLimits[1] && y > canvasHeight - barHeight){
            if(selectedPiece != ''){
                drawSelectedPiece(i)
            }
        }
    }
}

function selectPiece(bar){ //pega uma peça de uma barra e a coloca como selecionada
    for(let i = torres[bar].length - 1 ; i >= 0 ; i--){
        if(torres[bar][i] != 0){
            selectedPiece = torres[bar][i]
            torres[bar][i] = 0
            break
        }
    }
    fall(bar)
    updateCanvas()
}

function placePiece(bar){//coloca a peça selecionada em uma barra
    if(torres[bar][torres[bar].length - 1] == 0){
    torres[bar][torres[bar].length - 1] = selectedPiece
    selectedPiece = ''
    fall(bar)
    updateCanvas()
    createPiece()
    }
}

async function createPiece(){
    let tower = Math.floor(Math.random() * 4)
    let newPiece = Math.floor(Math.random() * maxPiece - 2)
    if (newPiece <= 0) newPiece = 1 
    if(torres[tower][torres[tower].length - 1] == 0){
        torres[tower][torres[tower].length - 1] = newPiece
        updateCanvas()
        await esperar(300)
        fall(tower)
        updateCanvas()
    }else{
        gameOver()
    }
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function fall(bar){ //aplica a gravidade e suma as peças
    let canSum = true
    while(canSum){
        gravity(bar)
        updateCanvas()
        await esperar(300)
        canSum = sum(bar)
       
    }
}

function gravity(bar){ //aplica a gravidade
    let canFall = true
    while(canFall){
        canFall = false
        for(let i = torres[bar].length - 1 ; i > 0 ; i--){
            if(torres[bar][i - 1]  == 0 && torres[bar][i] != 0){
                torres[bar][i - 1] = torres[bar][i]
                torres[bar][i] = 0
                canFall = true
            }
        }
    }
}

function sum(bar){ //soma as peças
   let canSum = false
    for(let i = torres[bar].length - 1 ; i > 0 ; i--){
        if(torres[bar][i - 1]  == torres[bar][i] && torres[bar][i] != 0){
            torres[bar][i] += 1
            if(torres[bar][i] > maxPiece) maxPiece = torres[bar][i]
            torres[bar][i-1] = 0
            canSum = true
        }
    }
    return canSum
}


function updateCanvas(){ //atualiza o estado do canvas
    ctx.clearRect(0 , 0 , canvasWidth , canvasHeight)
    drawBackground()
    drawPieces()

}

function gameOver(){
    document.write('game over')
}

updateCanvas(0)

