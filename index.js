
//add event listener - once user click on an answer - whether its wrong or correct, next question will appear
    //at the same time, it will be marked as correct or wrong, will indicate in the scoring section

//after 60 secs, will add user name and score on the scoring list on the bottom - using post so it will go back to the server

//need to turn on server using "json-server --watch db.json"


let playerName
document.addEventListener("DOMContentLoaded", ()=> {
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault()
        playerName = e.target.player_name.value
        handleName(playerName)
    })
})

function handleName(name) {
    document.querySelector("#name").textContent = name
    document.querySelector("#greetings").style.display = "block"
    document.querySelector("form").style.display = "none"
    handleStart(document.querySelector("button"))
}

//come back after building timing, and how to display the first question
function handleStart(button) {
    document.querySelectorAll(".choices").forEach(e => e.addEventListener("click", e => handleClick(e.target.id)))
    button.addEventListener("click", startClock)
    button.addEventListener("click", fetchOne)
}

let intervalId
function startClock() {
    intervalId = setInterval(countDown, 1000)
    document.querySelector("#greetings").style.display = "none"
    const message = document.querySelector("#goodluck")
    message.querySelector("#name").textContent = playerName
    message.style.display = "block"
}

function countDown() {
    let sec = document.querySelector("#countdown").textContent
    if (sec === "0") {
        clearInterval(intervalId)
        handleEnd(document.querySelector("#scoring").querySelector("p").textContent)
        document.querySelector("#question").textContent = " "
        //document.querySelectorAll(".choices").forEach(e => e.removeEventListener("click", e => handleClick(e.target.id)))
    }
    else {
        sec --
        document.querySelector("#countdown").textContent = sec
    }
}

//This code will allow fetch to occur once for all questions and then using the master data selected the question. Cons - will use a lot of memory space
//let masterData
//function fetchQuestions() {
//    fetch("http://localhost:3000/questions")
//    .then(resp => resp.json())
//    .then(data => {
//        masterData = data
//       selectAQuestion(masterData)})
//}

function fetchOne() {
    fetch(`http://localhost:3000/questions/${selectAQuestion()}`)
    .then(resp => resp.json())
    .then(data => renderQuestion(data))
}

const usedQuest = []
function selectAQuestion() {
    let i = Math.floor(Math.random() * 100) + 1;//return random number from 1-100//
    if (usedQuest.length === 100) {
        return alert("Sorry, we had ran out of questions")
    }
    else if (usedQuest.includes(i)){
        return selectAQuestion()
    }
    else {usedQuest.push(i)
        return i}
}


let answer
function renderQuestion(dataSelected) {
    const divQuest = document.querySelector("#question")
    divQuest.querySelector("h3").textContent = dataSelected.question

    divQuest.querySelector("#a").textContent = `A. ${dataSelected.a}` 

    divQuest.querySelector("#b").textContent = `B. ${dataSelected.b}`

    divQuest.querySelector("#c").textContent = `C. ${dataSelected.c}`
   
    divQuest.querySelector("#d").textContent = `D. ${dataSelected.d}`

    answer = dataSelected.correct
}

//closure - need to bring the correct out of the function block
function handleClick(selectedChoice) {
    if (selectedChoice === answer) {
        console.log("Correct")
        handleCorrectAnswers(true)
    }
    else {console.log ("nope" + "I am correct:" + answer)
        handleCorrectAnswers(false)}
    answer = null
    fetchOne()
}

let questionArray = []
function handleCorrectAnswers(response){
    response ? questionArray.push("O") : questionArray.push("X")
    const numCorrect = questionArray.filter(e => e === "O").length
    document.querySelector("#numcorrect").textContent = numCorrect
    document.querySelector("#totalquestions").textContent = questionArray.length
}

function handleEnd(scoringString) {
    if(window.confirm(`Congrations ${playerName}!\nYou answered ${scoringString}\nWould you like to be added to the Top Scoring Board?`)){
        console.log(scoringString)
        let wordArray = scoringString.split(' ');
        wordArray.pop();
        wordArray.splice(1,3);
        let newString = wordArray.toString();
        newString = newString.replace(',',' / ');
        
        const newTr = document.createElement("tr")
        newTr.innerHTML = `
                <td>${playerName}</td>
                <td>${newString}</td>`
        document.querySelector("table").append(newTr)

        fetch("http://localhost:3000/topUsers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                fullName: `${playerName}`,
                correctAnswers: `${newString}`,
            }),
        });
    }
    else console.log("Thanks for playing")
}