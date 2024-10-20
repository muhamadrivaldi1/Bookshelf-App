const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

// Load books from localStorage on page load
window.addEventListener('load', () => {
  if (isStorageExist()) {
    loadBooksFromStorage();
  }
});

// Check if localStorage is available
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser tidak mendukung localStorage');
    return false;
  }
  return true;
}

// Save books to localStorage
function saveBooks() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

// Load books from localStorage
function loadBooksFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);
  if (data !== null) {
    books = data;
  }
  renderBooks();
}

// Handle form submission for adding or editing books
document.getElementById('bookForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  addBook(title, author, year, isComplete);

  document.getElementById('bookForm').reset();
  document.querySelector('#bookFormSubmit span').textContent = 'Belum selesai dibaca';
});

// Add a new book to the array and localStorage
function addBook(title, author, year, isComplete) {
  const id = generateId();
  const bookObject = createBookObject(id, title, author, year, isComplete);
  books.push(bookObject);
  saveBooks();
  renderBooks();
}

// Generate a unique ID for each book
function generateId() {
  return +new Date();
}

// Create a book object
function createBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

// Render the books to the respective shelves
function renderBooks() {
  const incompleteBookshelfList = document.getElementById('incompleteBookList');
  const completeBookshelfList = document.getElementById('completeBookList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookElement);
    } else {
      incompleteBookshelfList.appendChild(bookElement);
    }
  }
}

// Create the DOM element for a book
function createBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', function () {
    toggleBookComplete(book.id);
  });
  bookItem.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', function () {
    deleteBook(book.id);
  });
  bookItem.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', function () {
    editBook(book.id);
  });

  return bookItem;
}

// Toggle the completion status of a book
function toggleBookComplete(bookId) {
  const book = findBook(bookId);
  if (book == null) return;
  book.isComplete = !book.isComplete;
  saveBooks();
  renderBooks();
}

// Delete a book
function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;
  books.splice(bookIndex, 1);
  saveBooks();
  renderBooks();
}

// Edit a book by loading its data into the form
function editBook(bookId) {
  const book = findBook(bookId);
  if (book == null) return;

  document.getElementById('bookFormTitle').value = book.title;
  document.getElementById('bookFormAuthor').value = book.author;
  document.getElementById('bookFormYear').value = book.year;
  document.getElementById('bookFormIsComplete').checked = book.isComplete;

  document.querySelector('#bookFormSubmit span').textContent = book.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca';
}

// Find a book by ID
function findBook(bookId) {
  return books.find(book => book.id === Number(bookId));
}

// Find the index of a book in the array
function findBookIndex(bookId) {
  return books.findIndex(book => book.id === Number(bookId));
}

// Event listener untuk form pencarian
document.getElementById('searchBook').addEventListener('submit', function(event) {
  event.preventDefault();
  const searchQuery = document.getElementById('searchBookTitle').value.toLowerCase();
  searchBooks(searchQuery);
});

// Fungsi untuk mencari buku berdasarkan judul
function searchBooks(query) {
  const incompleteBookshelfList = document.getElementById('incompleteBookList');
  const completeBookshelfList = document.getElementById('completeBookList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  // Filter buku yang judulnya mengandung query pencarian
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));

  if (filteredBooks.length === 0) {
    // Jika tidak ada hasil, tambahkan pesan
    incompleteBookshelfList.innerHTML = `<p data-testid="noBooksFound">Buku tidak ditemukan.</p>`;
    completeBookshelfList.innerHTML = `<p data-testid="noBooksFound">Buku tidak ditemukan.</p>`;
  } else {
    for (const book of filteredBooks) {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookElement);
      } else {
        incompleteBookshelfList.appendChild(bookElement);
      }
    }
  }
}

