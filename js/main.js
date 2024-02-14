/*--------------------------------------------------------- constants ---------------------------------------------------------*/
const MARBLE_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const MATCH_COLOR = ['black', 'gray'];
const WIN_MATCH_COLOR = ['black', 'black', 'black', 'black'];
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
    selectedCell: null,
    WINNING_COLORS: [],
    GUESSED_COLORS: [],
    SIDE_COLORS: [],
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
    activeSideCircles().forEach((div) => div.classList.add('cellDisplayNone'));
    render();
}



function render() {
    pickMarble();
    
}

function resetGame() {
    state.activeRow = 10;
    state.winner = false;
    emptyColoredCircles();
    emptyGuessedColors();
    emptySideColors();
    elements.WINNING_COLORS = [];
    elements.message.innerText = '';
    elements.selectedCell = null;
    activeSideCircles();
    activeSideCellPosition().appendChild(checkBtn);
    allSideCellExceptBottom();
    elements.colorBox.style.display = 'none';
    generateWinningCombo();
    init();
}


function mastermindBoard () {
    generateWinningCombo();
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
    console.log(elements.WINNING_COLORS);
    disableCheckButton();

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

    let colorBoxVisible = false;

    cellValue.addEventListener('click', function () {

        if (parseInt(cellValue.parentElement.id.replace('cell', '')) === state.activeRow) {
            cellValue.appendChild(elements.colorBox);

            colorBoxVisible = !colorBoxVisible;
            elements.colorBox.style.display = colorBoxVisible ? 'grid' : 'none';
            elements.selectedCell = this;
            // console.log(elements.colorBox.style.display); //grid or none
        }
    });

    const colorBoxDiv = document.querySelectorAll('#colorBox > div');

    colorBoxDiv.forEach(function (cellval, index) {
        cellval.addEventListener('click', function () {
            elements.selectedCell.style.backgroundColor = `${MARBLE_COLORS[index]}`;
            checkIfAllActiveRowColored();
            isColorBoxVisible = false;
            elements.colorBox.style.display = 'none';
            // console.log(elements.colorBox.style.display); //none
            
        });
    });
}



function generateWinningCombo() {
    //copy of MARBLE_COLORS
    let marbleColorsCopy = [...MARBLE_COLORS];
    let CopyArrIdx = marbleColorsCopy.length;
    let randomIdx = 0;
    
    while (CopyArrIdx > 0) {
        //Getting the remaining ekement
        randomIdx = Math.floor(Math.random() * CopyArrIdx);
        CopyArrIdx--;

        //Swap with CopyArrIdx
        [marbleColorsCopy[CopyArrIdx], marbleColorsCopy[randomIdx]] = [marbleColorsCopy[randomIdx], marbleColorsCopy[CopyArrIdx]];
    }

    //Getting the first 4 keys from marbleColorsCopy
    let maxCount = 4;
    let count = 0;
    
    for (let item in marbleColorsCopy) {
        elements.WINNING_COLORS[item] = marbleColorsCopy[item];
        count++;

        if(count >= maxCount) {
            break;
        }
    }
    // console.log(marbleColorsCopy);
    // console.log(elements.WINNING_COLORS);
    // console.log(elements.WINNING_COLORS);
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

    allSideCircleDivs().forEach(function(div){
        div.style.backgroundColor = '';
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

function allSideCircleDivs() {
    const MainCircleDivs = document.querySelectorAll('.sideCell > div');
    return MainCircleDivs;
}

function activeSideCircles() {
    const activeSideCircles = document.querySelectorAll(`#sideCell${state.activeRow} > div`);
    return activeSideCircles;
}

function showSideCircles() {
    const nextSideCircles = document.querySelectorAll(`#sideCell${state.activeRow + 1} > div`);
    return nextSideCircles;
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
    const allRowColored = [...activeMainRowDivs].every((div) => MARBLE_COLORS.includes(div.style.backgroundColor));

    if (allRowColored) {
        enableCheckButton();

    } else {
        disableCheckButton();
    }
}


function checkButton() {
    elements.colorBox.style.display = 'none';

    if(state.activeRow > 1) {
        checkIfMatch()
        activeCurrentCircles().forEach((div) => {
            div.classList.remove('cellHover');
        });
        state.activeRow--;
        activeSideCellPosition().appendChild(checkBtn);
        activeSideCircles().forEach((div) => div.classList.add('cellDisplayNone'));
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

function emptyGuessedColors() {
    elements.GUESSED_COLORS = [];
}

function emptySideColors() {
    elements.SIDE_COLORS = [];
}

function fillSideColors() {
    activeSideCircles().forEach(function(div, index){
        div.style.backgroundColor = `${elements.SIDE_COLORS[index]}`;
    });

    // if(Object.values(WIN_MATCH_COLOR) == Object.values(elements.SIDE_COLORS)) {
    //     console.log("you win");
    //     state.winner = true;
    //     showResults();
    // }


    // const sideRow = activeSideCircles();
    // const allWinningColors = [...sideRow].every((div) => WIN_MATCH_COLOR.includes(div.style.backgroundColor ===  `${MATCH_COLOR[0]}`));
    // console.log(allWinningColors);
    
    // if(allWinningColors) {
    //     console.log("you win");
    //     state.winner = true;
    //     showResults();
    // }

    if(JSON.stringify(WIN_MATCH_COLOR) === JSON.stringify(elements.SIDE_COLORS)) {
        console.log("you win");
        state.winner = true;
        showResults();
    }



    console.log(state.winner);

}


function checkIfMatch() {
    emptyGuessedColors();
    emptySideColors();
    //Storing guessed colors
    activeCurrentCircles().forEach((div) =>{
        const color = div.style.backgroundColor;
        elements.GUESSED_COLORS.push(color);
    });

    const guessedRow = elements.GUESSED_COLORS;
    const WinningRow = elements.WINNING_COLORS;

    console.log(guessedRow);
    console.log(WinningRow);



        guessedRow.forEach((element, index) => {
            if(element === WinningRow[index]) {
                elements.SIDE_COLORS.push(MATCH_COLOR[0]);
                console.log(elements.SIDE_COLORS);
            } else if(WinningRow.includes(element)) {
                elements.SIDE_COLORS.push(MATCH_COLOR[1]);
                console.log(elements.SIDE_COLORS);
            }
            console.log(element);
            console.log(WinningRow[index]);
        });

        elements.SIDE_COLORS.sort();
        console.log(elements.SIDE_COLORS);

        fillSideColors();
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
