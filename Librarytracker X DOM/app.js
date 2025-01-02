// Step 1: Select/target DOM elements
const addBookButton = document.querySelector("#btn");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const clearButton = document.querySelector("#reset");
const bookList = document.querySelector("#book-list");

// console.log(addBookButton);
// console.log(titleInput);
// console.log(authorInput);
// console.log(clearButton);
// console.log(bookList);
addBookButton.addEventListener("click", addBook);
document.addEventListener("DOMContentLoaded", renderBooks);
bookList.addEventListener("click", borrowOrReturn);

function addBook(event) {
  event.preventDefault();

  const cleanInputTitle = titleInput.value.trim();
  const cleanInputAuthor = authorInput.value.trim();

  if (cleanInputTitle !== "" && cleanInputAuthor !== "") {
    // Save book information to local storage
    saveToLocalStorage(cleanInputTitle, cleanInputAuthor);
    const addDiv = document.createElement("div");
    //  to add a class tag/name on the created Element.
    addDiv.classList.add("add-div");

    const newList = document.createElement("li");
    newList.classList.add("add-list");
    // adding the content to the list.
    newList.textContent = `${cleanInputTitle} by ${cleanInputAuthor}`;
    addDiv.appendChild(newList);
    //add buttons to add on the list (borrowing and returning)
    const borrowButton = document.createElement("button");
    borrowButton.classList.add("borrow-btn");
    borrowButton.innerHTML = `Borrow <i class="fa-solid fa-file-import"></i>`;
    addDiv.appendChild(borrowButton);

    const returnButton = document.createElement("button");
    returnButton.classList.add("return-btn");
    returnButton.innerHTML = `Return <i class="fa-solid fa-person-walking-arrow-loop-left"></i>`;
    addDiv.appendChild(returnButton);

    //  // Append the addDiv to the newList.
    bookList.appendChild(addDiv);
    // remove input data on the box
    titleInput.value = "";
    authorInput.value = "";
  }
}
function getBooksFromLocalStorage() {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
}

function saveToLocalStorage(title, author) {
  const books = getBooksFromLocalStorage();
  const bookEntry = {
    title: title,
    author: author,
    status: "Available",
  };
  // console.log(bookEntry);
  // console.log(typeof bookEntry);
  books.push(bookEntry);

  const serializedBookArray = JSON.stringify(books);
  // console.log(typeof serializedBookArray);
  localStorage.setItem("books", serializedBookArray);
  //books (key) then the value (serialized)
}

function renderBooks() {
  const books = getBooksFromLocalStorage();
  books.forEach(function (book) {
    const addDiv = document.createElement("div");
    //  to add a class tag/name on the created Element.
    addDiv.classList.add("add-div");

    const newList = document.createElement("li");
    newList.classList.add("add-list");
    // adding the content to the list.
    newList.textContent = `${book.title} by ${book.author}`;
    addDiv.appendChild(newList);
    //add buttons to add on the list (borrowing and returning)

    const borrowButton = document.createElement("button");
    borrowButton.classList.add("borrow-btn");
    borrowButton.innerHTML = `Borrow <i class="fa-solid fa-file-import"></i>`;
    if (book.status === "Borrowed") {
      borrowButton.setAttribute("disabled", "true"); // Disable borrow button if already borrowed
    }
    addDiv.appendChild(borrowButton);

    const returnButton = document.createElement("button");
    returnButton.classList.add("return-btn");
    returnButton.innerHTML = `Return <i class="fa-solid fa-person-walking-arrow-loop-left"></i>`;
    addDiv.appendChild(returnButton);
    if (book.status != "Available") {
      addDiv.classList.add("borrowed");
    }

    //  // Append the addDiv to the newList.
    bookList.appendChild(addDiv);
  });
}

function borrowOrReturn(event) {
  const target = event.target.closest("button"); // Ensure the correct target is captured
  if (!target) return;

  const addDiv = target.parentElement;
  const bookEntryText = addDiv.querySelector(".add-list").textContent;

  // Extract only the title part (before " by ")
  const bookTitle = bookEntryText.split(" by ")[0].trim();

  if (target.classList.contains("borrow-btn")) {
    console.log("The user wants to mark the book as borrowed");
    addDiv.classList.add("borrowed"); // Add a class for borrowed status
    target.setAttribute("disabled", "true"); // Disable the borrow button
    updateLocalBookStatus(bookTitle, "Borrowed");
  }

  if (target.classList.contains("return-btn")) {
    console.log("The user wants to return the book");
    addDiv.classList.remove("borrowed"); // Remove the borrowed status
    const borrowButton = addDiv.querySelector(".borrow-btn");
    if (borrowButton) borrowButton.removeAttribute("disabled"); // Enable the borrow button
    updateLocalBookStatus(bookTitle, "Available");
  }
}

function updateLocalBookStatus(title, status) {
  const books = getBooksFromLocalStorage();
  const book = books.find((book) => book.title === title);

  if (book) {
    book.status = status; // Update the book's status correctly
    localStorage.setItem("books", JSON.stringify(books));
    console.log(
      `Updated status of "${title}" to "${status}" in local storage.`
    );
  } else {
    console.warn(`Book with title "${title}" not found in local storage.`);
  }
}
