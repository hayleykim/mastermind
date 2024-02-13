/*--------------------------------------------------------- constants ---------------------------------------------------------*/
const MARBLE_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const checkBtn = document.createElement('button');


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
    selectedCell: null
}

/*--------------------------------------------------------- event listeners --------------------------------------------------------*/


//DOMContentLoaded: loading HTML first before script does.
 document.addEventListener("DOMContentLoaded", function() {  
    mastermindBoard();
 });

elements.resetBtn.addEventListener('click', resetGame);
checkBtn.addEventListener('click', checkButton);


/*--------------------------------------------------------- functions ---------------------------------------------------------*/

function init() {
    state.activeRow = 10;
    state.winner = false;
    hideSideCircles().forEach((div) => div.classList.add('cellDisplayNone'));
    //showSideCircles().forEach((div) => div.classList.remove('cellDisplayNone'));
    render();
}



function render() {
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
    activeSideCellPosition().appendChild(checkBtn);

    init();
}


function pickMarble() {
    disableCheckButton();
    // console.log(state.activeRow);
    // console.log(`#cell${state.activeRow} > div`);

    if(state.activeRow === 10) {
        
    }

    for(let i = 0; i <= 5; i++){
        const colorBoxItem = document.querySelector(`#colorBox > div:nth-child(${i + 1})`);
        colorBoxItem.style.backgroundColor = MARBLE_COLORS[i];
        colorBoxItem.style.position = 'relative';
    }
    
    activeCurrentCircles().forEach(function(cellValue) {
        colorBoxShow(cellValue);
    });
 
}

function colorBoxShow(cellValue) {
    cellValue.classList.add('cellHover');

        
    cellValue.addEventListener('click', function() {
        console.log(state.activeRow);
        console.log(cellValue.parentElement.id);


        if(parseInt(cellValue.parentElement.id.replace('cell', '')) === state.activeRow) {
            cellValue.appendChild(elements.colorBox);
        
            if(elements.colorBox.style.display === 'grid'){
                elements.colorBox.style.display =  'none';
                console.log('Should be none: ', elements.colorBox.style.display);
                
            } else {
                elements.colorBox.style.display =  'grid';
                elements.selectedCell = this;
                console.log('Should be grid: ', elements.colorBox.style.display);
            }
        }
    });

    const colorBoxDiv = document.querySelectorAll('#colorBox > div');

    colorBoxDiv.forEach(function(cellval, index){
        cellval.addEventListener('click', function() {
            elements.selectedCell.style.backgroundColor = `${MARBLE_COLORS[index]}`; // 0 - 5
            checkIfAllActiveRowColored();
        });
    }); 
}

function resetGame() {
    state.activeRow = 10;
    elements.message.innerText = '';
    elements.selectedCell = null;
    emptyColoredCircles();
    hideSideCircles()
    activeSideCellPosition().appendChild(checkBtn);
    allSideCellExceptBottom();
    console.log('elements.colorBox:', elements.colorBox);
    elements.colorBox.style.display = 'none';

    init();
}



function messageRender() {

}

function showRules() {

}

function allSideCellExceptBottom() {
    for (let i = 1; i < 10; i++){
        let sideCellDiv = document.querySelectorAll(`#sideCell${i} > div`);
        if(sideCellDiv) {
            sideCellDiv.forEach((div) => div.classList.remove('cellDisplayNone'));
        }
    }
}


function emptyColoredCircles() {
    allMainCircleDivs().forEach(function(div){
        div.style.backgroundColor = '';
        div.classList.remove('cellHover');
    });
}

function colorBox() {
    const colorBox = document.getElementById('colorBox');
    return colorBox;

}

function allMainCircleDivs() {
    const MainCircleDivs = document.querySelectorAll('.mainCell > div');
    return MainCircleDivs;
}

function hideSideCircles() {
    const activeSideCircles = document.querySelectorAll(`#sideCell${state.activeRow} > div`);
    return activeSideCircles;
}

function showSideCircles() {
    const activeSideCircles = document.querySelectorAll(`#sideCell${state.activeRow + 1} > div`);
    return activeSideCircles;
}

function activeCurrentCircles() {
    const currentCircles = document.querySelectorAll(`#cell${state.activeRow} > div`);
    return currentCircles;
}

function activeSideCellPosition() {
    const sideCellPosition = document.getElementById(`sideCell${state.activeRow}`);
    return sideCellPosition;
}





/*----------------- CHECK BUTTON RELATED-----------------*/

function checkIfAllActiveRowColored() {
    const  activeMainRowDivs = activeCurrentCircles();
    const allRowColored = [...activeMainRowDivs]. every((div) => MARBLE_COLORS.includes(div.style.backgroundColor));

    if (allRowColored) {
        enableCheckButton();
    } else {
        disableCheckButton();
    }
}


function checkButton() {
    elements.colorBox.style.display = 'none';

    if(state.activeRow > 1) {
        activeCurrentCircles().forEach((div) => {
            div.classList.remove('cellHover');
        });
        state.activeRow--;

        activeSideCellPosition().appendChild(checkBtn);
        hideSideCircles().forEach((div) => div.classList.add('cellDisplayNone'));
        showSideCircles().forEach((div) => div.classList.remove('cellDisplayNone'));
        console.log(state.activeRow);
    } else if(state.activeRow === 1) {
        activeCurrentCircles().forEach((div) => div.classList.remove('cellHover'));
        state.activeRow = -1;
        disableCheckButton();
        console.log(activeCurrentCircles());
        showResults();
    }
    render();
}

function disableCheckButton() {
    checkBtn.classList.add('disabledButton');
}

function enableCheckButton() {
    checkBtn.classList.remove('disabledButton');
}


function showResults() {
    if(state.winner) {
        elements.message.innerText = 'You Win!';
        //TODO: show the correct marble code
    } else {
        elements.message.innerText = 'Try again :)';
        //TODO: show the correct marble code
    }
    render();
}


init();
