// declaring common variable

const searchBtn = document.getElementById("book-search-btn");
const inputField = document.getElementById("book-input-field");
const parentOfItems = document.getElementById("books");

// fetching data by clicking searchBtn

searchBtn.addEventListener("click", () => {
	const bookName = inputField.value;
	customizeVisualization();
	fetch(`https://openlibrary.org/search.json?q=${bookName}`)
		.then((res) => res.json())
		.then((datum) => {
			const { numFound, docs } = datum; // destructuring object
			if (docs.length !== 0) showData(numFound, docs);
			else throw Error("Sorry, items weren't found");
		})
		.catch((err) => showError(err.message));
});

const customizeVisualization = () => {
	parentOfItems.textContent = "";
	inputField.value = "";
	updatingFoundAndShowed("00", "00");
	settingSpinner();
};

const showError = (message) => {
	parentOfItems.innerHTML = `
        <div class="d-flex error-container">
           <h4> ${message} </h4>
        </div>
   `;
};

const settingSpinner = () => {
	parentOfItems.innerHTML = `
    <div id="loading">
        <div class="d-flex loading-container">
                <span class="spinner-border spinner" role="status"></span>
                <b class=""> &nbsp; Please wait...</b>
                
        </div>
    </div>
    `;
};
const showData = (numFound, data) => {
	document.getElementById("loading").style.display = "none";
	// updating the number of  found and showed value
	updatingFoundAndShowed(numFound, data.length);
	data.forEach((currentData) => {
		// using forEach method to get data from Array
		const {
			// destructuring object of the Array
			title,
			author_name,
			first_publish_year: publish,
			cover_i,
		} = currentData;
		// a little bit error handling by ternary operator
		const name = `${title !== undefined ? title : "Not Found"}`;
		const author = `${author_name !== undefined ? author_name : "Not Found"}`;
		const published = `${publish !== undefined ? publish : "Not Found"}`;
		const img = () =>
			// arrow function to get correct source of image
			cover_i !== undefined
				? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
				: "";
		const div = document.createElement("div");
		div.classList.add("col-md-4");
		div.classList.add("col-sm-6");
		div.innerHTML = `
        <div class="p-3 book bg-white"> 
            <ul class="list-group">
                <img class="rounded" src="${img()}"/>
                <li class="list-group-item"> <b>Book Name</b> : ${name}</li>
                <li class="list-group-item"> <b>Author</b> : ${author}</li>
                <li class="list-group-item"> <b> First Published in</b> : ${published}</li>
            </ul>
        </div>
        `;
		parentOfItems.appendChild(div);
	});
};

const updatingFoundAndShowed = (found, showed) => {
	document.getElementById("found").innerText = found;
	document.getElementById("showed").innerText = showed;
};
