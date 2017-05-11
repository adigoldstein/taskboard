// Create HTML skeleton dynamic


function createContentByHash() {
  if (window.location.hash === '#members') {
    createMembers();
    const membersNavElem = document.querySelector('.nav-members');
    membersNavElem.classList.add('active');
    const boardNavElem = document.querySelector('.nav-board');
    boardNavElem.classList.remove('active');
  }

  if (window.location.hash === '#board' || window.location.hash === '') {

    createBoard();
    const membersNavElem = document.querySelector('.nav-members');
    membersNavElem.classList.remove('active');
    const boardNavElem = document.querySelector('.nav-board');
    boardNavElem.classList.add('active');
  }
}
window.addEventListener('hashchange', () => {
    createContentByHash()

  }
);

function createBoard() {
  const boardTemplate = `<section id="board">
    <ul class="list-list">
      <li class="list-li  add-list-li">
        <div class="list">
          <div class="panel panel-default">
            <div class="panel-heading add-list-panel">
              <h3 class="panel-title add-list-btn ">Add list..</h3>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>`;

  const mainElem = document.querySelector('main');

  mainElem.innerHTML = boardTemplate;

  const addListBtn = document.querySelector('.add-list-btn');
  addListBtn.addEventListener('click', addList);
  for (const list of MODEL.getLists()) {
    addList(list);
  }
}


function createMembers() {
  const membersTemplate = `<section id="members">
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

  mainElem.innerHTML = membersTemplate;
  addMemberEventListener();

  for (const member of MODEL.getMembers()) {
    createNewMember(member.name, member.id)
  }
}

function updateModalTextAndMembers(listId, noteId, cardTextarea, modalElem, noteElem) {
  const listInAppData = MODEL.findListInAppDataById(listId);

  const noteInAppData = MODEL.findNoteInListById(listInAppData, noteId);

  MODEL.updateNoteInAppdata(noteInAppData, cardTextarea.value);


// ***************
  // members checkbox

  const membersInputsElems = modalElem.querySelectorAll('input');
  const newMembersOfNote = [];
  for (const member of membersInputsElems) {
    if (member.checked) {
      const newMemberId = member.getAttribute('member-id');
      newMembersOfNote.push(newMemberId)
    }
  }
  // update members on appData****
  MODEL.updateMembersOfNote(noteInAppData, newMembersOfNote);

// in UI

  const labelDivElem = document.createElement('div');
  labelDivElem.setAttribute('class', 'label-div');

  for (let member of newMembersOfNote) {

    // ************turning member id to member name
    let memberName = MODEL.getMemberNameById(member);


    const labelElem = document.createElement('span');
    // get The first letter of each word
    let abbrev = memberName.split(' ');
    let nameHolder = '';
    for (const part of abbrev) {
      let nameIn = [];
      nameIn = part[0];
      nameHolder += nameIn;
    }

    labelElem.textContent = nameHolder;
    labelElem.setAttribute('class', 'label member-name-label label-primary member-name-label');
    labelElem.setAttribute('title', memberName);

    labelDivElem.appendChild(labelElem);
  }

  const oldLabelDiv = noteElem.querySelector('.label-div');

  oldLabelDiv.innerHTML = labelDivElem.innerHTML;

}

function updateMoveTo(modalElem, listId, noteId, noteElem) {
  const moveToSelect = modalElem.querySelectorAll('.move-to-options option');
  let newIdSelected = ';';
  moveToSelect.forEach(function (option) {
    if (option.selected) {
      newIdSelected = option.getAttribute('data-id');
    }

  });
  if (newIdSelected !== listId) {
    // in appData:
    // add new note
    const listInAppData = MODEL.findListInAppDataById(listId);
    const noteInAppData = MODEL.findNoteInListById(listInAppData, noteId);
    MODEL.addNoteToAppData(newIdSelected, noteInAppData);
    // remove old note

    MODEL.removeTaskFromAppData(listInAppData, noteInAppData);

    // in UI

    const allListsElms = document.querySelectorAll('.list-li');
    allListsElms.forEach((list) => {
      const listId = list.getAttribute('data-id');
      if (newIdSelected === listId) {
        const notesUl = list.querySelector('.notes-ul');
        notesUl.appendChild(noteElem)
      }
    })
  }
}
// save changes on notes edit**
function saveChangesEditNote(e) {
  let modalElem = e.target.closest('.modal');
  modalElem.style.display = 'none';
  const cardTextarea = modalElem.querySelector('.card-textarea');
  const noteId = modalElem.getAttribute('note-id');
  const listId = modalElem.getAttribute('list-id');
  const allNotesElems = document.querySelectorAll('.note');
  let noteElem = '';

  allNotesElems.forEach(function (note) {
    const checkedNoteId = note.getAttribute('data-id');
    if (checkedNoteId === noteId) {
      note.querySelector('.note-text-span').innerHTML = cardTextarea.value;
      noteElem = note;
    }
  });

  updateModalTextAndMembers(listId, noteId, cardTextarea, modalElem, noteElem);
  updateMoveTo(modalElem, listId, noteId, noteElem);


}


function deleteNoteHandler(e) {
  const modalElem = e.target.closest('.modal');
  modalElem.style.display = 'none';
  const noteId = modalElem.getAttribute('note-id');
  const allNotesElems = document.querySelectorAll('.note');
  allNotesElems.forEach(function (note) {
    const checkedNoteId = note.getAttribute('data-id');
    if (checkedNoteId === noteId) {
      note.remove();
      const listId = modalElem.getAttribute('list-id');
      // delete Note in appData
      const containingList = MODEL.findListInAppDataById(listId);
      const noteToRemove = MODEL.findNoteInListById(containingList, checkedNoteId);
      MODEL.removeTaskFromAppData(containingList, noteToRemove);
    }
  })
}

function fillModalWithContent(editBtnElem, notesUlElem, liNoteElem, noteUuid, noteInfo) {
  editBtnElem.addEventListener('click', function (e) {

    const modalElem = document.querySelector('.modal ');
    const modalCardTextElem = modalElem.querySelector('.card-textarea');
    modalElem.style.display = 'block';

    // fill modal with relevant content
    let noteElem = e.target.closest('.note');

    const noteToEditId = noteElem.getAttribute('data-id');
    const mainListId = noteElem.closest('.list-li').getAttribute('data-id');
    modalElem.setAttribute('note-id', noteToEditId);
    modalElem.setAttribute('list-id', mainListId);


    const listToEditInappData = MODEL.findListInAppDataById(mainListId);
    const noteToEditInappData = MODEL.findNoteInListById(listToEditInappData, noteToEditId);

    // Shows Note content from Appdata
    modalCardTextElem.value = MODEL.getNoteText(noteToEditInappData);

    // fill move to
    const moveToSelect = modalElem.querySelector('.move-to-options');
    moveToSelect.innerHTML = '';
    MODEL.getLists().forEach(function (list) {
      const optionElem = document.createElement('option');
      optionElem.innerHTML = list.title;
      optionElem.setAttribute('data-id', list.id);
      if (list.id === mainListId) {
        optionElem.setAttribute('selected', '');
      }

      moveToSelect.appendChild(optionElem);
    });


// fill members
    const memberListHolder = document.querySelector('.members-checkbox');
    memberListHolder.innerHTML = '';
    MODEL.getMembers().forEach((member) => {
      const memberId = member.id;
      const memberName = member.name;
      const memElm = document.createElement('label');
      memElm.innerHTML = `<input type="checkbox" value=""><span class="member-name-span"></span>`;
      memberListHolder.appendChild(memElm);
      const nameSpanElem = memElm.querySelector('.member-name-span');
      nameSpanElem.innerHTML = memberName;
      const inputElem = memElm.querySelector('input');
      inputElem.setAttribute('member-id', memberId);
    });

    // find which members are in note
    const membersInThisNote = MODEL.getNoteMembers(noteToEditInappData);
    const membersList = modalElem.querySelectorAll('input');

    membersInThisNote.forEach((memberInList) => {
      membersList.forEach((inputOfMembers) => {
        const inputMemberId = inputOfMembers.getAttribute('member-id');
        if (inputMemberId === memberInList) {
          inputOfMembers.checked = true;
        }
      })
    })
  });


  editNoteListener(liNoteElem);
  notesUlElem.appendChild(liNoteElem);

  // add to appData*
  if (!noteInfo) {
    const listId = liNoteElem.closest('.list-li').getAttribute('data-id');
    MODEL.addNewNoteToAppData(listId, noteUuid)
  }
}

function addNoteWTextAndLabels(notesUlElem, noteInfo) {

  const liNoteElem = document.createElement('li');
  liNoteElem.className = 'note';

  const editBtnElem = document.createElement('button');
  editBtnElem.setAttribute('type', 'button');
  editBtnElem.setAttribute('class', 'btn btn-primary btn-xs note-edit-btn pull-right');
  editBtnElem.textContent = 'Edit';

  const noteTextSpan = document.createElement('span');
  const noteUuid = uuid();
  noteTextSpan.setAttribute('class', 'note-text-span');
  let noteText = '';

  if (!noteInfo) {
    noteTextSpan.textContent = 'New note created...';
    liNoteElem.setAttribute('data-id', noteUuid);


  } else {
    noteTextSpan.textContent = noteInfo.text;
    liNoteElem.setAttribute('data-id', noteInfo.id);
  }

  liNoteElem.innerHTML = noteText;
  liNoteElem.appendChild(editBtnElem);
  liNoteElem.appendChild(noteTextSpan);

  const labelDivElem = document.createElement('div');
  labelDivElem.setAttribute('class', 'label-div');
  liNoteElem.appendChild(labelDivElem);

  if (noteInfo) {

    for (let member of MODEL.getNoteInfoMembers(noteInfo)) {
      let memberName = MODEL.getMemberNameById(member);

      const labelElem = document.createElement('span');
      // get The first letter of each word:
      let abbrev = memberName.split(' ');
      let nameInitials = '';
      for (const part of abbrev) {
        let nameIn = [];
        nameIn = part[0];
        nameInitials += nameIn;
      }

      labelElem.textContent = nameInitials;
      labelElem.setAttribute('class', 'label member-name-label label-primary member-name-label');
      labelElem.setAttribute('title', memberName);

      labelDivElem.appendChild(labelElem);
    }

  }
// Edit Modal
  fillModalWithContent(editBtnElem, notesUlElem, liNoteElem, noteUuid, noteInfo);

}

// end of modal


function addCardBtnListener(btnToListen) {

  btnToListen.addEventListener('click', function addCard(e) {

    const notesUlElem = (e.target.closest('.list').querySelector('.notes-ul'));
    addNoteWTextAndLabels(notesUlElem);
  })
}

const tampletLi = `
      <div class="list content-list">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">My new list</h3>
            <input type="text">
            <div class="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li class="delete-list">Delete list</li>
                </ul>
              </div>
          </div>
          <ul class="notes-ul">
          </ul>
          <div class="panel-footer">
            <button class="add-note-btn">Add Note..</button>
          </div>
        </div>
      </div>
  `;

function addList(listData) {

  const mainUlListElem = document.querySelector('.list-list');
  const addListLiElem = document.querySelector('.add-list-li');
  const liListElem = document.createElement('li');

  liListElem.className = 'list-li';
  liListElem.innerHTML = tampletLi;


  if (listData.type !== 'click') {
//  **When inserting JSON data**
    liListElem.setAttribute('data-id', listData.id);
    const listTitleElem = liListElem.querySelector('.panel-title');
    const noteUlElem = liListElem.querySelector('.notes-ul');

    listTitleElem.innerHTML = listData.title;

    for (const note of listData.tasks) {
      addNoteWTextAndLabels(noteUlElem, note)
    }

  } else {
    const id = uuid();
    liListElem.setAttribute('data-id', id);


    // add to appData
    const listToAddToAppData = {
      title: 'My new list',
      tasks: [],
      id: id
    };
    MODEL.addNewListToAppData(listToAddToAppData);

  }

  // add list button listener

  addCardBtnListener(liListElem.querySelector('.add-note-btn'));
  titleListenerToRename(liListElem.querySelector('.panel-heading'));
  inputListener(liListElem.querySelector('.panel-heading'));

  // edit menu Listener

  const dropdownElem = liListElem.querySelector('.dropdown');

  // Hide drop down by default
  dropdownElem.querySelector('ul').style.display = 'none';
  toggleMenu(dropdownElem);

  // Delete list listener

  const deleteCardLiElem = liListElem.querySelector('.delete-list');
  deleteCardListener(deleteCardLiElem);


  // insert created new list before the last list
  mainUlListElem.insertBefore(liListElem, addListLiElem);

}

// Change list name
function hideH3FocusInput(e) {
  const evPressed = e.target;
  const note = evPressed.closest('.list');

  const inputElem = note.querySelector('input');
  const h3Elem = note.querySelector('h3');

  h3Elem.style.display = 'none';
  inputElem.style.display = 'inline-block';
  inputElem.focus();
  inputElem.value = e.target.textContent;

}

function titleListenerToRename(item) {
  const h3Elem = item.querySelector('h3');

  h3Elem.addEventListener('click', hideH3FocusInput);

}

function editListTitleAndUpdateAppdata(h3Elem, inputElem) {
  const listLiId = h3Elem.closest('.list-li').getAttribute('data-id')
  h3Elem.textContent = inputElem.value;
  h3Elem.style.display = 'block';
  inputElem.style.display = 'none';

  // in appData***
  const listToEdit = MODEL.findListInAppDataById(listLiId);
  MODEL.editListTitleInAppData(listToEdit, h3Elem);
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
      editListTitleAndUpdateAppdata(h3Elem, inputElem);
    }
  })
  // When title changed and blur
  inputElem.addEventListener('blur', function () {
    if (inputElem.value === '') {
      inputElem.value = h3Elem.innerHTML;
    }
    editListTitleAndUpdateAppdata(h3Elem, inputElem);
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


function deleteCardListener(deleteLiElem) {

  deleteLiElem.addEventListener('click', function () {
    const listToDeleteElem = deleteLiElem.closest('.list-li');
    const listToDeleteTitle = deleteLiElem.closest('.panel-heading').querySelector('.panel-title').innerHTML;
    const deleteAnswer = confirm('Deleting ' + listToDeleteTitle + ' list. are you sure?');
    const ulHoldsDelete = deleteLiElem.closest(".dropdown-menu");
    const idToDel = listToDeleteElem.getAttribute('data-id');

    if (deleteAnswer) {
      listToDeleteElem.remove();

      // Remove from appData
      const appDataElemToDelete = MODEL.findListInAppDataById(idToDel);

      MODEL.removeListFromAppData(appDataElemToDelete)
    } else {
      ulHoldsDelete.style.display = 'none';
    }
  })
}


function DeleteCard() {

  const deleteListElems = document.querySelectorAll('.delete-list');

  for (const deleteLiElem of deleteListElems) {
    deleteCardListener(deleteLiElem);
  }
}
DeleteCard();

// edit note behavior
function editNoteListener(noteElem) {
  const editBtnElem = noteElem.querySelector('.note-edit-btn');

  noteElem.addEventListener('mouseover', function () {
    // By default buttons display is undefined
    if (editBtnElem.style.display = 'none' || (!editBtnElem.style.display)) {
      editBtnElem.style.display = 'block'
    }
  });
  noteElem.addEventListener('mouseout', function () {
    editBtnElem.style.display = 'none'
  })
}

const noteElems = document.querySelectorAll('.note');
for (const noteElem of noteElems) {
  editNoteListener(noteElem)
}

// members section

const addMemberTemplate = `<span class="member-name"></span>
    <input type="email" class="form-control edit-member-input">
    <button type="button" class="btn btn-danger btn-to-show-on-hover delete-member-btn pull-right">Delete</button>
    <button type="button" class="btn btn-warning btn-to-show-on-hover edit-member-btn pull-right">Edit</button>
    <button type="button" class="btn btn-default edit-btns cancel-btn pull-right">Cancel</button>
    <button type="button" class="btn btn-success edit-btns save-btn pull-right">Save</button>`;

function memberSaveChanges(memberNameSpan, btnsToHide, editBtns, editMemberInputElem) {
  const memberName = memberNameSpan.innerHTML;

  function memberToEdit(member) {
    return member.name === memberName;
  }

  btnsToHide.forEach((btn) => {
    btn.classList.remove('edit-mode-hide');
  });

  for (const editB of editBtns) {
    editB.style.display = 'none';
  }

// in appData
  const memberToEditInAppData = MODEL.getMembers().find(memberToEdit);
  MODEL.updateMemberNameInAppData(memberToEditInAppData, editMemberInputElem);

  if (editMemberInputElem.value === '') {
    editMemberInputElem.value = memberNameSpan.innerHTML;
    MODEL.updateMemberNameInAppData(memberToEditInAppData, editMemberInputElem);
  }

  memberNameSpan.innerHTML = editMemberInputElem.value;
  memberNameSpan.style.display = 'inline-block';
  editMemberInputElem.style.display = 'none';

}
function addMemberHandler(e) {
  const inputElem = e.target.closest('.form-group').querySelector('input');
  const newMemberName = inputElem.value;

  if (newMemberName !== '') {
    const id = uuid();
    createNewMember(newMemberName, id);
    inputElem.value = '';

    // in appData

    MODEL.addMemberToAppData(newMemberName, id)
  }
}

function createNewMember(member, id) {

  const membersListElem = document.querySelector('.members-list');
  const addMemberLiElem = document.querySelector('.add-member-li');
  const newMemberToAdd = document.createElement('li');

  newMemberToAdd.setAttribute('class', 'list-group-item member-li');
  newMemberToAdd.setAttribute('data-id', id);

  newMemberToAdd.innerHTML = addMemberTemplate;
  newMemberToAdd.querySelector('span').textContent = member;

  // Delete member
  const deleteMemberBtn = newMemberToAdd.querySelector('.delete-member-btn');
  deleteMemberBtn.addEventListener('click', function (e) {

    const ulMembersElem = e.target.closest('.members-list');
    const liMemberElem = e.target.closest('.member-li');
    ulMembersElem.removeChild(liMemberElem);


    const memberNameToDelete = (liMemberElem.querySelector('.member-name').innerHTML);

    function memberToDelete(member) {
      return member.name === memberNameToDelete;

    }

    // in appDate
    const memberElemToRemove = MODEL.getMembers().find(memberToDelete);
    const indexOfToRemove = MODEL.getMembers().indexOf(memberElemToRemove);
    MODEL.deleteMemberFromAppData(indexOfToRemove);

    MODEL.removeMemberDeletedFromTasks(id);

  });
  // edit member
  const editMemberBtn = newMemberToAdd.querySelector('.edit-member-btn');
  editMemberBtn.addEventListener('click', function (e) {


    const liMemberElem = e.target.closest('.member-li');
    const memberNameSpan = liMemberElem.querySelector('.member-name');
    const editMemberInputElem = liMemberElem.querySelector('.edit-member-input');
    const btnsToHide = liMemberElem.querySelectorAll('.btn-to-show-on-hover');
    const editBtns = liMemberElem.querySelectorAll('.edit-btns');
    const cancelBtnElem = liMemberElem.querySelector('.cancel-btn');
    const saveBtnElem = liMemberElem.querySelector('.save-btn');
    btnsToHide.forEach((btn) => {
      btn.classList.add('edit-mode-hide');
    });

    for (const editB of editBtns) {
      editB.style.display = 'inline-block';
    }
    cancelBtnElem.style.display = 'inline-block';
    editMemberInputElem.value = memberNameSpan.innerHTML;
    editMemberInputElem.focus();
    editMemberInputElem.style.display = 'inline-block';
    memberNameSpan.style.display = 'none';

    // save Changes functionality on clock and with ENTER
    saveBtnElem.addEventListener('click', () => memberSaveChanges(memberNameSpan, btnsToHide, editBtns, editMemberInputElem));

    editMemberInputElem.addEventListener('keyup', (e) => {

      if (e.key === 'Enter') {
        memberSaveChanges(memberNameSpan, btnsToHide, editBtns, editMemberInputElem);
      }
    });

    // cancel button functionality
    cancelBtnElem.addEventListener('click', function () {
      for (const btn of btnsToHide) {
        btn.style.display = 'inline-block';
      }
      for (const editB of editBtns) {
        editB.style.display = 'none';
      }
      editMemberInputElem.style.display = 'none';
      memberNameSpan.style.display = 'inline-block';
    });

  });
  membersListElem.insertBefore(newMemberToAdd, addMemberLiElem);
}

function addMemberEventListener() {
  const addMemberBtn = document.querySelector('.add-member-btn');
  const addMemberInputElem = addMemberBtn.closest('.form-group').querySelector('.add-member-input');

  addMemberInputElem.addEventListener('keyup', (e) => {

    if (e.key === 'Enter') {
      addMemberHandler(e)
    }
  });

  addMemberBtn.addEventListener('click', (e) => addMemberHandler(e))
}

function modalInit() {
  function closeModal() {
    const modalElem = document.querySelector('.modal');
    modalElem.style.display = 'none'
  }

  const modalElem = document.querySelector('.modal');
  const xModalCloseBtn = modalElem.querySelector('.close');
  xModalCloseBtn.addEventListener('click', function () {
    closeModal()
  });
  const modalCloseBtn = modalElem.querySelector('.modal-close-btn');
  modalCloseBtn.addEventListener('click', function () {
    closeModal()
  });
  const saveBtn = modalElem.querySelector('.modal-save-changed');
  saveBtn.addEventListener('click', saveChangesEditNote);

  const deleteNoteElem = document.querySelector('.del-note-btn');
  deleteNoteElem.addEventListener('click', deleteNoteHandler)

}


// ****************Import JSON stuff****************
function areJSONSHere() {

  if (MODEL.getMembers().length && MODEL.getLists().length) {
    return true;
  } else {
    return false;
  }
}


function getBoardJSON() {
  let listData = {};

  function reqListener() {
    listData = JSON.parse(data.responseText);
    MODEL.setLists(listData.board);

    if (areJSONSHere()) {
      MODEL.setAppDataLocalStorage();
      createContentByHash()

    }
  }

  const data = new XMLHttpRequest();
  data.addEventListener("load", reqListener);
  data.open("GET", "assets/board-advanced.json");
  data.send();
}


function getMembersJSON() {

  let listMember = {};

  function reqListenerMembers() {
    listMember = JSON.parse(membersData.responseText);
    MODEL.setMembers(listMember.members);

    if (areJSONSHere()) {
      MODEL.setAppDataLocalStorage();
      createContentByHash()
    }
  }

  const membersData = new XMLHttpRequest();

  membersData.addEventListener("load", reqListenerMembers);
  membersData.open("GET", "assets/members.json");
  membersData.send();
}

if (localStorage.getItem('appData')) {
  MODEL.bringAppDataFromLocalStorage();
  createContentByHash();
} else {
  getBoardJSON();
  getMembersJSON();
}

modalInit();

