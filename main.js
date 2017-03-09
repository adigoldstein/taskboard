const appData = {
  lists: [],
  members: []
};
getBoardJSON();
getMembersJSON()

// Create HTML skeleton dynamic

function createContentByHash() {
  if (window.location.hash === '#members') {
    createMembers();


  }

  if (window.location.hash === '#board' || window.location.hash === '') {
    createBoard();
  }
}
window.addEventListener('hashchange', (event) => {
    createContentByHash()

  }
);

function createBoard() {
  const boardTamplet = `<section id="board>
    "<ul class="card-list">
      <li class="cards-li add-list-li">
        <div class="card">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title add-list-btn">Add list..</h3>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>`;

  const mainElem = document.querySelector('main');
  // console.info(mainElem);
  // console.info(boardSection);
  // add new list listener

  mainElem.innerHTML = boardTamplet;

  const addListBtn = document.querySelector('.add-list-btn');
  addListBtn.addEventListener('click', addList);
  // console.info(appData);
  // console.info(appData.lists);
  for (const list of appData.lists) {
    addList(list);
  }

}


function createMembers() {
  const membersTamplet = `<section id="members">
    <h1>Taskboard Members</h1>
    <ul class="list-group members-list">
      <li class="list-group-item add-member-li">
        <div class="form-group">
          <input type="text" class="form-control add-member-input" placeholder="Add new member">
          <button type="button" class="btn btn-primary add-member-btn">Add Member</button>
        </div>
      </li>
    </ul>
  </section>`;

  const mainElem = document.querySelector('main');

  mainElem.innerHTML = membersTamplet;


for (const member of appData.members) {
  createNewMember(member.name)
}
}
// createMembers()


function addNoteWTextAndLabels(notesUlElem, noteinfo) {
  const liNoteElem = document.createElement('li');
  liNoteElem.className = 'note';

  const editBtnElem = document.createElement('button');
  editBtnElem.setAttribute('type', 'button');
  editBtnElem.setAttribute('class', 'btn btn-primary btn-xs note-edit-btn pull-right');
  editBtnElem.textContent = 'Edit';
  editBtnElem.addEventListener('click', function (e) {

    const modalElem = document.querySelector('.modal ');
    modalElem.style.display = 'block';

  })
  const noteTextSpan = document.createElement('span');
  noteTextSpan.setAttribute('class', 'note-text-span');
  let noteText = '';
  if (!noteinfo) {
    noteTextSpan.textContent = 'New note created...'
  } else {
    noteTextSpan.textContent = noteinfo.text
  }

  liNoteElem.innerHTML = noteText;
  liNoteElem.appendChild(editBtnElem);
  liNoteElem.appendChild(noteTextSpan);

  const labelDivElem = document.createElement('div');
  labelDivElem.setAttribute('class', 'lable-div');
  liNoteElem.appendChild(labelDivElem);

  if (noteinfo) {
    for (const member of noteinfo.members) {
      const labelElem = document.createElement('span');
      // get The first letter of each word
      let abbrev = member.split(' ');
      let nameholder = '';
      for (part of abbrev) {
        let nameIn = [];
        nameIn = part[0];
        nameholder += nameIn;
      }

      labelElem.textContent = nameholder;
      labelElem.setAttribute('class', 'label member-name-label label-primary member-name-label pull-right');
      labelElem.setAttribute('title', member);

      labelDivElem.appendChild(labelElem);
    }

  }


  editNoteListener(liNoteElem)
  notesUlElem.appendChild(liNoteElem);
}


function addCardBtnListener(btnToListen) {

  btnToListen.addEventListener('click', function addCard(e) {

    const notesUlElem = (e.target.closest('.card').querySelector('.notes-ul'));
    addNoteWTextAndLabels(notesUlElem);


  })
}

// function addCardExistBtn() {
//
//   const addNoteBtns = document.querySelectorAll('.add-note-btn');
//
//   for (const button of addNoteBtns) {
//     addCardBtnListener(button);
//   }
// }
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
  // console.info(listData);
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
      // console.info(task);
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
    if (dropdownMenuElem.style.display === 'none' || !dropdownMenuElem.style.display) {
      dropdownMenuElem.style.display = 'block';
    } else {
      dropdownMenuElem.style.display = 'none';
    }

  })
}
function dropdwonListener() {
  const dropdownElems = document.querySelectorAll('.dropdown');
  for (const dd of dropdownElems) {
    toggleMenu(dd);
    {

    }
  }
}

dropdwonListener()


function deleteCardListener(deleteLiElem) {

  deleteLiElem.addEventListener('click', function () {
    const cardToDeleteLiElem = deleteLiElem.closest('.cards-li');
    const cardToDeleteTitle = deleteLiElem.closest('.panel-heading').querySelector('.panel-title').innerHTML;
    const deleteAnswer = confirm('Deleting ' + cardToDeleteTitle + ' list. are you sure?');
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

  // console.info(editBtnElem);
  noteElem.addEventListener('mouseover', function () {
    // console.info(editBtnElem.style.display);
    // alert(editBtnElem.style.display)
    if (editBtnElem.style.display = 'none' || (!editBtnElem.style.display)) {
      editBtnElem.style.display = 'block'
    }
  });
  noteElem.addEventListener('mouseout', function () {
    editBtnElem.style.display = 'none'
  })

}

const noteElems = document.querySelectorAll('.note')
for (const noteElem of noteElems) {
  console.info(noteElem);
  editNoteListener(noteElem)
}

// members section********************************************************************

const addMemberTamplet = `<span class="member-name"></span>
     <input type="email" class="form-control edit-member-input"  >
    <button type="button" class="btn btn-danger btn-to-show delete-member-btn pull-right">Delete</button>
    <button type="button" class="btn btn-warning btn-to-show edit-member-btn pull-right">Edit</button>
    <button type="button" class="btn btn-default cancel-btn pull-right">Cancel</button>
<button type="button" class="btn btn-success cancel-btn pull-right">Save</button>`;

function createNewMember(name) {
  const membersListElem = document.querySelector('.members-list');
  const addMemberLiElem = document.querySelector('.add-member-li');
  const newMemberToAdd = document.createElement('li')

  newMemberToAdd.setAttribute('class', 'list-group-item member-li');
  newMemberToAdd.innerHTML = addMemberTamplet;
  newMemberToAdd.querySelector('span').textContent = name;


  // // Hide and show buttons on hover
  //
  // newMemberToAdd.addEventListener('mouseover', function (e) {
  //   // console.info(e.target);
  //   const buttonsElems = newMemberToAdd.querySelectorAll('.btn-to-show');
  //   for (const btn of buttonsElems) {
  //     btn.style.display = 'inline-block'
  //   }
  //
  // })
  // newMemberToAdd.addEventListener('mouseout', function (e) {
  //   // console.info(e.target);
  //   const buttonsElems = newMemberToAdd.querySelectorAll('button');
  //   for (const btn of buttonsElems) {
  //     btn.style.display = 'none';
  //   }
  // })
  // Delete member
  const deleteMemberBtn = newMemberToAdd.querySelector('.delete-member-btn');
  // console.info(deleteMemberBtn);
  deleteMemberBtn.addEventListener('click', function (e) {
    // ***********************************************************need to do!!!! delete member
  })
  // edit member
  const editMemberBtn = newMemberToAdd.querySelector('.edit-member-btn');
  editMemberBtn.addEventListener('click', function (e) {
    editMemberBtn.style.display = 'none';
    const liMemberElem = e.target.closest('.member-li');
    const memberNameSpan = liMemberElem.querySelector('.member-name');
    const editMemberInputElem = liMemberElem.querySelector('.edit-member-input')
    const cancelBtnElem = liMemberElem.querySelector('.cancel-btn');

    cancelBtnElem.style.display = 'inline-block';
    editMemberInputElem.value = memberNameSpan.innerHTML;
    editMemberInputElem.style.display = 'inline-block';
    editMemberInputElem.focus();
    memberNameSpan.style.display = 'none';
  })
  membersListElem.insertBefore(newMemberToAdd, addMemberLiElem);


}

const addMemberBtn = document.querySelector('.add-member-btn');
// console.info(addMemberBtn);
function addMemberEventListener() {
  addMemberBtn.addEventListener('click', function (e) {
    const inputElem = e.target.closest('.form-group').querySelector('input');
    const newMemberName = (inputElem.value);

    createNewMember(newMemberName)
  })
}


// Init the app - not running!
// function init() {
//   addCardExistBtn();
//
//   let panelHeadingElem = document.querySelectorAll('.content-card .panel-heading');
//
//   for (const item of panelHeadingElem) {
//     titleListenerToRename(item);
//     inputListener(item)
//
//
//   }
// }

// init();


//***************** modal stuff***********************
function closeModal() {
  const modalElem = document.querySelector('.modal');
  modalElem.style.display = 'none'
}

const modalElem = document.querySelector('.modal');
const xModalCloseBtn = modalElem.querySelector('.close');
xModalCloseBtn.addEventListener('click', function () {
  closeModal()
})
const modalCloseBtn = modalElem.querySelector('.modal-close-btn');
// console.info(modalCloseBtn);
modalCloseBtn.addEventListener('click', function () {
  closeModal()
})
// ****************Import JSON stuff****************
function areJSONSHeher() {

  if (appData.members.length && appData.lists.length) {
    return true;
  } else {
    return false;
  }
}


function getBoardJSON() {
  let listData = {};

  function reqListener() {
    listData = JSON.parse(data.responseText);
    appData.lists = listData.board;
    // console.info(appData);

    if (areJSONSHeher()) {
      createContentByHash()

    }
  }

  const data = new XMLHttpRequest();
  data.addEventListener("load", reqListener);
  data.open("GET", "assets/board.json");
  data.send();
}


// **************************************


function getMembersJSON() {

  let listMember = {};

  function reqListenerMembers() {
    listMember = JSON.parse(membersData.responseText);
    appData.members = listMember.members
    // console.info(appData);

    if (areJSONSHeher()) {
      createContentByHash()
    }

  }

  const membersData = new XMLHttpRequest();

  membersData.addEventListener("load", reqListenerMembers);
  membersData.open("GET", "assets/members.json");
  membersData.send();

}
