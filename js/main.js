
// uuid random id example:
// console.info(uuid());


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
  const boardTamplet = `<section id="board">
    <ul class="card-list">
      <li class="cards-li list-li  add-list-li">
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

  mainElem.innerHTML = boardTamplet;

  const addListBtn = document.querySelector('.add-list-btn');
  addListBtn.addEventListener('click', addList);
  for (const list of MODEL.getLists()) {
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
  addMemberEventListener();

  for (const member of MODEL.getMembers()) {
    createNewMember(member.name, member.id)
  }
}

// save changes on notes edit**
function saveChangesEditNote(e) {
  let modalElem = e.target.closest('.modal');
  modalElem.style.display = 'none';
  const cardTextarea = modalElem.querySelector('.card-textarea');
  // const cardUIElem = e.target.querySelector('.note-text-span');
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
  // update modal text to appData**
  const listInAppData = MODEL.findListInAppDataById(listId);

  const noteInAppData = MODEL.findNoteInListById(listInAppData, noteId);

  MODEL.updateNoteInAppdata(noteInAppData, cardTextarea.value)
// ***************
  // members checkbox

  const membersInputsElems = modalElem.querySelectorAll('input');
  const newMenbersOfNote = [];
  for (const member of membersInputsElems) {
    if (member.checked) {
      const newMemberId = member.getAttribute('member-id');
      newMenbersOfNote.push(newMemberId)
    }
  }
  // update members on appData****
  MODEL.updateMembersOfNote(noteInAppData, newMenbersOfNote);
// *********************
// in UI

  const labelDivElem = document.createElement('div');
  labelDivElem.setAttribute('class', 'lable-div');
  let memberName = '';
  for (let member of newMenbersOfNote) {

    // ************turning member id to member name
    memberName = MODEL.getMemberNameById(member);


    const labelElem = document.createElement('span');
    // get The first letter of each word
    let abbrev = memberName.split(' ');
    let nameholder = '';
    for (const part of abbrev) {
      let nameIn = [];
      nameIn = part[0];
      nameholder += nameIn;
    }

    labelElem.textContent = nameholder;
    labelElem.setAttribute('class', 'label member-name-label label-primary member-name-label');
    labelElem.setAttribute('title', memberName);

    labelDivElem.appendChild(labelElem);
  }

  const oldLabelDiv = noteElem.querySelector('.lable-div');

  oldLabelDiv.innerHTML = labelDivElem.innerHTML;


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
      // delete Note in appData******
      const containingList = MODEL.findListInAppDataById(listId);
      const noteToRemove = MODEL.findNoteInListById(containingList, checkedNoteId);
      MODEL.removeTaskFromAppData(containingList, noteToRemove);
// ***********************
    }
  })
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
  labelDivElem.setAttribute('class', 'lable-div');
  liNoteElem.appendChild(labelDivElem);

  if (noteInfo) {
    let memberName = '';
    for (let member of MODEL.getNoteInfoMembers(noteInfo)) {
      // ************turning member id to member name
      memberName = MODEL.getMemberNameById(member);

      const labelElem = document.createElement('span');
      // get The first letter of each word
      let abbrev = memberName.split(' ');
      let nameholder = '';
      for (const part of abbrev) {
        let nameIn = [];
        nameIn = part[0];
        nameholder += nameIn;
      }

      labelElem.textContent = nameholder;
      labelElem.setAttribute('class', 'label member-name-label label-primary member-name-label');
      labelElem.setAttribute('title', memberName);

      labelDivElem.appendChild(labelElem);
    }

  }
// Edit Modal***********************************
  editBtnElem.addEventListener('click', function (e) {

    const modalElem = document.querySelector('.modal ');
    const modalCardText = modalElem.querySelector('.card-textarea')
    modalElem.style.display = 'block';

    // fill modal with relevant content*********
    let noteElem = e.target.closest('.note');

    const noteToEditId = noteElem.getAttribute('data-id');
    const mainListId = noteElem.closest('.list-li').getAttribute('data-id');
    modalElem.setAttribute('note-id', noteToEditId);
    modalElem.setAttribute('list-id', mainListId);


    const listToEditInappData = MODEL.findListInAppDataById(mainListId);
    const noteToEditinappData = MODEL.findNoteInListById(listToEditInappData, noteToEditId);

    // Shows Note content from Appdata:
    modalCardText.value = MODEL.getNoteText(noteToEditinappData);

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
    })

    // find which members are in note
    const membersInThisNote = MODEL.getNoteMembers(noteToEditinappData);

    const membersList = modalElem.querySelectorAll('input');
    membersInThisNote.forEach((memberInList) => {
      membersList.forEach((inputOfmembers) => {
        const inputMemberId = inputOfmembers.getAttribute('member-id');
        if (inputMemberId === memberInList) {
          inputOfmembers.checked = true;
        }
      })
    })
  });


  editNoteListener(liNoteElem);
  notesUlElem.appendChild(liNoteElem);


  // add to appData************************************************************************************
  if (!noteInfo) {
    const listId = liNoteElem.closest('.list-li').getAttribute('data-id');
    MODEL.addNewNoteToAppData(listId, noteUuid)
  }
// ****

}


// end of modal stuff***************************

function addCardBtnListener(btnToListen) {

  btnToListen.addEventListener('click', function addCard(e) {

    const notesUlElem = (e.target.closest('.card').querySelector('.notes-ul'));
    addNoteWTextAndLabels(notesUlElem);
  })
}

const tampletLi = `
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
          </ul>
          <div class="panel-footer">
            <button class="add-note-btn">Add Note..</button>
          </div>
        </div>
      </div>
  `;

function addList(listData) {

  const mainUlList = document.querySelector('.card-list');
  const addListLI = document.querySelector('.add-list-li');
  const liListElem = document.createElement('li');

  liListElem.className = 'cards-li';
  liListElem.className = 'list-li';
  liListElem.innerHTML = tampletLi;


  if (listData.type !== 'click') {
// ******************When inserting JSON data**********************
    liListElem.setAttribute('data-id', listData.id);
    const cardTitle = liListElem.querySelector('.panel-title');
    const noteUl = liListElem.querySelector('.notes-ul');

    cardTitle.innerHTML = listData.title;


    for (const task of listData.tasks) {
      addNoteWTextAndLabels(noteUl, task)
    }

  } else {
    const id = uuid();
    liListElem.setAttribute('data-id', id);

    // add to appData******************************************************************************************
    const listToAddToAppData = {
      title: 'New list inserted',
      tasks: [],
      id: id
    };
    MODEL.addNewListToAppData(listToAddToAppData);
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
function editListTitleAndUpdateAppdata(h3Elem, inputElem) {
  const listLiId = h3Elem.closest('.list-li').getAttribute('data-id')
  h3Elem.textContent = inputElem.value;
  h3Elem.style.display = 'block';
  inputElem.style.display = 'none'

  // in appData********************************************************************
  const listToEdit = MODEL.findListInAppDataById(listLiId);
  MODEL.editListTitleInAppData(listToEdit, h3Elem);
}
// ************************************************
function inputListener(item) {
  const inputElem = item.querySelector('input');
  const h3Elem = item.querySelector('h3');

  // When title changed and ENTER pressed
  inputElem.addEventListener('keydown', function (event) {

    if (event.keyCode === 13) {
      if (inputElem.value === '') {
        inputElem.value = h3Elem.innerHTML;
      }
      console.info('1');
      editListTitleAndUpdateAppdata(h3Elem, inputElem);
    }
  })
  // When title changed and blur
  inputElem.addEventListener('blur', function () {
    if (inputElem.value === '') {
      inputElem.value = h3Elem.innerHTML;
    }

    console.info('2');
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
    const cardToDeleteLiElem = deleteLiElem.closest('.list-li');
    const cardToDeleteTitle = deleteLiElem.closest('.panel-heading').querySelector('.panel-title').innerHTML;
    const deleteAnswer = confirm('Deleting ' + cardToDeleteTitle + ' list. are you sure?');
    const ulHoldsDelete = deleteLiElem.closest(".dropdown-menu");
    const idToDel = cardToDeleteLiElem.getAttribute('data-id');

    if (deleteAnswer) {
      cardToDeleteLiElem.remove();
      // Remove from appData**********************************************************************

      const appDataElemToDelete = MODEL.findListInAppDataById(idToDel);

      MODEL.removeListFromAppData(appDataElemToDelete)
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

  noteElem.addEventListener('mouseover', function () {
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

// members section********************************************************************

const addMemberTamplet = `<span class="member-name"></span>
    <input type="email" class="form-control edit-member-input">
    <button type="button" class="btn btn-danger btn-to-show-on-hover delete-member-btn pull-right">Delete</button>
    <button type="button" class="btn btn-warning btn-to-show-on-hover edit-member-btn pull-right">Edit</button>
    <button type="button" class="btn btn-default edit-btns cancel-btn pull-right">Cancel</button>
    <button type="button" class="btn btn-success edit-btns save-btn pull-right">Save</button>`;

function createNewMember(member, id) {

  const membersListElem = document.querySelector('.members-list');
  const addMemberLiElem = document.querySelector('.add-member-li');
  const newMemberToAdd = document.createElement('li');

  newMemberToAdd.setAttribute('class', 'list-group-item member-li');
  newMemberToAdd.setAttribute('data-id', id);


  newMemberToAdd.innerHTML = addMemberTamplet;
  newMemberToAdd.querySelector('span').textContent = member;


  // Delete member
  const deleteMemberBtn = newMemberToAdd.querySelector('.delete-member-btn');
  deleteMemberBtn.addEventListener('click', function (e) {

    const ulMembersElem = e.target.closest('.members-list');
    const liMemberElem = e.target.closest('.member-li');
    ulMembersElem.removeChild(liMemberElem)


    const memberNameToDelete = (liMemberElem.querySelector('.member-name').innerHTML);

    function memberToDelete(member) {
      return member.name === memberNameToDelete;

    }

    // in appDate
    // ******************************************************************************************??????????????????
    const memberElemToRemove = MODEL.getMembers().find(memberToDelete);
    const indexOfToRemove = MODEL.getMembers().indexOf(memberElemToRemove);
    MODEL.deleteMemberFromAppData(indexOfToRemove);

    MODEL.removeMemberDeletedFromTasks(id);

  })
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
    // btnsToHide.forEach((btn) => {
    //   btn.classList.add('edit-mode-edit-delete');
    // })
    // cancelBtnElem.classList.add('edit-mode');
    // saveBtnElem.classList.add('edit-mode');

    for (const btn of btnsToHide) {
      btn.style.display = 'none';
    }
    for (const editB of editBtns) {
      editB.style.display = 'inline-block';
    }
    cancelBtnElem.style.display = 'inline-block';
    editMemberInputElem.value = memberNameSpan.innerHTML;
    editMemberInputElem.focus();
    editMemberInputElem.style.display = 'inline-block'
    memberNameSpan.style.display = 'none';

    // edit save Changes functionalty
    saveBtnElem.addEventListener('click', function () {
      const memberName = memberNameSpan.innerHTML;

      function memberToEdit(member) {
        return member.name === memberName;
      }

// in appData************************************************************************************
      const memberToEditInAppData = MODEL.getMembers().find(memberToEdit);
      MODEL.updateMemberNameInAppData(memberToEditInAppData, editMemberInputElem);

      if (editMemberInputElem.value === '') {
        editMemberInputElem.value = memberNameSpan.innerHTML;
        MODEL.updateMemberNameInAppData(memberToEditInAppData, editMemberInputElem);
      }
// ***************
      memberNameSpan.innerHTML = editMemberInputElem.value;
      memberNameSpan.style.display = 'inline-block';
      editMemberInputElem.style.display = 'none';

      btnsToHide.style.display = 'none';

    })


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

  })
  membersListElem.insertBefore(newMemberToAdd, addMemberLiElem);
}

function addMemberEventListener() {
  const addMemberBtn = document.querySelector('.add-member-btn');

  addMemberBtn.addEventListener('click', function (e) {
    const inputElem = e.target.closest('.form-group').querySelector('input');
    const newMemberName = inputElem.value;

    if (newMemberName !== '') {
      const id = uuid();
      createNewMember(newMemberName, id);
      inputElem.value = '';

      // in appData*********
      MODEL.addMemberToAppData(newMemberName, id)
    }
  })
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
  })
  const modalCloseBtn = modalElem.querySelector('.modal-close-btn');
  modalCloseBtn.addEventListener('click', function () {
    closeModal()
  })
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
    MODEL.setLists(listData.board)

    if (areJSONSHere()) {
      MODEL.setAppDataLocalStorage()
      createContentByHash()

    }
  }

  const data = new XMLHttpRequest();
  data.addEventListener("load", reqListener);
  data.open("GET", "assets/board-advanced.json");
  data.send();
}


// **************************************


function getMembersJSON() {

  let listMember = {};

  function reqListenerMembers() {
    listMember = JSON.parse(membersData.responseText);
   MODEL.setMembers(listMember.members);

    if (areJSONSHere()) {
      MODEL.setAppDataLocalStorage()
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

