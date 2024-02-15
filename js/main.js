/*--------------------------------------------------------- constants ---------------------------------------------------------*/
const rainbow = {  
    red: 'rgb(255, 173, 173)', 
    orange: 'rgb(255, 214, 165)',
    yellow: 'rgb(253, 255, 182)',
    green: 'rgb(202, 255, 191)',
    blue: 'rgb(155, 246, 255)',
    pruple: 'rgb(189, 178, 255)'
};

const MARBLE_COLORS = [rainbow.red, rainbow.orange, rainbow.yellow, rainbow.green, rainbow.blue, rainbow.pruple]; //What colorbox shows. WINNING_COLORS will be made out of this
const MATCH_COLOR = ['black', 'gray']; //black for correct position + color, gray for wrong position + right color
const WIN_MATCH_COLOR = ['black', 'black', 'black', 'black']; //If 4 of them are all showing 'black' player wins
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
    rulesBtn: document.getElementById('rules'),
    colorBox: document.getElementById('colorBox'),
    ruleDiv: document.getElementById('ruleDiv'),
    winCombo: document.getElementById('winCombo'),
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
elements.rulesBtn.addEventListener('click', showRules);

/*--------------------------------------------------------- functions ---------------------------------------------------------*/

function init() {
    //Making sure it starts from the bottom row
    state.activeRow = 10;
    state.winner = false;
    activeSideCircles().forEach((div) => div.classList.add('cellDisplayNone'));
    render();
}



function render() {
    pickMarble();
    console.log(elements.WINNING_COLORS);
    console.log(rainbow);
    
}

function resetGame() {
    state.activeRow = 10;
    elements.winCombo.style.display = 'none';
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

    //New winning combo gets generated for each game
    generateWinningCombo();
    

    /*
    //To create the board that is repetative in HTML using JS
    //structure will be:

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

    //colobox's 6 pegs
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
    cellValue.classList.add('cellHover'); //allowing each active cell to have :hover in CSS

    let colorBoxVisible = false;

    cellValue.addEventListener('click', function () {

        //getting the index value of thc cell${id number} to see if it is the active(current) row
        if (parseInt(cellValue.parentElement.id.replace('cell', '')) === state.activeRow) {
            cellValue.appendChild(elements.colorBox); //the current circle now has colobox appended

            colorBoxVisible = !colorBoxVisible; //making sure colorBox is not visible (false)
            elements.colorBox.style.display = colorBoxVisible ? 'grid' : 'none'; //if colorbox is NOT visible, show color box, otherwise hide it
            elements.selectedCell = this; //to get the selected circle
        }
    });

    const colorBoxDiv = document.querySelectorAll('#colorBox > div');

    //for color box
    colorBoxDiv.forEach(function (cellval, index) {
        cellval.addEventListener('click', function () {
            elements.selectedCell.style.backgroundColor = `${MARBLE_COLORS[index]}`; //filling the selected circle's background color to selected color from the colorbox which is in MARBLE_COLORS
            checkIfAllActiveRowColored();
            elements.colorBox.style.display = 'none';
            
        });
    });
}


function generateWinningCombo() {
    let marbleColorsCopy = [...MARBLE_COLORS]; //copy of MARBLE_COLORS
    let CopyArrIdx = marbleColorsCopy.length; //which is 6
    let randomIdx = 0;
    
    while (CopyArrIdx > 0) {
        //until it reaches to 1 from 6
        randomIdx = Math.floor(Math.random() * CopyArrIdx); //for example if CopyArrIdx is 6, randomIdx will be a number between 0 - 5 as Math.random() give number between 0 - 0.99999..(less than 1)
        CopyArrIdx--;

        //changing the values so that it "shuffles" the array - assigning two variables at once
        /*
            const arr = [1,2,3];
            [arr[2], arr[1]] = [arr[1], arr[2]];    
            // 3 becomces 2 and 2 becomes 3 so arr is now [1, 3, 2]

        */
        [marbleColorsCopy[CopyArrIdx], marbleColorsCopy[randomIdx]] = [marbleColorsCopy[randomIdx], marbleColorsCopy[CopyArrIdx]];
    }

    //Getting the first 4 keys from marbleColorsCopy
    let maxCount = 4;
    let count = 0;

    for (let item in marbleColorsCopy) {
        elements.WINNING_COLORS[item] = marbleColorsCopy[item]; //filling in WINNING_COLORS with marbleColorsCopy values 4 times only as winning combo can only be 4 pegs
        count++;

        if(count >= maxCount) {
            break;
        }
    }
}


function showRules() {
    elements.ruleDiv.classList.toggle('showRule');
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

function showWinCombo() {
    const winCombo = document.querySelectorAll(`#winCombo > div`);

    winCombo.forEach(function(div, index){
        div.style.backgroundColor = `${elements.WINNING_COLORS[index]}`;
    });

    elements.winCombo.style.display = 'flex';
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
    const allRowColored = [...activeMainRowDivs].every((div) => MARBLE_COLORS.includes(div.style.backgroundColor)); //check if every active row includes the background color that exists in MARBLE_COLORS

    if (allRowColored) {
        //enables check button only if all rows are colored in
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
    } else if(state.activeRow === 1) { //last row
        checkIfMatch()
        activeCurrentCircles().forEach((div) => div.classList.remove('cellHover'));
        disableCheckButton();
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


    if(JSON.stringify(WIN_MATCH_COLOR) === JSON.stringify(elements.SIDE_COLORS)) { //comparing if these 2 objects match.
        //winner will be 'true' once WIN_MATCH_COLOR and SIDE_COLORS both have 4 blacks
        state.winner = true;
        showResults();
    }

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

    //filling either black(exact spot) or gray(right colour but diff position)
    guessedRow.forEach((element, index) => {
        if(element === WinningRow[index]) {
            elements.SIDE_COLORS.push(MATCH_COLOR[0]);
        } else if(WinningRow.includes(element)) {
            elements.SIDE_COLORS.push(MATCH_COLOR[1]);
        }
    });

    elements.SIDE_COLORS.sort(); //black pegs come first and gray pegs next

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
        elements.message.innerText = 'You guessed it right! Congratulations :D';
    } else {
        elements.message.innerText = 'Try again :)';
    }
    //show the correct marble code
    showWinCombo();
    render();
}


init();
