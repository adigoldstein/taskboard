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
const tampletLi = `
    <div class="card content-card">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">New list inserted</h3>
          <input type="text">
        </div>
        <ul class="notes-ul">
           <!-- Note insert should be HERE!!!! -->
        </ul>
        <div class="panel-footer">
          <button class="add-note-btn">Add Note..</button>
        </div>
      </div>
    </div>
  `;
function addList() {
  const mainUlList = document.querySelector('.card-list');
  const addListLI = document.querySelector('.add-list-li');

  const liListElem = document.createElement('li');

  liListElem.className = 'cards-li';
  liListElem.innerHTML = tampletLi;

  // add button listener
  addBtnListener(liListElem.querySelector('button'));

  titleListenerToRename(liListElem.querySelector('.panel-heading'));
  inputListener(liListElem.querySelector('.panel-heading'));

  // insert created new list before the last list
  mainUlList.insertBefore(liListElem, addListLI);

}

// Change list name

function titleListenerToRename(item) {
  const h3Elem = item.querySelector('h3');

  h3Elem.addEventListener('click', function hideH3FocusInput(e) {
    const inputElem = item.querySelector('input');

    h3Elem.style.display = 'none';
    inputElem.style.display = 'block';
    inputElem.focus();
    inputElem.value = e.target.textContent;


  })
}
function inputListener(item) {
  const inputElem = item.querySelector('input');
  const h3Elem = item.querySelector('h3');
  inputElem.addEventListener('keydown', function (event) {

    if (event.keyCode === 13) {
      if (inputElem.value === '') {
        inputElem.value = h3Elem.innerHTML;
      }

      h3Elem.textContent = inputElem.value;
      h3Elem.style.display = 'block';
      inputElem.style.display = 'none'
    }
  })
}


// Init the app
function init() {
  addExistBtnListener();

  let panelHeadingElem = document.querySelectorAll('.content-card .panel-heading');

  for (const item of panelHeadingElem) {
    titleListenerToRename(item);
    inputListener(item)

    const addListBtn = document.querySelector('.add-list-btn');
    addListBtn.addEventListener('click', addList);
  }
}

init();

