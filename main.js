// function addNote() {
//   const liNoteElem = document.createElement('li');
//   liNoteElem.textContent = 'New note created MAN'
//   console.log(liNoteElem);
// }

// Add the container main list


// Add note inside the list

function addBtnListener() {
  const addNoteBtns = document.querySelectorAll('.add-note-btn');
// console.log(addNoteBtns);
  for (const button of addNoteBtns) {
    button.addEventListener('click', function (e) {
      const notesUlElem = (e.target.closest('.card').querySelector('.notes-ul'));
      console.log(notesUlElem);
      const liNoteElem = document.createElement('li');
      liNoteElem.className = 'notes';
      liNoteElem.textContent = 'New note created...'
      notesUlElem.appendChild(liNoteElem);

    })
  }
}
addBtnListener()

function addList() {
  const mainUlList = document.querySelector('.card-list');
  const addListLI = document.querySelector('.add-list-li');
  const liListElem = document.createElement('li');
  liListElem.className = 'cards-li';
  liListElem.innerHTML = `<div class="card">
    <div class="panel panel-default">
    <div class="panel-heading">
    <h3 class="panel-title">New list inserted</h3>
    </div>
    <ul class="notes-ul">
    <div class="noteholder">
    
<!-- Note insert should be HERE!!!! -->

  </div>
  </ul>
  <div class="panel-footer">
  <button class="add-note-btn">Add Note..</button>

  </div>
  </div>
  </div>
  </li>`;
  mainUlList.insertBefore(liListElem, addListLI);
  addBtnListener(liListElem);

}
