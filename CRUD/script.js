//CRUD - Create, Read, Update, Delete

function Submit() {
  let dataEntered = retrieveData();
  // console.log(dataEntered) --- to check if the data was return
  let readData = readingDataFromLocalStorage(dataEntered);
  //   console.log(readData); -- to check if data was retrive
  insert(readData);
}
// CREATE
//  -- Retrieving data from Form--
function retrieveData() {
  let title1 = document.querySelector("#title").value;
  let author1 = document.querySelector("#author").value;

  let arr = [title1, author1];
  return arr;
}
// READ
// -- Data in Local Storage
function readingDataFromLocalStorage(dataEntered) {
  // -- Storing data in Local Storage
  let a = localStorage.setItem("Title", dataEntered[0]);
  let b = localStorage.setItem("Author", dataEntered[1]);

  // -- Get data in local storage and put in the table
  let a1 = localStorage.getItem("Title", a);
  let b1 = localStorage.getItem("Author", b);

  let arr = [a1, b1];
  return arr;
}
// INSERT
// function insert(readData) {
//   let row = table.insertRow();
//   let cell1 = row.insertCell(0);
//   let cell2 = row.insertCell(1);

//     cell1.innerHTML = readData[0];
//     cell2.innerHTML = readData[1];
  
// }
// -- shorten the code but same result
function insert(readData) {
    let row = table.insertRow();
    row.insertCell(0).innerHTML = readData[0];
    row.insertCell(1).innerHTML = readData[1];
    row.insertCell(2).innerHTML = `<button onclick = borrow(this)>Borrow</button><button onclick = return(this)>Return</button>`
}

