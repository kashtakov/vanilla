// let today = new Date();
// let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const noteListDiv = document.querySelector('.note-list');
const arcNoteListDiv = document.querySelector('.archive-note-list');
const counterDiv = document.querySelector('.counter');
let noteID = 1;
function Note(id, title, content, category, date){
    this.id = id;
    this.title = title;
    this.content = content;
    this.category = category;
    this.date = date;
    
}

// all eventlisteners
function eventListeners(){
    document.addEventListener('DOMContentLoaded', displayNotes);
    document.addEventListener('DOMContentLoaded', displayArcNotes);
    document.getElementById('add-note-btn').addEventListener('click', addNewNote);
   
    arcNoteListDiv.addEventListener('click',deleteArcNote);
    arcNoteListDiv.addEventListener('click', unarchiveNote );
    noteListDiv.addEventListener('click', deleteNote);
    noteListDiv.addEventListener('click', archiveNote);

    document.getElementById('delete-all-btn').addEventListener('click', deleteAllNotes);
}

eventListeners();

// get items form storage
function getDataFromStorage(){
    return localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
}

function arcDataFromStorage(){
   return localStorage.getItem('arc') ? JSON.parse(localStorage.getItem('arc')) : [];
}

// add a new note in the list
function addNewNote(){
    const noteTitle = document.getElementById('note-title'),
          noteContent = document.getElementById('note-content'),
          noteCategory = document.getElementById('note-categories');
          
          
    if(validateInput(noteTitle, noteContent)){
        let notes = getDataFromStorage();
        let noteItem = new Note(noteID, noteTitle.value, noteContent.value, noteCategory.value);
        noteID++;
        notes.push(noteItem);
        createNote(noteItem);
        // saving in the local storage
        localStorage.setItem('notes', JSON.stringify(notes));
        noteTitle.value = "";
        noteContent.value = "";
    }
    
    counter();
}

// input validation
function validateInput(title, content){
    if(title.value !== "" && content.value !== ""){
        return true;
    } else {
        if(title.value === "") title.classList.add('warning');
        if(content.value === "") content.classList.add('warning');
    }
    setTimeout(() => {
        title.classList.remove('warning');
        content.classList.remove('warning');
    }, 1500);
}

// create a new note div
function createNote(noteItem){
    const div = document.createElement('div');
    div.classList.add('note-item');
    div.setAttribute('data-id', noteItem.id);
    div.innerHTML = `
        <h3>${noteItem.title}</h3>
        <p>${noteItem.content}</p>
        <p>${noteItem.category}</p>
        <p>${noteItem.date}</p>
        <button type = "button" class = "btn delete-note-btn">
        <span><i class = "fas fa-trash"></i></span>
        Remove
        </button>
        <button type = "button" class = "btn archive-note-btn">
       
        Archive
        </button>
    `;
    noteListDiv.appendChild(div);
}
function createArcNote(noteItem){
    const div = document.createElement('div');
    div.classList.add('note-item');
    div.setAttribute('data-id', noteItem.id);
    div.innerHTML = `
        <h3>${noteItem.title}</h3>
        <p>${noteItem.content}</p>
        <p>${noteItem.category}</p>
        <button type = "button" class = "btn arc-delete-note-btn">
        <span><i class = "fas fa-trash"></i></span>
        Remove
        </button>
        <button type = "button" class = "btn unarchive-note-btn">
       
        Unarchive
        </button>
    `;
    arcNoteListDiv.appendChild(div);
}


// display all the notes form the local storage
function displayNotes(){
    let notes = getDataFromStorage();
    if(notes.length > 0){
        noteID = notes[notes.length - 1].id;
        noteID++;
    } else {
        noteID = 1;
    }
    notes.forEach(item => {
        createNote(item);
    });
}

function displayArcNotes(){
    let arc = arcDataFromStorage();
    if(arc.length > 0){
        noteID = arc[arc.length - 1].id;
        noteID++;
    } else {
        noteID = 1;
    }
    arc.forEach(item => {
        createArcNote(item);
    });
}

// delete a note 
function deleteNote(e){
    if(e.target.classList.contains('delete-note-btn')){
        //console.log(e.target.parentElement);
        e.target.parentElement.remove(); // removing from DOM
        let divID = e.target.parentElement.dataset.id;
        let notes = getDataFromStorage();
        let newNotesList = notes.filter(item => {
            return item.id !== parseInt(divID);
        });
        localStorage.setItem('notes', JSON.stringify(newNotesList));
    }
    
}

function deleteArcNote(e){
    if(e.target.classList.contains('arc-delete-note-btn')){
        //console.log(e.target.parentElement);
        e.target.parentElement.remove(); // removing from DOM
        let divID = e.target.parentElement.dataset.id;
        let arc = arcDataFromStorage();
        let newNotesList = arc.filter(item => {
            return item.id !== parseInt(divID);
        });
        localStorage.setItem('arc', JSON.stringify(newNotesList));
    }
}

function archiveNote(e){
    if(e.target.classList.contains('archive-note-btn')){
        //console.log(e.target.parentElement);
        e.target.parentElement.remove();// removing from DOM
        let divID = e.target.parentElement.dataset.id;
        let notes = getDataFromStorage();
        let arc =  arcDataFromStorage();

        let arcNote = notes.filter(item => {
            return item.id == parseInt(divID);
        });
       let arcNotesList = arc.concat(arcNote);
        localStorage.setItem('arc', JSON.stringify(arcNotesList));
        let newNotesList = notes.filter(item => {
            return item.id !== parseInt(divID);
        });
        localStorage.setItem('notes', JSON.stringify(newNotesList));
    }
    
    
}

function unarchiveNote(e){
    if(e.target.classList.contains('unarchive-note-btn')){
        //console.log(e.target.parentElement);
        e.target.parentElement.remove();// removing from DOM
        let divID = e.target.parentElement.dataset.id;
        let notes = getDataFromStorage();
        let arc =  arcDataFromStorage();

        let unarcNote = arc.filter(item => {
            return item.id == parseInt(divID);
        });
       let unarcNotesList = notes.concat(unarcNote);
        localStorage.setItem('notes', JSON.stringify(unarcNotesList));
        let newNotesList = arc.filter(item => {
            return item.id !== parseInt(divID);
        });
        localStorage.setItem('arc', JSON.stringify(newNotesList));
    }
    
    
}


// delete all notes
function deleteAllNotes(){
    localStorage.removeItem('notes');
    let noteList = document.querySelectorAll('.note-item');
    if(noteList.length > 0){
        noteList.forEach(item => {
            noteListDiv.removeChild(item);
        });
    }
    noteID = 1; // resetting noteID to 1
}



function counter(){
    let notes = getDataFromStorage();
    let arc =  arcDataFromStorage();
    


    const taskCategory = notes.filter(function(e){
        return e.category =="Task";
      });

    console.log(taskCategory.length + " Task");
  
    

    const randomCategory = notes.filter(function(e){
        return e.category =="Random Thought";
      });

    console.log(randomCategory.length + " Random");
   
    
    const ideaCategory = notes.filter(function(e){
        return e.category =="Idea";
      });

    console.log(ideaCategory.length + " Idea");


    const ataskCategory = arc.filter(function(e){
        return e.category =="Task";
      });

    console.log(ataskCategory.length + " Task Archived");

    const arandomCategory = arc.filter(function(e){
        return e.category =="Random Thought";
      });

    console.log(arandomCategory.length + " Random Archived");

    const aideaCategory = arc.filter(function(e){
        return e.category =="Idea";
      });

    console.log(aideaCategory.length + " Idea Archived");

    const div = document.createElement('div');
    
    div.classList.add('counter-item');
    
    
    div.innerHTML = `
        <h3>3333</h3>
        ${taskCategory.length}
        ${randomCategory.length}
        ${ideaCategory.length}
        
      
      
    `;
    counterDiv.appendChild(div);
  
};

counter();

function updateCounter(){
  const x = document.querySelectorAll('counter-item');
  x.innerHTML = "";
   
}





