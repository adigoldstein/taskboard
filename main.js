function addBtnListener(btnToListen) {

  btnToListen.addEventListener('click', function (e) {

    const notesUlElem = (e.target.closest('.card').querySelector('.notes-ul'));
    const liNoteElem = document.createElement('li');

    liNoteElem.className = 'note';
    liNoteElem.innerHTML = ' <button type="button" class="btn btn-primary btn-xs pull-right" >Edit</button>New note created...';
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
function addList() {
  const mainUlList = document.querySelector('.card-list');
  const addListLI = document.querySelector('.add-list-li');

  const liListElem = document.createElement('li');

  liListElem.className = 'list-li';
  liListElem.innerHTML = tampletLi;

  // add button listener

  addBtnListener(liListElem.querySelector('.add-note-btn'));

  titleListenerToRename(liListElem.querySelector('.panel-heading'));
  inputListener(liListElem.querySelector('.panel-heading'));

  // edit menu Listener

  const dropdownElem = liListElem.querySelector('.dropdown');

  // Hide ul by default to created lists.
  dropdownElem.querySelector('ul').style.display = 'none';
  toggleMenu(dropdownElem);

  // Delete card listener

  const deleteCardLiElem = liListElem.querySelector('.delete-card');
  console.info(deleteCardLiElem);
  deleteCardListener(deleteCardLiElem);

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
    console.info(dropdownMenuElem.style.display);
    if (dropdownMenuElem.style.display === 'none' || !dropdownMenuElem.style.display ) {
      dropdownMenuElem.style.display = 'block';
    } else {
      dropdownMenuElem.style.display = 'none';
    }

  })
}
function dropdwonListener() {
  const dropdownElems = document.querySelectorAll('.dropdown');
  // console.info(dropdownElems);
  for (const dd of dropdownElems) {
     toggleMenu(dd); {

    }
  }
}

dropdwonListener()


function deleteCardListener(deleteLiElem) {
  console.info(deleteLiElem);

  deleteLiElem.addEventListener('click', function () {
    const cardToDeleteLiElem = deleteLiElem.closest('.cards-li');
    console.info(cardToDeleteLiElem);
    const cardToDeleteTitle = deleteLiElem.closest('.panel-heading').querySelector('.panel-title').innerHTML;
    // console.info( cardToDeleteTitle);
    const deleteAnswer = confirm('Deleting ' +  cardToDeleteTitle + ' list. are you sure?');
    const ulHoldsDelete = deleteLiElem.closest(".dropdown-menu");
    console.info(ulHoldsDelete);

    if (deleteAnswer) {
      cardToDeleteLiElem.remove()
    } else {
      ulHoldsDelete.style.display = 'none';

    }

  })



}


function DeleteCard() {
  const deleteCardLiElems = document.querySelectorAll('.delete-card');
  console.info(deleteCardLiElems);
  for (const deleteLiElem of deleteCardLiElems) {
    deleteCardListener(deleteLiElem);



  }

}
DeleteCard()




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

