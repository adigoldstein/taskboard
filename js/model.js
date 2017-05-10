const MODEL = (function () {
// privet
  let appData = {
    lists: [],
    members: []
  };
  // public
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
    setAppDataLocalStorage()

  }
  function updateMembersOfNote(noteInAppData, newMenbersOfNote) {
    noteInAppData.members = newMenbersOfNote;
    setAppDataLocalStorage()

  }

  function getMemberNameById(member) {
    let memberName = '';
    for (const membersData of  getMembers()) {
      if (membersData.id === member) {
        memberName = membersData.name;
      }
    }
    return memberName
  }
  function removeTaskFromAppData(containingList, noteToRemove) {
    const indexToRemove = containingList.tasks.indexOf(noteToRemove);
    containingList.tasks.splice(indexToRemove, 1);
    setAppDataLocalStorage()

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

  function addNewNoteToAppData(listId, noteUuid) {
    for (const list of getLists()) {
      if (list.id === listId) {
        list.tasks.push({
          members: [],
          text: 'New note created...',
          id: noteUuid
        })
      }
    }
    setAppDataLocalStorage()
  }

  function addNoteToAppData(listId, note) {
    for (const list of getLists()) {
      if (list.id === listId) {
        list.tasks.push({
          members: note.members,
          text: note.text,
          id: note.id
        })
      }
    }
    setAppDataLocalStorage()
  }

  function addNewListToAppData(listToAddToAppData) {
    getLists().push(listToAddToAppData);
    setAppDataLocalStorage()
  }

  function editListTitleInAppData(listToEdit, h3Elem) {
    listToEdit.title = h3Elem.innerHTML;
    setAppDataLocalStorage()

  }
  function removeListFromAppData(appDataElemToDelete) {
    const indexToDelete = getLists().indexOf(appDataElemToDelete);
    getLists().splice(indexToDelete, 1);
    setAppDataLocalStorage()

  }

  function deleteMemberFromAppData(indexOfToRemove) {
    getMembers().splice(indexOfToRemove, 1);
    setAppDataLocalStorage()


  }
  function removeMemberDeletedFromTasks(id) {
    for (const list of getLists()) {
      for (const task of getTasksInList(list)){
        task.members.forEach((memberIdInTasks) => {
          if (memberIdInTasks === id) {
            const indexToRemove = task.members.indexOf(memberIdInTasks);
            task.members.splice(indexToRemove, 1);
          }
        })
      }
    }
    setAppDataLocalStorage()

  }

  function updateMemberNameInAppData(memberToEditInAppData, editMemberInputElem) {
    memberToEditInAppData.name = editMemberInputElem.value;
    setAppDataLocalStorage()

  }

  function addMemberToAppData(newMemberName, id) {
    getMembers().push({name: newMemberName, id: id});
    setAppDataLocalStorage()

  }
  function setLists(listData) {
    appData.lists = listData;
    setAppDataLocalStorage()
  }

  function setMembers(listMember) {
    appData.members = listMember;
    setAppDataLocalStorage()
  }

  function bringAppDataFromLocalStorage() {
    const appDataFromLocalStorage = localStorage.getItem('appData');
    appData = JSON.parse(appDataFromLocalStorage);
  }

  function setAppDataLocalStorage() {
    localStorage.setItem('appData', JSON.stringify(appData));
  }


return {
  getMembers,
  getLists,
  getTasksInList,
  findListInAppDataById,
  findNoteInListById,
  updateNoteInAppdata,
  updateMembersOfNote,
  getMemberNameById,
  removeTaskFromAppData,
  getNoteInfoMembers,
  getNoteText,
  getNoteMembers,
  addNewNoteToAppData,
  addNoteToAppData,
  addNewListToAppData,
  editListTitleInAppData,
  removeListFromAppData,
  deleteMemberFromAppData,
  removeMemberDeletedFromTasks,
  updateMemberNameInAppData,
  addMemberToAppData,
  setLists,
  setMembers,
  bringAppDataFromLocalStorage,
  setAppDataLocalStorage
}
})();
