/**
 * Created by Adi on 3/19/2017.
 */
function getMembers() {
  return appData.members;
}

function getLists() {
  return appData.lists
}

function getTasksInList(listElem) {
  return listElem.tasks;
}

