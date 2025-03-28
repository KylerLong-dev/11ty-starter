document.addEventListener("DOMContentLoaded", function () {
	// Create a CSS rule to style the safe area inset for both light and dark modes
	const safeAreaStyle = document.createElement('style');
	safeAreaStyle.innerHTML = `
		@supports (padding-top: env(safe-area-inset-top)) {
			body::before {
				content: '';
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				height: env(safe-area-inset-top);
				background-color: var(--background-color);
				z-index: 1001; /* Above the navigation */
				transition: background-color 0.3s ease;
			}
			
			body.dark-mode::before {
				background-color: var(--primary-darkmode);
			}
		}
	`;
	document.head.appendChild(safeAreaStyle);

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
  