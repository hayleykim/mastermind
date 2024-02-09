/*--------------------------------------------------------- constants ---------------------------------------------------------*/
const MARBLE_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];


/*--------------------------------------------------------- state variables ---------------------------------------------------------*/
const state = {
    winner: false, //true or false
    activeRow: 10, //starting from bottom boardRow 10 to top boardRow 1

}

/*--------------------------------------------------------- cached elements  ---------------------------------------------------------*/
const elements = {
    message: document.getElementById('message'),
    resetBtn: document.getElementById('reset'),
    colorBox: document.getElementById('colorBox'),
    checkBtn: document.createElement('button')
}


/*--------------------------------------------------------- event listeners --------------------------------------------------------*/


//DOMContentLoaded: loading HTML first before script does.
// document.addEventListener("DOMContentLoaded", function() {   
// });

elements.resetBtn.addEventListener('click', init);
elements.checkBtn.addEventListener('click', checkButton);


/*--------------------------------------------------------- functions ---------------------------------------------------------*/

init();

function init() {

    render();
}

function render() {
    mastermindBoard();
    checkButton();
    pickMarble();
}


function mastermindBoard () {
    //To create the board that is repetative in HTML using JS
//structure:
/*
<div class="boardRow" id="boardRow1">
    <div class="mainCell" id="cell1">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="sideCell" id="sideCell1">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>
*/
    const board = document.getElementById('board');

    for (let i = 1; i < 11; i++) {
        //boardRow contains mainCell and sideCell
        let boardRow = document.createElement('div');
        boardRow.className = 'boardRow';
        boardRow.id = 'boardRow' + i;

        //MAIN CELL
        let mainCell = document.createElement('div');
        mainCell.className = 'mainCell';
        mainCell.id = 'cell' + i; //each mainCell has id of cell1, cell2, ... , cell10

        //4 divs in mainCell
        for(let j = 1; j < 5; j++) {
            let mainInnerDiv = document.createElement('div');
            mainCell.appendChild(mainInnerDiv); //attaching the 4 mainInnerDivs to mainCell
        }

        //SIDE CELL
        let sideCell = document.createElement('div');
        sideCell.className = 'sideCell';
        sideCell.id = 'sideCell' + i; //each sideCell has id of sideCell1, sideCell2, ... , sideCell10

        //4 divs in sideCell
        for(let k = 1; k < 5; k++) {
            let sideInnerDiv = document.createElement('div');
            sideCell.appendChild(sideInnerDiv);
        }

        //Attaching mainCell and sideCell to boardRow & boardRow to board
        boardRow.appendChild(mainCell);
        boardRow.appendChild(sideCell);
        board.appendChild(boardRow);
    }

    //creating a check button
    checkBtn.classList.add('checkButton');
    checkBtn.appendChild(document.createTextNode('Check'));
    const sideCellPosition = document.getElementById('sideCell10');
    sideCellPosition.appendChild(checkBtn);
}

function checkButton() {
    if(stastate.activeRow > 1) {
        state.activeRow--;
    } else {
        showResults();
    }
}



function messageRender() {

}

function resetGame() {

}

function showRules() {

}

function pickMarble() {
    //Only active row circles can be hovered and clicked
    //const currentRow = document.getElementById(`cell${state.activeRow}`);
    const currentCircles = document.querySelectorAll(`#cell${state.activeRow} > div`);
    currentCircles.forEach((div) => div.classList.add('cellHover'));


    
    for(let i = 0; i <= 5; i++){
        const colorBoxItem = document.querySelector(`#colorBox > div:nth-child(${i + 1})`);
        colorBoxItem.style.backgroundColor = MARBLE_COLORS[i];
    }


}

function showResults() {
    if(winner) {
        elements.message.innerText = 'You Win!';
        //TODO: show the correct marble code
    } else {
        elements.message.innerText = 'Try again :)';
        //TODO: show the correct marble code
    }
}