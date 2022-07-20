// variables to store references to form element w id of user-form and input element w id of username
var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
var languageButtonsEl = document.querySelector('#language-buttons');

// function formSubmithandler, getting value of form <input> element and send to getUserRepos()
var formSubmitHandler = function (event) {
	event.preventDefault();

	// get value from input element
	var username = nameInputEl.value.trim();

	if (username) {
		getUserRepos(username);
		nameInputEl.value = "";
	} else {
		alert('Please enter a GitHub username');
	}

	console.log(event);
};

var buttonClickhandler = function (event) {
	// get language attribute from clicked element
	var language = event.target.getAttribute('data-language');

	if (language) {
		getFeaturedRepos(language);

		// clear old content
		repoContainerEl.textContent = '';
	}
};

// displayRepos() accept both repo data, and term searched for
var displayRepos = function (repos, searchTerm) {
	// check if api returned any repos
	if (repos.length === 0) {
		repoContainerEl.textContent = 'No repositories found';
		return;
	}

	repoContainerEl.textContent = '';
	repoSearchTerm.textContent = searchTerm;

	// loop over repos
	for (var i = 0; i < repos.length; i++) {
		// format repo name
		var repoName = repos[i].owner.login + '/' + repos[i].name;

		// create container for each repo
		var repoEl = document.createElement('a');
		repoEl.classList = 'list-item flex-row justify-space-between align-center';
		repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

		// create span element to hold repo name
		var titleEl = document.createElement('span');
		titleEl.textContent = repoName;

		// append to container
		repoEl.appendChild(titleEl);

		// create a status element
		var statusEl = document.createElement('span');
		statusEl.classList = 'flex-row align-center';

		// check if current repo has issues or not
		if (repos[i].open_issues_count > 0) {
			statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + 'issue(s)';
		} else {
			statusEl.innerHTML = "<i class='fas fa-regular fa-square-check status-icon icon-success></i>";
		}

		// append to container
		repoEl.appendChild(statusEl);

		// append container to dom
		repoContainerEl.appendChild(repoEl);
	}
};

var getUserRepos = function (user) {
	// format github api url
	var apiUrl = 'https://api.github.com/users/' + user + '/repos';

	// make request to url
	fetch(apiUrl)
		.then(function (response) {
			// request was successful
			if (response.ok) {
				response.json().then(function (data) {
					displayRepos(data, user);
				});
				// adding error handling
			} else {
				alert('Error: GitHub User not found');
			}
		})
		.catch(function (err) {
			// catch changed onto end of then method
			alert('Unable to connect to GitHub');
		});
};

var getFeaturedRepos = function (language) {
	var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

	fetch(apiUrl).then(function (response) {
		if (response.ok) {
			response.json().then(function (data) {
				displayRepos(data.items, language);
			});
		} else {
			alert('ERROR: GitHub user not found');
		}
	});
};


userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickhandler);