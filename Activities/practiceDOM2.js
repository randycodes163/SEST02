const library = [];

// Display Available Books
function displayAvailableBooks() {
  const availableBooks = library.filter((book) => book.isAvailable);

  const resultDiv = document.querySelector("#result");
  resultDiv.innerHTML = "<h2>Available Books:</h2>";

  if (availableBooks.length === 0) {
    resultDiv.innerHTML += "<p>No books available.</p>";
    return;
  }

  availableBooks.forEach((book) => {
    resultDiv.innerHTML += `<p>Title: ${book.title} | Author: ${book.author}</p>`;
  });
}

// Borrow a Book
function BorrowBook(title) {
  const book = library.find((book) => book.title === title.trim());
  const resultDiv = document.querySelector("#result");

  if (book) {
    if (book.isAvailable) {
      book.isAvailable = false;
      resultDiv.innerHTML = `<p>The book "${book.title}" has been borrowed.</p>`;
    } else {
      resultDiv.innerHTML = `<p>The book "${book.title}" is not available.</p>`;
    }
  } else {
    resultDiv.innerHTML = `<p>The book "${title}" was not found in the library.</p>`;
  }
}

// Return a Book
function ReturnBook(title) {
  const book = library.find((book) => book.title === title.trim());
  const resultDiv = document.querySelector("#result");

  if (book) {
    if (!book.isAvailable) {
      book.isAvailable = true;
      resultDiv.innerHTML = `<p>The book "${book.title}" has been returned and is now available.</p>`;
    } else {
      resultDiv.innerHTML = `<p>The book "${book.title}" was not borrowed, so it cannot be returned.</p>`;
    }
  } else {
    resultDiv.innerHTML = `<p>The book "${title}" was not found in the library.</p>`;
  }
}

// Add Event Listeners for Buttons
document
  .querySelector("#displayBooksButton")
  .addEventListener("click", displayAvailableBooks);

document.querySelector("#borrowBookButton").addEventListener("click", () => {
  const title = document.querySelector("#bookTitle").value;
  if (title.trim() === "") {
    document.querySelector("#result").innerHTML =
      "<p>Please enter a book title.</p>";
    return;
  }
  BorrowBook(title);
  document.querySelector("#bookTitle").value = ""; // Clear the input field
});

document.querySelector("#returnBookButton").addEventListener("click", () => {
  const title = document.querySelector("#bookTitle").value;
  if (title.trim() === "") {
    document.querySelector("#result").innerHTML =
      "<p>Please enter a book title.</p>";
    return;
  }
  ReturnBook(title);
  document.querySelector("#bookTitle").value = ""; // Clear the input field
});

function addBookToLibrary() {
  const titleInput = document.querySelector("#newBookTitle");
  const authorInput = document.querySelector("#newBookAuthor");

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (title === "" || author === "") {
    alert("Please provide both title and author.");
    return;
  }
  // Add the book to the library array
  const newBook = { title, author, isAvailable: true };
  library.push(newBook);

  // Dynamically create and display the new book
  const resultDiv = document.querySelector("#result");
  const bookElement = document.createElement("p");
  bookElement.textContent = `Title: ${newBook.title} | Author: ${newBook.author}`;
  resultDiv.appendChild(bookElement);

  // Clear input fields
  titleInput.value = "";
  authorInput.value = "";

  alert(`Book "${newBook.title}" added successfully!`);
}

// Add event listener to the Add Book button
document
  .querySelector("#addBookButton")
  .addEventListener("click", addBookToLibrary);
