const appData = {
  lists: [],
  members: []
};
// uuid random id example:
// console.info(uuid());


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
  addMemberEventListener();

  for (const member of appData.members) {
    console.info(member.id);
    createNewMember(member.name, member.id)
  }
}

// save changes on notes edit**
function saveChangesEditNote(e) {
// console.info(e.target);
  const modalElem = e.target.closest('.modal');
  // console.info(modalElem);
  modalElem.style.display = 'none'
  const cardTextarea = modalElem.querySelector('.card-textarea');
  const cardUIElem = e.target.querySelector('.note-text-span');
  console.info(cardUIElem);
  console.info(cardTextarea.value);
  const noteId = modalElem.getAttribute('note-id');
  const listId = modalElem.getAttribute('list-id');
  console.info(noteId, ' noteid');
  const listsappData = appData.lists;
  const listElemToEdit = listsappData.find((each) => {
    // console.info(each);
    return each.id === listId;
  })
  console.info(listElemToEdit, 'list element');
  const noteElemToEdit = listElemToEdit.tasks.find((each) => {
    // console.info(each);
    return each.id === noteId;
  })
console.info(noteElemToEdit);
  const allNotesElems = document.querySelectorAll('.note');
  console.info(allNotesElems);
  let noteElem = '';
  allNotesElems.forEach(function (note) {
    console.info(note);
    const checkedNoteId = note.getAttribute('data-id');
    console.info(checkedNoteId);
    if (checkedNoteId === noteId) {
      note.querySelector('.note-text-span').innerHTML = cardTextarea.value;
      noteElem = note;
    }
  })
  // console.info(noteElemToEdit);
  noteElemToEdit.text = cardTextarea.value;
  // console.info(noteElemToEdit);

  // members checkbox

  // in appdata
  const membersInputsElems = modalElem.querySelectorAll('input');
  const newMenbersOfNote = [];
  for (const member of membersInputsElems) {
    if (member.checked) {
      const newMemberId = member.getAttribute('member-id')
      newMenbersOfNote.push(newMemberId)
    }
  }
console.info(newMenbersOfNote);
  noteElemToEdit.members = newMenbersOfNote;

// in UI

  const labelDivElem = document.createElement('div');
  labelDivElem.setAttribute('class', 'lable-div');
  let memberName = '';
  for (let member of newMenbersOfNote) {

    // ************turning member id to member name
    for (const membersData of  appData.members) {
      // console.info(membersData.id);
      if (membersData.id === member) {
        memberName = membersData.name;
      }
    }
// console.info(memberName);


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
    labelElem.setAttribute('class', 'label member-name-label label-primary member-name-label pull-right');
    labelElem.setAttribute('title', memberName);

    labelDivElem.appendChild(labelElem);
  }
  console.info(noteElem);
  const oldLabelDiv = noteElem.querySelector('.lable-div');
  console.info(oldLabelDiv);
  console.info(labelDivElem);
  oldLabelDiv.innerHTML = labelDivElem.innerHTML;




}
function deleteNoteHandler(e) {
  const modalElem = e.target.closest('.modal');
  // console.info(modalElem);
  modalElem.style.display = 'none';
  const noteId = modalElem.getAttribute('note-id');
  // console.info(noteId);
  const allNotesElems = document.querySelectorAll('.note');
  console.info(allNotzesElems);
  allNotesElems.forEach(function (note) {
    // console.info(note);
    const checkedNoteId = note.getAttribute('data-id');
    if (checkedNoteId === noteId) {
      note.remove();

      // in appData
      const listId = modalElem.getAttribute('list-id');
      // console.info(listId);
      console.info(appData.lists);

      const containingList = appData.lists.find((obj) => {
        return obj.id === listId;
      })
      console.info(containingList);
      const noteToRemove = containingList.tasks.find((note) => {
        return noteId === note.id;
      });
      console.info(noteToRemove);
      const indexToRemove = containingList.tasks.indexOf(noteToRemove);
      containingList.tasks.splice(indexToRemove, 1);

    }
  })
}

function addNoteWTextAndLabels(notesUlElem, noteInfo) {
  // console.info(noteInfo.id);
  const liNoteElem = document.createElement('li');
  liNoteElem.className = 'note';


  const editBtnElem = document.createElement('button');
  editBtnElem.setAttribute('type', 'button');
  editBtnElem.setAttribute('class', 'btn btn-primary btn-xs note-edit-btn pull-right');
  editBtnElem.textContent = 'Edit';

  const noteTextSpan = document.createElement('span');
  noteTextSpan.setAttribute('class', 'note-text-span');
  let noteText = '';
  if (!noteInfo) {
    noteTextSpan.textContent = 'New note created...'
    liNoteElem.setAttribute('data-id', uuid());


  } else {
    noteTextSpan.textContent = noteInfo.text
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
    for (let member of noteInfo.members) {
      // console.info(member);
      // console.info(appData.members);

      // ************turning member id to member name
      for (const membersData of  appData.members) {
        // console.info(membersData.id);
        if (membersData.id === member) {
          memberName = membersData.name;
        }
      }
// console.info(memberName);


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
      labelElem.setAttribute('class', 'label member-name-label label-primary member-name-label pull-right');
      labelElem.setAttribute('title', memberName);

      labelDivElem.appendChild(labelElem);
    }

  } else {
    // add to appData
    console.info(liNoteElem);
    const listTitleText = notesUlElem.closest('.panel').querySelector('.panel-title').innerHTML;
    console.info(appData.lists);
    let listElemToAddNote = {};
    for (const obj of appData.lists) {
      if (obj.title === listTitleText) {
        console.info(obj.tasks);
        obj.tasks.push({
          members: [],
          text: 'New note created...'
        })
        console.info(obj.tasks);

      }
    }

  }
// Edit Modal***********************************
  editBtnElem.addEventListener('click', function (e) {

    const modalElem = document.querySelector('.modal ');
    console.info(modalElem);
    const modalCardText = modalElem.querySelector('.card-textarea')
    console.info(modalCardText);
    modalElem.style.display = 'block';

    // fill modal with relevant content*********
    let noteElem = e.target.closest('.note');
    console.info(noteElem);

    const noteToEditId = noteElem.getAttribute('data-id');
    console.info('note id', noteToEditId);
    // console.info(listsappData);
    const mainListId = noteElem.closest('.list-li').getAttribute('data-id');
    console.info('list id', mainListId);
    modalElem.setAttribute('note-id', noteToEditId);
    modalElem.setAttribute('list-id', mainListId);

    const listsappData = appData.lists;
    const listElemToEditInappData = listsappData.find((each) => {
      // console.info(each);
      return each.id === mainListId;
    })
    // console.info(listElemToEditInappData.tasks);
    const noteElemToEditinappData = listElemToEditInappData.tasks.find((each) => {
      // console.info(each);

      return each.id === noteToEditId;
    })
    // console.info(noteElemToEditinappData);

    // Shows Note content from Appdata:
    modalCardText.innerHTML = noteElemToEditinappData.text;

// fill members
    const memberListHolder = document.querySelector('.members-checkbox');
    console.info(memberListHolder);
    memberListHolder.innerHTML = '';
    console.info(appData.members);
    appData.members.forEach((member) => {
      const memberId = member.id;
      const memberName = member.name;
      console.info(memberName, memberId);
      const memElm = document.createElement('label');
      memElm.innerHTML = `<input type="checkbox" value=""><span class="member-name-span"></span>`;
      // console.info(memElm);
      memberListHolder.appendChild(memElm);
      const nameSpanElem = memElm.querySelector('.member-name-span');
      nameSpanElem.innerHTML = memberName;
      const inputElem = memElm.querySelector('input');
      console.info(inputElem);
      inputElem.setAttribute('member-id', memberId);



    })
    // find which members are in note
    const membersInThisNote = noteElemToEditinappData.members;
    console.info(membersInThisNote);

    const membersList = modalElem.querySelectorAll('input');
    membersInThisNote.forEach((memberInList) => {
      membersList.forEach((inputOfmembers) => {
        const inputMemberId = inputOfmembers.getAttribute('member-id');
        // console.info(inputMemberId);
        // console.info(memberInList);
        if (inputMemberId === memberInList) {
          inputOfmembers.checked = true ;
        }

      })
    })


  });


  editNoteListener(liNoteElem);
  notesUlElem.appendChild(liNoteElem);


}


// end of modal stuff***************************

function addCardBtnListener(btnToListen) {

  btnToListen.addEventListener('click', function addCard(e) {

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
  `;

function addList(listData) {
  // console.info(listData);

  const mainUlList = document.querySelector('.card-list');
  const addListLI = document.querySelector('.add-list-li');
  const liListElem = document.createElement('li');

  liListElem.className = 'cards-li';
  liListElem.className = 'list-li';
  liListElem.innerHTML = tampletLi;


// console.info(listData);
  if (listData.type !== 'click') {
// ******************When inserting JSON data**********************
//     console.info(listData)
    liListElem.setAttribute('data-id', listData.id);
    const cardTitle = liListElem.querySelector('.panel-title');
    const noteUl = liListElem.querySelector('.notes-ul');
    // console.info(noteUl);
    cardTitle.innerHTML = listData.title;


    for (const task of listData.tasks) {
      // console.info(task);
      addNoteWTextAndLabels(noteUl, task)
    }

  } else {
    const id = uuid();
    console.info(id);
    liListElem.setAttribute('data-id', id);

    // add to appData
    // console.info(appData.lists);
    const listToAddToAppData = {
      title: 'New list inserted',
      tasks: [],
      id: id

    }
    // console.info(listToAddToAppData);
    appData.lists.push(listToAddToAppData);
    // console.info(appData.lists);
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
  console.info(h3Elem);
  const listLiId = h3Elem.closest('.list-li').getAttribute('data-id')
  console.info(listLiId);
  const oldTitle = h3Elem.textContent;
  console.info(oldTitle);
  console.info();
  h3Elem.textContent = inputElem.value;
  h3Elem.style.display = 'block';
  inputElem.style.display = 'none'
  console.info(h3Elem);
  console.info(appData.lists);
  const listToEdit = appData.lists.find((each) => {
    return each.id === listLiId;
  })
  listToEdit.title = h3Elem.innerHTML;
  console.info(appData.lists);
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

  // // appData list title edit
  // const originalTitleToEdit = h3Elem.innerHTML;
  // console.info(originalTitleToEdit);
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
// function dropdwonListener() {
//   const dropdownElems = document.querySelectorAll('.dropdown');
//   console.info(dropdownElems);
//   for (const dd of dropdownElems) {
//     toggleMenu(dd);
//     {
//
//     }
//   }
// }
//
// dropdwonListener()


function deleteCardListener(deleteLiElem) {

  deleteLiElem.addEventListener('click', function () {
    const cardToDeleteLiElem = deleteLiElem.closest('.list-li');
    const cardToDeleteTitle = deleteLiElem.closest('.panel-heading').querySelector('.panel-title').innerHTML;
    const deleteAnswer = confirm('Deleting ' + cardToDeleteTitle + ' list. are you sure?');
    const ulHoldsDelete = deleteLiElem.closest(".dropdown-menu");
    const idToDel = cardToDeleteLiElem.getAttribute('data-id');
    if (deleteAnswer) {
      cardToDeleteLiElem.remove();
      // Remove from appData

      const appDataElemToDelete = appData.lists.find((list) => {
        console.info(list);
        return list.id === idToDel;
      });
      console.info(appDataElemToDelete);
      const indexToDelete = appData.lists.indexOf(appDataElemToDelete);
      appData.lists.splice(indexToDelete, 1);
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
  // console.info(deleteMemberBtn);
  deleteMemberBtn.addEventListener('click', function (e) {

    const ulMembersElem = e.target.closest('.members-list');
    const liMemberElem = e.target.closest('.member-li');
    ulMembersElem.removeChild(liMemberElem)

    // in appDate
    // ****************************************
    // console.info(appData.members);
    const memberNameToDelete = (liMemberElem.querySelector('.member-name').innerHTML);

    function memberToDelete(member) {
      return member.name === memberNameToDelete;
    }

    const memberElemToRemove = appData.members.find(memberToDelete);
    const indexOfToRemove = appData.members.indexOf(memberElemToRemove);
    appData.members.splice(indexOfToRemove, 1);

    

  })
  // edit member
  const editMemberBtn = newMemberToAdd.querySelector('.edit-member-btn');
  editMemberBtn.addEventListener('click', function (e) {


    const liMemberElem = e.target.closest('.member-li');
    const memberNameSpan = liMemberElem.querySelector('.member-name');
    const editMemberInputElem = liMemberElem.querySelector('.edit-member-input');
    const btnsToHide = liMemberElem.querySelectorAll('.btn-to-show-on-hover');
    const editBtns = liMemberElem.querySelectorAll('.edit-btns')
    const cancelBtnElem = liMemberElem.querySelector('.cancel-btn');
    const saveBtnElem = liMemberElem.querySelector('.save-btn');

    for (const btn of btnsToHide) {
      btn.style.display = 'none';
    }
    for (const editB of editBtns) {
      editB.style.display = 'inline-block';
    }
    cancelBtnElem.style.display = 'inline-block';
    editMemberInputElem.value = memberNameSpan.innerHTML;
    editMemberInputElem.style.display = 'inline-block';
    editMemberInputElem.focus();
    memberNameSpan.style.display = 'none';

    // edit save Changes functionalty
    saveBtnElem.addEventListener('click', function () {
      const memberName = memberNameSpan.innerHTML;

      function memberToEdit(member) {
        return member.name === memberName;
      }

      const memberElemToEdit = appData.members.find(memberToEdit);
      memberElemToEdit['name'] = editMemberInputElem.value;
      console.info(appData.members);

      if (editMemberInputElem.value === '') {
        editMemberInputElem.value = memberNameSpan.innerHTML;

      }

      // console.info(editMemberInputElem.value, memberNameSpan);
      memberNameSpan.innerHTML = editMemberInputElem.value
      memberNameSpan.style.display = 'inline-block';
      editMemberInputElem.style.display = 'none';


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

// console.info(addMemberBtn);
function addMemberEventListener() {
  const addMemberBtn = document.querySelector('.add-member-btn');

  addMemberBtn.addEventListener('click', function (e) {
    const inputElem = e.target.closest('.form-group').querySelector('input');
    const newMemberName = inputElem.value;

    if (newMemberName !== '') {
      const id = uuid();
      createNewMember(newMemberName, id);
      inputElem.value = '';

      // in appData
      appData.members.push({name: newMemberName, id: id});
    }


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
// console.info(modalCloseBtn);
  modalCloseBtn.addEventListener('click', function () {
    closeModal()
  })
  const saveBtn = modalElem.querySelector('.modal-save-changed');
// console.info(saveBtn);
  saveBtn.addEventListener('click', saveChangesEditNote);

  const deleteNoteElem = document.querySelector('.del-note-btn');
  deleteNoteElem.addEventListener('click', deleteNoteHandler)

}


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
  data.open("GET", "assets/board-advanced.json");
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

getBoardJSON();
getMembersJSON();
modalInit()
