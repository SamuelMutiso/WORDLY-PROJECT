// here im now selecting the parts that we are going to need from html
const myForm = document.querySelector("#searchForm");
const displayBox = document. querySelector("#resultSection");

//the dictionary API LINK
const apiBase = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// event listener for the form to also stop reload and call the function to get data
myForm.addEventListener("submit", function(e){
    e.preventDefault(); // this now prevents the page from reloading

    let userWord = document.querySelector("#wordInput").value;
    findWord(userWord);
})