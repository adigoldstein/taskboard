
function addNoteWTextAndLabels(notesUlElem, noteinfo) {

  const liNoteElem = document.createElement('li');
  liNoteElem.className = 'note';
  const editBtnElem = document.createElement('button');
  editBtnElem.setAttribute('type', 'button');
  editBtnElem.setAttribute('class', 'btn btn-primary btn-xs note-edit-btn pull-right');

  const noteTextSpan = document.createElement('span');
  let noteText = '';
    if (!noteinfo) {
      noteTextSpan.textContent = 'New note created...'
    } else {
      noteTextSpan.textContent = noteinfo.text
    }
    editBtnElem.textContent = 'Edit'
  liNoteElem.innerHTML = noteText;
  liNoteElem.appendChild(editBtnElem)
  liNoteElem.appendChild(noteTextSpan)
  const labelDivElem = document.createElement('div');
  labelDivElem.setAttribute('class', 'lable-div');
  liNoteElem.appendChild(labelDivElem)
  if (noteinfo) {
    for ( const member of noteinfo.members) {
      labelElem = document.createElement('span');
      labelElem.setAttribute('class', 'label label-primary pull-right');
      labelElem.innerHTML = member;
      labelDivElem.appendChild(labelElem)
  }

  }
  // console.info(liNoteElem);

  editNoteListener(liNoteElem)
  notesUlElem.appendChild(liNoteElem);
}


function addCardBtnListener(btnToListen) {

  btnToListen.addEventListener('click', function addCard (e) {
console.info(e.target);
    const notesUlElem = (e.target.closest('.card').querySelector('.notes-ul'));
    addNoteWTextAndLabels(notesUlElem);




  })
}

function addCardExistBtn() {

  const addNoteBtns = document.querySelectorAll('.add-note-btn');

  for (const button of addNoteBtns) {
    addCardBtnListener(button);
  }
}
const tampletLi = `
    <li class="cards-li">
      <div class="card content-card">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">New list inserted</h3>
            <input type="text">
            <div class="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li class="delete-card">Delete card</li>
                </ul>
              </div>
          </div>
          <ul class="notes-ul">
             <!-- Note insert should be HERE!!!! -->
          </ul>
          <div class="panel-footer">
            <button class="add-note-btn">Add Note..</button>
          </div>
        </div>
      </div>
    </li>
  `;
function addList(listData) {
  const mainUlList = document.querySelector('.card-list');
  const addListLI = document.querySelector('.add-list-li');

  const liListElem = document.createElement('li');

  liListElem.className = 'list-li';
  liListElem.innerHTML = tampletLi;
// console.info(listData);
  if (listData.type !== 'click') {
// ******************When inserting JSON data**********************
//     console.info(listData)
    const cardTitle = liListElem.querySelector('.panel-title');
    const noteUl = liListElem.querySelector('.notes-ul')
    // console.info(noteUl);
    cardTitle.innerHTML = listData.title;

    for (const task of listData.tasks) {
      console.info(task);
     addNoteWTextAndLabels(noteUl, task)
    }




  }

  // add card button listener

  addCardBtnListener(liListElem.querySelector('.add-note-btn'));
  titleListenerToRename(liListElem.querySelector('.panel-heading'));
  inputListener(liListElem.querySelector('.panel-heading'));

  // edit menu Listener

  const dropdownElem = liListElem.querySelector('.dropdown');

  // Hide ul by default to created lists.
  dropdownElem.querySelector('ul').style.display = 'none';
  toggleMenu(dropdownElem);

  // Delete card listener

  const deleteCardLiElem = liListElem.querySelector('.delete-card');
  deleteCardListener(deleteCardLiElem);

  // Edit note listener

  // insert created new list before the last list
  mainUlList.insertBefore(liListElem, addListLI);

}




// Change list name
function hideH3FocusInput(e) {
  const evPressed = e.target;
  const item = evPressed.closest('.card');

  const inputElem = item.querySelector('input');
  const h3Elem = item.querySelector('h3');

  h3Elem.style.display = 'none';
  inputElem.style.display = 'inline-block';
  inputElem.focus();
  inputElem.value = e.target.textContent;


}

function titleListenerToRename(item) {
  const h3Elem = item.querySelector('h3');

  h3Elem.addEventListener('click', hideH3FocusInput);

}

function inputListener(item) {
  const inputElem = item.querySelector('input');
  const h3Elem = item.querySelector('h3');

  // When title changed and ENTER pressed
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

  // When title changed and blur
  inputElem.addEventListener('blur', function () {
    if (inputElem.value === '') {
      inputElem.value = h3Elem.innerHTML;
    }


    h3Elem.textContent = inputElem.value;
    h3Elem.style.display = 'block';
    inputElem.style.display = 'none'

  })
}

// Dropdown list menu

function toggleMenu(menu) {
  const menuBtnElem = menu.querySelector('button');
  menuBtnElem.addEventListener('click', function () {
    const dropdownMenuElem = menu.querySelector('.dropdown-menu');
    if (dropdownMenuElem.style.display === 'none' || !dropdownMenuElem.style.display ) {
      dropdownMenuElem.style.display = 'block';
    } else {
      dropdownMenuElem.style.display = 'none';
    }

  })
}
function dropdwonListener() {
  const dropdownElems = document.querySelectorAll('.dropdown');
  for (const dd of dropdownElems) {
     toggleMenu(dd); {

    }
  }
}

dropdwonListener()


function deleteCardListener(deleteLiElem) {

  deleteLiElem.addEventListener('click', function () {
    const cardToDeleteLiElem = deleteLiElem.closest('.cards-li');
    const cardToDeleteTitle = deleteLiElem.closest('.panel-heading').querySelector('.panel-title').innerHTML;
    const deleteAnswer = confirm('Deleting ' +  cardToDeleteTitle + ' list. are you sure?');
    const ulHoldsDelete = deleteLiElem.closest(".dropdown-menu");

    if (deleteAnswer) {
      cardToDeleteLiElem.remove()
    } else {
      ulHoldsDelete.style.display = 'none';

    }

  })



}


function DeleteCard() {
  const deleteCardLiElems = document.querySelectorAll('.delete-card');
  for (const deleteLiElem of deleteCardLiElems) {
    deleteCardListener(deleteLiElem);



  }

}
DeleteCard()

// edit note behavior
function editNoteListener(noteElem) {
  const editBtnElem = noteElem.querySelector('.note-edit-btn');

  console.info(editBtnElem);
  noteElem.addEventListener('mouseover' , function () {
    // console.info(editBtnElem.style.display);
    // alert(editBtnElem.style.display)
    if (editBtnElem.style.display = 'none' || (!editBtnElem.style.display)) {
      editBtnElem.style.display = 'block'
    }
  });
  noteElem.addEventListener('mouseout' , function () {
    editBtnElem.style.display = 'none'
  })

}

const noteElems = document.querySelectorAll('.note')
for (const noteElem of noteElems) {
  console.info(noteElem);
  editNoteListener(noteElem)
}
// Init the app
function init() {
  addCardExistBtn();

  let panelHeadingElem = document.querySelectorAll('.content-card .panel-heading');

  for (const item of panelHeadingElem) {
    titleListenerToRename(item);
    inputListener(item)

    const addListBtn = document.querySelector('.add-list-btn');
    addListBtn.addEventListener('click', addList);
  }
}

init();










// ****************Import JSON stuff****************
let listData = {};
function reqListener () {
  // console.log(data.responseText);
  listData = JSON.parse(data.responseText);
  // console.info(listData.board[0]);
  // console.info(listData.board[1]);
  for (const each of listData.board) {
    // console.info(each);
    addList(each)

  }
}

const data = new XMLHttpRequest();
data.addEventListener("load", reqListener);
data.open("GET", "assets/board.json");
data.send();

