document.addEventListener("DOMContentLoaded", function () {
	// helper functions to toggle dark mode
	function enableDarkMode() {
	  document.body.classList.add('dark-mode');
	  localStorage.setItem('theme', 'dark');
	}
  
	function disableDarkMode() {
	  document.body.classList.remove('dark-mode');
	  localStorage.setItem('theme', 'light');
	}
  
	// determines a new user's dark mode preferences
	function detectColourScheme() {
	  // default to the light theme
	  let theme = 'light';
  
	  // check the localstorage for a saved 'theme' variable
	  if (localStorage.getItem('theme')) {
		theme = localStorage.getItem('theme');
	  }
	  // if not, check for system dark mode preference
	  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		theme = 'dark';
	  }
  
	  // apply the appropriate theme
	  theme === 'dark' ? enableDarkMode() : disableDarkMode();
	}
  
	// run on page load
	detectColourScheme();
  
	// add event listener to the dark mode button toggle
	document.getElementById('dark-mode-toggle').addEventListener('click', () => {
	  localStorage.getItem('theme') === 'light' ? enableDarkMode() : disableDarkMode();
	});
  });
  