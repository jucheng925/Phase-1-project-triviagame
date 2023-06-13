//need to turn on server using "json-server --watch db.json"
//live-server will automatically refresh the page after db.json file get updated

let playerName
document.addEventListener("DOMContentLoaded", ()=> {
    fetchScore();
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        playerName = e.target.player_name.value;
        handleName(playerName);
        document.querySelector("form").reset();
    })
    document.querySelector("#scoring").addEventListener("mouseover", () => {
        document.querySelector("#display").style.display = "block";
        setTimeout(()=> document.querySelector("#display").style.display = "none", 600)
    })
})


function handleName(name) {
    document.querySelector("#name").textContent = name;
    document.querySelector("#greetings").style.display = "block";
    document.querySelector("form").style.display = "none";
    handleStart(document.querySelector("button"));
}


function handleStart(button) {
    button.addEventListener("click", startClock);
    button.addEventListener("click", fetchOne);
}


let intervalId
function startClock() {
    intervalId = setInterval(countDown, 1000);
    document.querySelector("#greetings").style.display = "none";
    const message = document.querySelector("#goodluck");
    message.querySelector("#name").textContent = playerName;
    message.style.display = "block";
    document.querySelectorAll(".choices").forEach(letter => letter.addEventListener("click", handleEvent));
}

//require a named function in order to remove event listener at the end
function handleEvent(event) {
    handleClick(event.target.id);
}


function countDown() {
    let sec = document.querySelector("#countdown").textContent;
    if (sec === "0") {
        clearInterval(intervalId);
        handleEnd(document.querySelector("#scoring").firstElementChild.textContent);
    }
    else {
        sec --;
        document.querySelector("#countdown").textContent = sec;
    }
}

function fetchOne() {
    fetch(`http://localhost:3000/questions/${selectAQuestion()}`)
    .then(resp => resp.json())
    .then(data => renderQuestion(data))
}

const usedQuest = []
function selectAQuestion() {
    let i = Math.floor(Math.random() * 100) + 1;//return random number from 1-100//
    if (usedQuest.length === 100) {
        return alert("Sorry, we had ran out of questions!")
    }
    else if (usedQuest.includes(i)){
        return selectAQuestion();
    }
    else {
        usedQuest.push(i);
        return i;
    }
}


let answer
function renderQuestion(dataSelected) {
    document.querySelector("h3").textContent = dataSelected.question;
    const aBC = ["a","b","c","d"];
    aBC.forEach(letter => {
        document.querySelector(`#${letter}`).textContent = `${letter.toUpperCase()}. ${dataSelected[letter]}`;
        document.querySelector(`#${letter}`).style.borderColor = "white";
    })
    answer = dataSelected.correct;
}

function handleClick(selectedChoice) {
    document.querySelector(`#${answer}`).style.borderColor = "red"
    if (selectedChoice === answer) {
        handleCorrectAnswers(true)
    }
    else {handleCorrectAnswers(false)}
    setTimeout(fetchOne, 500)
    setTimeout(()=> answer = null, 500) //reset answer
}

let questionArray = []
function handleCorrectAnswers(response){
    response ? questionArray.push("O") : questionArray.push("X");
    const numCorrect = questionArray.filter(e => e === "O").length;
    document.querySelector("#display").textContent = questionArray;
    document.querySelector("#numcorrect").textContent = numCorrect;
    document.querySelector("#totalquestions").textContent = questionArray.length;
}

function fetchScore() {
    fetch("http://localhost:3000/topUsers")
    .then(resp => resp.json())
    .then(data => data.forEach(user=>renderTopScore(user.fullName, user.correctAnswers)))
}

function renderTopScore(name, score) {
    const newTr = document.createElement("tr");
    newTr.innerHTML = `
            <td>${name}</td>
            <td>${score}</td>`;
    document.querySelector("table").append(newTr);
} 

function postTopScore(name, score) {
    fetch("http://localhost:3000/topUsers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            fullName: `${name}`,
            correctAnswers: `${score}`,
        }),
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
}

function handleEnd(scoringString) {
    document.querySelector("#goodluck").style.display = "none";
    document.querySelector("#endbox").style.display = "block";
    document.querySelector("#endbox").firstElementChild.textContent = `Congratulations ${playerName}! You answered ${scoringString}
    Would you like to be added to the Top Scoring Board?`;
    document.querySelector("#yes").addEventListener("click", ()=> {
        //scoring string example "1 out of 4 questions" - below code will change the string to "1/4"
        let wordArray = scoringString.split(' ');
        wordArray.pop();
        wordArray.splice(1,3);
        let newString = wordArray.toString();
        newString = newString.replace(',',' / ');

        renderTopScore(playerName, newString);
        postTopScore(playerName, newString);
        restart();
    })
    document.querySelector("#no").addEventListener("click", restart);
}


function restart() {
    document.querySelector("#endbox").firstElementChild.textContent = "Thanks for playing!";
    document.querySelector("#yes").style.display = "none";
    document.querySelector("#no").style.display = "none";
    setTimeout(returnToDefault, 800);
}

function returnToDefault() {
    document.querySelector("form").style.display = "block";
    document.querySelector("#endbox").style.display = "none";
    document.querySelector("#yes").style.display = "block";
    document.querySelector("#no").style.display = "block";
    document.querySelector("#countdown").textContent = 60;
    document.querySelector("#numcorrect").textContent = 0;
    document.querySelector("#totalquestions").textContent = 0;
    document.querySelector("h3").textContent = "Example Question";
    document.querySelectorAll(".choices").forEach(letter => {
        letter.removeEventListener("click", handleEvent)
        letter.textContent = `${letter.id}`
    });
    questionArray = [];
}