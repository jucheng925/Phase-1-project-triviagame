//addevent listener -domcontented loaded

//timer - need a start button - will start timer and give you the first quesiton
//question randomialzation - will random the id number - fetch it from server and then display on site
//add event listener - once user click on an answer - whether its wrong or correct, next question will appear
    //at the same time, it will be marked as correct or wrong, will indicate in the scoring section

//after 60 secs, will add user name and score on the scoring list on the bottom - using post so it will go back to the server


document.addEventListener("DOMContentLoaded", ()=> {
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault()
        handleName(e.target.player_name.value)
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
}

let intervalId
function startClock() {
    intervalId = setInterval(countDown, 1000)
}

function countDown() {
    let sec = document.querySelector("#countdown").textContent
    if (sec === "0") {
        clearInterval(intervalId)
        console.log(`last one: ${sec}`)
        intervalidId = null
    }
    else {
        sec --
        document.querySelector("#countdown").textContent = sec
    }
}