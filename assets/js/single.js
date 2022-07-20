// reference to issue container
var issueContainerEl = document.querySelector('#issues-container');

// does most of the work on single-repo.html page
var getRepoIssues = function (repo) {
	var apiUrl = 'https://api.github.com/repos/' + repo + '/issues?direction=asc';

	fetch(apiUrl).then(function (response) {
		// request was successful
		if (response.ok) {
			response.json().then(function (data) {
				displayIssues(data);
			});
		}
		else {
			alert('There was a problem with your request!');
		}
	});
};

// turning github issue data into DOM elements
var displayIssues = function (issues) {
	// if repo has no open issues
	if (issues.length === 0) {
		issueContainerEl.textContent = 'This repo has no open issues!';
		return;
	}

	for (var i = 0; i < issues.length; i++) {
		// create link element to take users to issue on github
		var issueEl = document.createElement('a');
		issueEl.classList = 'list-item flex-row justify-space-between align-center';
		// html url linking to full issue on GitHub
		issueEl.setAttribute('href', issues[i].html_url);
		issueEl.setAttribute('target', '_blank');

		// create span to hold issue title
		var titleEl = document.createElement('span');
		titleEl.textContent = issues[i].title;

		// append to container
		issueEl.appendChild(titleEl);

		// create type element
		var typeEl = document.createElement('span');

		// check if issue is an actual issue or pull request
		if (issues[i].pull_request) {
			typeEl.textContent = '(Pull Request)';
		} else {
			typeEl.textContent = '(Issue)';
		}

		// append to container
		issueEl.appendChild(typeEl);

		issueContainerEl.appendChild(issueEl);
	}
};

getRepoIssues('tydomx/git-it-donev2');