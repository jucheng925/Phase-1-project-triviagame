
//add event listener - once user click on an answer - whether its wrong or correct, next question will appear
    //at the same time, it will be marked as correct or wrong, will indicate in the scoring section

//after 60 secs, will add user name and score on the scoring list on the bottom - using post so it will go back to the server

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
    //include questions
}

function countDown() {
    let sec = document.querySelector("#countdown").textContent
    if (sec === "0") {
        clearInterval(intervalId)
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
        console.log("repeat")
        return selectAQuestion()
    }
    else {usedQuest.push(i)
        console.log(usedQuest)
        return i}
}

let answer
function renderQuestion(dataSelected) {
    const divQuest = document.querySelector("#question")
    const placeQuestion = divQuest.querySelector("h3")
    placeQuestion.textContent = dataSelected.question
    answer = dataSelected.correct

    const placeA = divQuest.querySelector("#a")
    placeA.textContent = `A. ${dataSelected.a}` 
    placeA.addEventListener("click", e => {
        handleClick(e.target.id)
    })

    const placeB = divQuest.querySelector("#b")
    placeB.textContent = `B. ${dataSelected.b}`
    placeB.addEventListener("click", e => {
        handleClick(e.target.id)
    })

    const placeC = divQuest.querySelector("#c")
    placeC.textContent = `C. ${dataSelected.c}`
    placeC.addEventListener("click", e => {
        handleClick(e.target.id)
    })
   
    const placeD = divQuest.querySelector("#d")
    placeD.textContent = `D. ${dataSelected.d}`
    placeD.addEventListener("click", e => {
        handleClick(e.target.id)
    })
}

//// need to remove event listener after its been clicked
//closure - need to bring the correct out of the function block
function handleClick(selectedChoice) {
    if (selectedChoice === answer) {
        console.log("Correct")
        answer = null
        console.log(answer)
        return true
    }
    else {console.log ("nope" + "I am correct:" + answer)
        answer = null
        console.log(answer)
         return false}

}