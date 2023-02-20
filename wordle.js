var height = 4; // number of guesses
var width = 4; // length of word
var conbool = false;

var row = 0; // attempt number
var col = 0; // current letter for attempt

var gameOver = false;

window.onload = async () => {
  const startOver = document.getElementById("startOver");
  startOver.disabled = true;
  startOver.innerText = "Loading...";
  
  const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
    "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
  });
  
    startOver.disabled = false;
    startOver.innerText = "Start Over";

    let wordDict = await res.json();
    let { dictionary } = wordDict;
    let words = [];
    let hints = [];


    for (let key of Object.keys(dictionary)) {
      let value = dictionary[key];
      if (value.hasOwnProperty("word")) {
        words.push(value.word);
      }
      if (value.hasOwnProperty("hint")) {
        hints.push(value.hint);
      }
    }
    let randomIndex = Math.floor(Math.random() * words.length);
    var word = words[randomIndex].toUpperCase();
    var hint = hints[randomIndex];

    console.log(word);
    console.log(hint);
    // Create game board
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        // <span id="0-0" class="tile">P</span>
        let tile = document.createElement("span");
        tile.id = r.toString() + "-" + c.toString();
        tile.classList.add("tile");
        tile.innerText = "";
        document.getElementById("board").appendChild(tile);
      }
    }
    initialize();
    
    function initialize() {
  let selectedTile; // variable to keep track of previously selected tile
  //listen for key press
  document.addEventListener("keyup", (e) => {
    if (gameOver) return;
    if ("KeyA" <= e.code && e.code <= "KeyZ") {
      if (col < width) {
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        if (currTile.innerText == "") {
          currTile.innerText = e.code[3];
          // remove border from previously selected tile
          if (selectedTile) {
            selectedTile.style.border = "";
          }
          // add border to the new tile
          currTile.style.border = "2px solid black";
          // set the newly selected tile as the previously selected tile
          selectedTile = currTile;
          col += 1;
        }
      }
    }
    else if (e.code == "Backspace") {
      if (0 < col && col <= width) {
        col -= 1;
      }
      let currTile = document.getElementById(row.toString() + '-' + col.toString());
      currTile.innerText = "";
      // remove border from the previously selected tile
      if (selectedTile) {
        selectedTile.style.border = "";
      }
      // add border to the new tile
      currTile.style.border = "1px solid black";
      // set the newly selected tile as the previously selected tile
      selectedTile = currTile;
    }

    else if (e.code == "Enter") {
      if (col < width) {
        window.alert("First complete the word.");
        return;
      }
      update();
      row += 1;
      col = 0;
      // remove border from the previously selected tile
      if (selectedTile) {
        selectedTile.style.border = "";
      }
    }

    if (!gameOver && row == height) {
      gameOver = true;
      document.getElementById("message-lose").style.backgroundColor = "red";
      document.getElementById("message-lose").style.borderTop = "1px solid #bebebe";
      document.getElementById("message-lose").style.color = "white";
      document.getElementById("message-lose").innerHTML = "You missed the word <b>" + word + "</b> and lost!";
      document.getElementById("message-lose").style.display = "block";
    }
  })
}



    function update() {
      let correct = 0;
      let letterCount = {};
      for (let i = 0; i < word.length; i++) {
        letter = word[i];
        if (letterCount[letter]) {
          letterCount[letter] += 1;
        }
        else {
          letterCount[letter] = 1;
        }
      }

      // check correct ones
      for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        // correct position?
        if (word[c] == letter) {
          currTile.classList.add("correct");
          correct += 1;
          letterCount[letter] -= 1;
        }

        if (correct == width) { // if guessed correct
          gameOver = true;
          conbool = true;
          document.getElementById("message-win").style.backgroundColor = "#e4e4e4";
          document.getElementById("message-win").style.borderTop = "1px solid #bebebe";
          document.getElementById("message-win").style.color = "black";
          document.getElementById("message-win").innerHTML = "You guessed the word <b>" + word + "</b> correctly!";
          document.getElementById("message-win").style.display = "block";

          document.getElementById("congrats").style.display = "block";
          document.getElementById("board").style.display = "none";
        }

      }

      // mark which are present by wrong position
      for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString())
        let letter = currTile.innerText;

        // correct position?
        if (!currTile.classList.contains("correct")) {
          if (word.includes(letter) && letterCount[letter] > 0) {
            currTile.classList.add("present");
            letterCount[letter] -= 1;
          } // not in word
          else {
            currTile.classList.add("absent");
          }
        }
      }
    }

    function handleStartOver() {
      
      document.getElementById("congrats").style.display = "none";
      document.getElementById("board").style.display = "flex";
      document.getElementById("message-win").style.display = "none";
      
      col = 0;
      row = 0;
      document.getElementById("message-hint").style.display = "none";
      document.getElementById("message-lose").style.display = "none";

      randomIndex = Math.floor(Math.random() * words.length);
      word = words[randomIndex].toUpperCase();
      hint = hints[randomIndex];

      console.log(word);
      console.log(hint);
      const boardElement = document.getElementById("board");
      const tiles = boardElement.querySelectorAll(".tile");
      tiles.forEach(tile => {
        tile.innerText = "";
        tile.classList.remove("present");
        tile.classList.remove("absent");
        tile.classList.remove("correct");
      });
      if (gameOver = true) {gameOver = false;}

    }

    const modeLink = document.getElementById('mode');
    // Add a "click" event listener to the "mode" link
      if (modeLink) {
        modeLink.addEventListener('click', (e) => {
          var element = document.body;
          element.classList.toggle("dark");
          var ins = document.getElementById("instructions");
          ins.classList.toggle("special-char");
          document.getElementById("hint").classList.toggle("special-char");
          document.getElementById("mode").classList.toggle("special-char");
          document.querySelector("footer").classList.toggle("dark");
      });
    }

    const instructionsLink = document.getElementById('instructions');

    // listen for instruction click
    if (instructionsLink) {
      instructionsLink.addEventListener('click', (e) => {
        if (document.getElementById('instr').style.display === "none") {
          document.getElementById('instr').style.display = "flex";
        } else {
          document.getElementById('instr').style.display = "none";
        }
      });
    }

      const startOverButton = document.getElementById('startOver');
      startOverButton.addEventListener('click', (e) => {
        handleStartOver();
      });

      const hintLink = document.getElementById('hint');
      // listen for instruction click

      if (hintLink) {
        hintLink.addEventListener('click', (e) => {
        if (document.getElementById("message-hint").style.display === 'none') {
          document.getElementById("message-hint").style.backgroundColor = "#FAF3EB";
          document.getElementById("message-hint").style.borderTop = "1px solid #bebebe";
          document.getElementById("message-hint").style.color = "black";
          document.getElementById("message-hint").innerHTML = "<i>Hint</i>: " + hint;
          document.getElementById("message-hint").style.display = 'block';
        } 
        else {
          document.getElementById("message-hint").style.display = 'none';
        } 
        });
      }
  
}






