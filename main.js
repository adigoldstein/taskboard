
// function addNote() {
//   const liNoteElem = document.createElement('li');
//   liNoteElem.textContent = 'New note created MAN'
//   console.log(liNoteElem);
// }

function addList() {
  const mainUlList = document.querySelector('.card-list');
  console.log(mainUlList);
  const addListLI = document.querySelector('.add-list-li')
  console.log(addListLI);
  const liListElem = document.createElement('li');
  liListElem.className = 'cards-li';
  liListElem.innerHTML =   `<div class="card">
    <div class="panel panel-default">
    <div class="panel-heading">
    <h3 class="panel-title">Done</h3>
    </div>
    <ul class="notes-ul">
    <div class="noteholder">
    <li class="notes">
    Note item number 1 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium magnam odit
  repellat tempora! A, aliquam distinctio dolore, enim error facilis illum libero nobis perferendis quaerat
  quibusdam, repellat sit vel voluptatem?
</li>

  </div>
  </ul>
  <div class="panel-footer">
     <button class="add-note-btn" onclick="addNote()  ">Add Note..</button>
  </div>
  </div>
  </div>
  </li>`;
  console.log(liListElem);
 mainUlList.insertBefore(liListElem, addListLI);

}
