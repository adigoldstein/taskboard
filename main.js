function addBtnListener(btnToListen) {

  btnToListen.addEventListener('click', function (e) {

    const notesUlElem = (e.target.closest('.card').querySelector('.notes-ul'));
    const liNoteElem = document.createElement('li');

    liNoteElem.className = 'notes';
    liNoteElem.textContent = 'New note created...';
    notesUlElem.appendChild(liNoteElem);
  })
}

function addExistBtnListener() {

  const addNoteBtns = document.querySelectorAll('.add-note-btn');

  for (const button of addNoteBtns) {
    addBtnListener(button);
  }
}
addExistBtnListener();

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


  addBtnListener(liListElem.querySelector('button'));


  mainUlList.insertBefore(liListElem, addListLI);


}
