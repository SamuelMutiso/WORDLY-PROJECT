// here im now selecting the parts that we are going to need from html
const myForm = document.querySelector("#searchForm");
const displayBox = document.querySelector("#resultSection");
const savedLink = document.querySelector("#savedLink");
const homeLink = document.querySelector("#homeLink");
const mainTitle = document.querySelector("h1");

//the dictionary API LINK of the dictionary we using
const apiBase = "https://api.dictionaryapi.dev/api/v2/entries/en/";

//this grabs saved words from the browsers memory 
let savedWords = JSON.parse(localStorage.getItem("wordly_saved")) || [];

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
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => displayResult(data[0]))
        .catch(() => {
            displayBox.innerHTML = "<p class='error-msg'>Word not found. Try again!</p>";
        });
}

function displayResult(data) {
    const definition = data.meanings[0].definitions[0].definition;
    
    // We add a "Save" button dynamically to the result
    displayBox.innerHTML = `
        <div class="result-header">
            <h2 class="word-name">${data.word}</h2>
            <button id="saveBtn" class="action-btn">⭐ Save</button>
        </div>
        <p><strong>Definition:</strong> ${definition}</p>
    `;

    // Listen for the save click
    document.querySelector("#saveBtn").addEventListener("click", () => {
        saveWord(data.word, definition);
    });
}

// Function to save to LocalStorage
function saveWord(word, def) {
    const wordObj = { word, def, date: new Date().toLocaleDateString() };
    
    // Prevent duplicates
    if (!savedWords.some(item => item.word === word)) {
        savedWords.push(wordObj);
        localStorage.setItem("wordly_saved", JSON.stringify(savedWords));
        alert(`${word} added to your library!`);
    } else {
        alert("Word already saved.");
    }
}

// --- LIBRARY NAVIGATION LOGIC ---

// Listen for a click on the "Saved" link in the navbar
savedLink.addEventListener("click", function(e) {
    e.preventDefault(); // Stop the link from trying to open a new page
    
    // UI SWITCH: Hide the search form to transition into the "Library View"
    myForm.style.display = "none"; 
    
    // Update the heading dynamically to reflect the current section
    mainTitle.textContent = "Your Library";

    // CHECK STATE: If the array is empty, give the user feedback
    if (savedWords.length === 0) {
        displayBox.innerHTML = "<p>Empty! Go save some words.</p>";
    } else {
        // RENDER DATA: Loop through the savedWords array and build the HTML for each card
        // We use .map() to create a new array of HTML strings and .join("") to combine them
        displayBox.innerHTML = savedWords.map((item, index) => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <h3 style="color: purple; margin: 0;">${item.word}</h3>
                <p style="font-size: 14px; margin: 5px 0;">${item.def}</p>
                <button onclick="deleteWord(${index})" style="color: red; background: none; border: none; cursor: pointer; font-size: 11px;">Remove</button>
            </div>
        `).join("");
    }
});

// HOME NAVIGATION: Simplest way to return to the search view is to reload the window
homeLink.addEventListener("click", () => location.reload());

// --- DATA MANAGEMENT ---

// We attach this to the 'window' object so the HTML buttons can find it globally
window.deleteWord = function(index) {
    // Remove 1 item from the array at the specific position (index)
    savedWords.splice(index, 1);
    
    // UPDATE STORAGE: Overwrite the old LocalStorage data with the new, shorter array
    localStorage.setItem("wordly_saved", JSON.stringify(savedWords));
    
    // REFRESH UI: Programmatically trigger the "Saved" click to redraw the list immediately
    savedLink.click(); 
};