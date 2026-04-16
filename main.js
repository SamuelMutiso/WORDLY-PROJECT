// here im now selecting the parts that we are going to need from html
const myForm = document.querySelector("#searchForm");
const displayBox = document. querySelector("#resultSection");

//the dictionary API LINK
const apiBase = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// event listener for the form to also stop reload and call the function to get data
myForm.addEventListener("submit", function(event){
    event.preventDefault(); // this now prevents the page from reloading

    // here now we getting what the user typed
    let userWord = document.querySelector("#wordInput").value;
    
    // this now cleares the box and shows a loading message 
    displayBox.innerHTML = "searching for" + userWord + "...";
    findWord(userWord);
})

// we need to get a function that talks the API
function findWord(word) {
    fetch(apiBase + word)
        .then(function(response){
            //we need to check if the word typed actually exists
            if(response.ok) {
                return response.json(); //promise 
            } else {
                //if the input word is not found it should display and error
                throw new Error("word not found");
            }

        })
        .then(function(data) {
            // send like a display (success!) msg
            displayResult(data[0]);
        })
        .catch(function(error) {
            // ifthe user finds an error this message should be displayed 
            displayBox.innerHTML = "<p class= 'error-msg'>No results found.</p>"
        })
}

// creating a function that puts the data on the screen
function displayResult(data) {
    // Get the definition from the deep API object
    let definition = data.meanings[0].definitions[0].definition;
    let partOfSpeech = data.meanings[0].partOfSpeech;
    
    // Build the HTML to show the user
    displayBox.innerHTML = `
        <h2 class="word-name">${data.word}</h2>
        <p><strong>Type:</strong> ${partOfSpeech}</p>
        <p><strong>Definition:</strong> ${definition}</p>
    `;
    
    // Check if there are synonyms and add them if they exist
    if (data.meanings[0].synonyms.length > 0) {
        displayBox.innerHTML += "<p><strong>Synonyms:</strong> " + data.meanings[0].synonyms[0] + "</p>";
    }
}