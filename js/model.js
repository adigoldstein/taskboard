
function getMembers() {
  return appData.members;
}

function getLists() {
  return appData.lists
}

function getTasksInList(listElem) {
  return listElem.tasks;
}


function findListInAppDataById(listId) {
  const listInAppData = getLists().find((list) => {
    return list.id === listId;
  });
  return listInAppData;
}

function findNoteInListById(listInAppData, noteId) {
  const noteInAppData = getTasksInList(listInAppData).find((task) => {
    return task.id === noteId;
  });
  return noteInAppData
}

function updateNoteInAppdata(noteInAppData, cardText) {
  noteInAppData.text = cardText;
  localStorage.setItem('appData',JSON.stringify(appData) );

}
function updateMembersOfNote(noteInAppData,newMenbersOfNote) {
  noteInAppData.members = newMenbersOfNote;
  localStorage.setItem('appData',JSON.stringify(appData) );

}

function getMemberNameById(member) {
  let memberName ='';
  for (const membersData of  getMembers()) {
    if (membersData.id === member) {
       memberName = membersData.name;
    }
  }
  return memberName
}
function removeTaskFromAppData(containingList,noteToRemove) {
  const indexToRemove = containingList.tasks.indexOf(noteToRemove);
  containingList.tasks.splice(indexToRemove, 1);
  localStorage.setItem('appData',JSON.stringify(appData) );

}
function getNoteInfoMembers(noteinfo) {
  return noteinfo.members;
}

function getNoteText(noteToEditinappData) {
  return noteToEditinappData.text
}
function getNoteMembers(noteToEditinappData) {
  return noteToEditinappData.members
}

function addNewNoteToAppData(listId,noteUuid) {
  for (const list of getLists()) {
    if (list.id === listId) {
      list.tasks.push({
        members: [],
        text: 'New note created...',
        id: noteUuid
      })
    }
  }
  localStorage.setItem('appData',JSON.stringify(appData) );

}

function addNewListToAppData(listToAddToAppData) {
getLists().push(listToAddToAppData);
  localStorage.setItem('appData',JSON.stringify(appData) );
}

function editListTitleInAppData(listToEdit,h3Elem) {
  listToEdit.title = h3Elem.innerHTML;
  localStorage.setItem('appData',JSON.stringify(appData) );

}
function removeListFromAppData(appDataElemToDelete) {
  const indexToDelete = getLists().indexOf(appDataElemToDelete);
  getLists().splice(indexToDelete, 1);
  localStorage.setItem('appData',JSON.stringify(appData) );

}

function deleteMemberFromAppData(indexOfToRemove) {
  getMembers().splice(indexOfToRemove, 1);
  localStorage.setItem('appData',JSON.stringify(appData) );


}
function removeMemberDeletedFromTasks(id) {
  getLists().forEach((list) => {
    getTasksInList(list).forEach((task) => {
      task.members.forEach((memberIdInTasks) => {
        if (memberIdInTasks === id) {
          const indexToRemove = task.members.indexOf(memberIdInTasks);
          task.members.splice(indexToRemove, 1);
        }
      })
    })
  })
  localStorage.setItem('appData',JSON.stringify(appData) );

}

function updateMemberNameInAppData(memberToEditInAppData,editMemberInputElem) {
  memberToEditInAppData.name = editMemberInputElem.value;
  localStorage.setItem('appData',JSON.stringify(appData) );

}

function addMemberToAppData(newMemberName,id) {
  getMembers().push({name: newMemberName, id: id});
  localStorage.setItem('appData',JSON.stringify(appData) );

}



