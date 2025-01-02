let data = [
  { id: 1, title: "randy", author: "rydan" },
  { id: 1, title: "andry", author: "daryn" },
];

//to read data
function readAll() {
    // Store data in localStorage
    localStorage.setItem("object", JSON.stringify(data));
    
    // Select the table body
    const tableBody = document.querySelector(".data_table"); // Assuming this is the table body
    
    // Retrieve and parse data from localStorage
    const object = localStorage.getItem("object");
    const objectdata = JSON.parse(object);
    
    let elements = ""; // Initialize as a mutable variable (let)
    
    // Iterate over objectdata to build table rows
    objectdata.forEach(record => {
        elements += `<tr>
            <td>${record.title}</td>
            <td>${record.author}</td>
        </tr>`;
    });
    
    // Insert rows into the table body
    if (tableBody) {
        tableBody.innerHTML = elements;
    } else {
        console.error("Table body not found!");
    }
}

function create() {
    document.querySelector(".create_form").style.display = "block";
    document.querySelector(".add_div").style.display = "none";

}

function add()