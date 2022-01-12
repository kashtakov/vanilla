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
    document.getElementById('arc-note-btn').addEventListener('click', arciveDiv);
    document.getElementById('act-note-btn').addEventListener('click', activeDiv);
    arcNoteListDiv.addEventListener('click',deleteArcNote);
    arcNoteListDiv.addEventListener('click', unarchiveNote );
    noteListDiv.addEventListener('click', deleteNote);
    noteListDiv.addEventListener('click', archiveNote);
    noteListDiv.addEventListener('click', editNote);
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
          noteCategory = document.getElementById('note-categories'),
          quoteSearch = document.getElementById('note-content');
    quoteString = quoteSearch.value;
    quoteArr = quoteString.split(' ');
    console.log(quoteArr);

    parseDate = quoteArr.forEach((element) =>{
        if(element === /([0-9]{4})-([0-9]{2})-([0-9]{2})/){
            console.log(element);
        }
    });
    
             
    if(validateInput(noteTitle, noteContent)){
        let notes = getDataFromStorage();
        const date = (new Date()).toISOString().split('T')[0];
        let noteItem = new Note(noteID, noteTitle.value, noteContent.value, noteCategory.value, date);
        noteID++;
        notes.push(noteItem);
        createNote(noteItem);
        // saving in the local storage
        localStorage.setItem('notes', JSON.stringify(notes));
        noteTitle.value = "";
        noteContent.value = "";
    }
    updateCounter();
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
        <button type ="button" class = "btn edit-note-btn">
        Edit
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
    updateCounter();
    counter();
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
    updateCounter();
    counter();
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
    
    updateCounter();
    counter();
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
    
    updateCounter();
    counter();
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

    const randomCategory = notes.filter(function(e){
        return e.category =="Random Thought";
      });
    
    const ideaCategory = notes.filter(function(e){
        return e.category =="Idea";
      });


    const ataskCategory = arc.filter(function(e){
        return e.category =="Task";
      });

    const arandomCategory = arc.filter(function(e){
        return e.category =="Random Thought";
      });

    const aideaCategory = arc.filter(function(e){
        return e.category =="Idea";
      });

    const div = document.createElement('div');
    
    div.classList.add('counter-item');
    div.setAttribute('id', 'counter-item');
    
    
    div.innerHTML = `
        <h3>Active</h3>
        <p>Task: ${taskCategory.length}</p>
        <p>Random thought ${randomCategory.length}</p>
        <p>Idea ${ideaCategory.length}</p>
        <h3>Archived</h3>
        <p>Task: ${ataskCategory.length}</p>
        <p>Random thought ${arandomCategory.length}</p>
        <p>Idea ${aideaCategory.length}</p>
        
      
      
    `;
    counterDiv.appendChild(div);
  
};

counter();

function arciveDiv(){

  
    let noteList = document.querySelectorAll('.note-item');
    if(noteList.length > 0){
        noteList.forEach(item => {
            noteListDiv.removeChild(item);
        });
    }
    
    const actBtnToggle = document.getElementById('act-note-btn');
          actBtnToggle.classList.toggle('unactive');

    const arcBtnToggle = document.getElementById('arc-note-btn');
          arcBtnToggle.classList.toggle('unactive');

    const addBtntoggle = document.getElementById('add-note-btn');
          addBtntoggle.classList.toggle('unactive');
    displayArcNotes();
}

function activeDiv(){
    
    let noteList = document.querySelectorAll('.note-item');
    if(noteList.length > 0){
        noteList.forEach(item => {
            arcNoteListDiv.removeChild(item);
        });
    }
    
    const actBtnToggle = document.getElementById('act-note-btn');
          actBtnToggle.classList.toggle('unactive');

    const arcBtnToggle = document.getElementById('arc-note-btn');
    arcBtnToggle.classList.toggle('unactive');

    const addBtntoggle = document.getElementById('add-note-btn');
          addBtntoggle.classList.toggle('unactive');

    displayNotes();
}


function updateCounter(){
    const parent = document.getElementById('counter'),
          child = document.getElementById('counter-item');
    parent.removeChild(child);
    
}

function editNote(e){

    const noteTitleFeed = document.getElementById('note-title'),
          noteContentFeed = document.getElementById('note-content');
          
    if(e.target.classList.contains('edit-note-btn')){
        let notes = getDataFromStorage();
        //console.log(e.target.parentElement);
        e.target.parentElement.remove(); // removing from DOM
        
        let divID = e.target.parentElement.dataset.id;
        
        let titleFeed = notes.find(x => x.id === parseInt(divID)).title;
        noteTitleFeed.value = titleFeed;
        let contentFeed = notes.find(x => x.id === parseInt(divID)).content;
        noteContentFeed.value = contentFeed;
       
        let newNotesList = notes.filter(item => {
            return item.id !== parseInt(divID);
        });
        
        localStorage.setItem('notes', JSON.stringify(newNotesList));
    }
      

}


