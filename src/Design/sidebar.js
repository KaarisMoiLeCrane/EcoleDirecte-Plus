(() => {
  // Importing the necessary utility function for creating DOM fragments from strings
  const fragmentFromString = imports('fragmentFromString').from('./utils/utils.js');

  /**
   * Function to load CSS stylesheets for the sidebar if not already loaded
   */
  function loadCSS() {
    // Load external CSS for boxicons
    if (!document.getElementById('kmlc_css_1')) {
      if (debug)
        console.log('[DEBUG] loadCSS', 'CSS Load', 'Loading external boxicons CSS', {
          id: 'kmlc_css_1'
        });
      const styleSheet = document.createElement('link');
      styleSheet.rel = 'stylesheet';
      styleSheet.id = 'kmlc_css_1';
      styleSheet.href = 'https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css';
      document.head.appendChild(styleSheet);
    }

    // Load custom internal CSS
    if (!document.getElementById('kmlc_css_2')) {
      if (debug)
        console.log('[DEBUG] loadCSS', 'CSS Load', 'Loading internal custom CSS', {
          id: 'kmlc_css_2'
        });
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.id = 'kmlc_css_2';
      styleSheet.innerText = `
body::-webkit-scrollbar {
  display: none;  /* Hide scrollbar for WebKit (Chrome, Safari) */
}
body {
  scrollbar-width: auto;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}

#newMenu {
  position: absolute;
  top: 0;
  z-index: 3000;
  width: 88px;
  min-height: 100%;
  overflow: hidden;
  transition: all .5s;
  margin-left: -78px !important;
}

#menu-header.none {
  display: none;
}

#main-part.sidebarnothover {
  margin-left: 78px !important;
  width: calc(100vw - 78px) !important;
  transition: var(--tran-05);
}

#main-part {
  margin-left: 78px !important;
  width: calc(100vw - 78px) !important;
}

/* ===== Sidebar ===== */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  --body-color: #ffffff;
  --sidebar-color: #2e6ac8;
  --primary-color: #0f8fd1;
  --primary-color-light: #0e3e85;
  --text-color: #ebebeb;
  --tran-03: all 0.2s ease;
  --tran-03: all 0.3s ease; 
  --tran-04: all 0.3s ease;
  --tran-05: all 0.3s ease;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  padding: 10px 14px;
  background: var(--sidebar-color);
  transition: var(--tran-05);
  z-index: 100;
  border-radius: 0px 10px 10px 0px;
  font-family: 'Poppins', sans-serif;
  overflow-y: auto;
}

.sidebar::-webkit-scrollbar {
  display: none;
}

.sidebar li {
  height: 40px;
  list-style: none;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.sidebar header .image,
.sidebar .icon {
  min-width: 60px;
  border-radius: 6px;
}

.sidebar .icon {
  min-width: 60px;
  border-radius: 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.sidebar .text,
.sidebar .icon {
  color: var(--text-color);
  transition: var(--tran-03);
}

.sidebar .text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 1;
}

.sidebar:not(:hover) .text {
  opacity: 0;
}

.sidebar header {
  position: relative;
}

.sidebar header .image-text {
  display: flex;
  align-items: center;
}

.sidebar header .logo-text {
  display: flex;
  flex-direction: column;
  margin: auto;
}

header .image-text .name {
  margin-top: 2px;
  font-size: 18px;
  font-weight: 600;
}

header .image-text .profession {
  font-size: 16px;
  margin-top: -2px;
  display: block;
}

.sidebar header .image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar header .image img {
  object-fit: cover;
  object-position: top;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  zoom: 1;
}

.sidebar .menu {
  margin-top: 40px;
}

.sidebar li.search-box {
  border-radius: 6px;
  background-color: var(--primary-color-light);
  cursor: pointer;
  transition: var(--tran-05);
}

.sidebar li.search-box input {
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  background-color: var(--primary-color-light);
  color: var(--text-color);
  border-radius: 6px;
  font-size: 17px;
  font-weight: 500;
  transition: var(--tran-05);
}

.sidebar li a {
  list-style: none;
  height: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 6px;
  text-decoration: none;
  transition: var(--tran-03);
  padding-right: 21px;
}

.sidebar li a:hover {
  background-color: var(--primary-color);
}

.sidebar li a:hover .icon,
.sidebar li a:hover .text {
  color: var(--body-color);
}

.sidebar li a.item-actif {
  background-color: var(--primary-color-light);
}

.sidebar li a.item-actif .icon,
.sidebar li a.item-actif .text {
  color: var(--body-color);
}

.sidebar .menu-bar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: scroll;
}

.sidebar:not(:hover) .menu-bar{
  overflow-y: hidden !important;
  transition: var(--tran-03);
}
.menu-bar {
  overflow-x: hidden;
  transition: var(--tran-03);
}

.menu-bar::-webkit-scrollbar {
  width: 4px;
}

.menu-bar::-webkit-scrollbar-track {
  background: rgba(128, 128, 128, 0.484);     
  border-radius: 20px;   
}

.menu-bar::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.484);    
  border-radius: 20px;
}

.sidebar .menu-bar .mode {
  border-radius: 6px;
  background-color: var(--primary-color-light);
  position: relative;
  transition: var(--tran-05);
}

.sidebar .menu-bar .mode2 {
  margin-bottom: 8px;
  border-radius: 6px;
  position: relative;
  transition: var(--tran-05);
}

.menu-bar .mode .sun-moon {
  height: 50px;
  width: 60px;
}

.mode .sun-moon i {
  position: absolute;
}

.mode .sun-moon i.sun {
  opacity: 0;
}

.menu-badge {
  position: absolute;
  padding: 5px;
  background: var(--secondary-color);
  color: #fff;
  font-size: 11px;
  transition: all .5s;
}
      `;
      document.head.appendChild(styleSheet);
    }
  }

  /**
   * Function to handle mouseover event on the sidebar
   */
  function handleMouseOver() {
    // Hide scroll bars when mouse is over the sidebar
    if (!window.location.href.includes('EmploiDuTemps')) {
      document.getElementById('main-part').classList.add('sidebarhover');
    }
<<<<<<< HEAD:src/Design/sidebar.js
    document.querySelector('.menu-bar').style.setProperty('overflow', 'hidden');
    document.querySelector('.menu').style.setProperty('background-color', 'hidden');
=======
    document.querySelector('.menu-bar').style.overflow = 'hidden';
    document.querySelector('.menu').style.overflow = 'hidden';
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Design/sidebar.js
  }

  /**
   * Function to handle mouseout event on the sidebar
   */
  function handleMouseOut() {
    // Restore scroll bars when mouse is out of the sidebar
    document.getElementById('main-part').classList.remove('sidebarhover');
    document.getElementById('main-part').classList.add('sidebarnothover');
  }

  /**
   * Function to initialize the sidebar
   */
  function initializeSidebar() {
    // If the newMenu id (id set when newMenu is loaded) doesn't exist we will apply our navigation bar changes
    if (
      !document.querySelector('#newMenu') &&
      document.querySelector('#container-menu')
    ) {
      if (debug)
        console.log('[DEBUG] initializeSidebar', 'Sidebar Init', 'Initializing sidebar', {
          id: 'newMenu'
        });

      // Get the element containing all the persons in the account displayed in the navigation bar
      let navigationBarPersons = document.querySelector('#container-menu');

      // Get the whole old navigation bar
      let oldParent = navigationBarPersons.parentNode;

      // Creating the new navigation bar
      let newParent = document.createElement('div');
      newParent.setAttribute('id', 'newMenu');

      // Replace the navigationBarPersons in the DOM with the newParent/new navigation bar, and append navigationBarPersons in the new navigation bar
      oldParent.replaceChild(newParent, navigationBarPersons);
      newParent.appendChild(navigationBarPersons);

      // Starting the changes by deleting the id and adding the new class sidebar to the new navigation bar
      navigationBarPersons.removeAttribute('id');
      navigationBarPersons.setAttribute('class', 'sidebar');

      // Set up mouseover and mouseout event handlers
      document.querySelector('#newMenu').onmouseover = handleMouseOver;
      document.querySelector('#newMenu').onmouseout = handleMouseOut;

      // Recover the logged account name and the message under it (in the old navigation bar) and add them to the new header.
      let header = [];
      header.push(
        '<header><div class="image-text"><div class="text logo-text"><span class="name">' +
          document.getElementById('user-account-link').innerText +
          '</span><span class="profession">' +
          document.querySelector('.ed-espace-title').textContent +
          '</span></div></div></header>'
      );

      // Get all the persons displayed in the navigation bar
      let edMenu = document.querySelectorAll('ed-menu');

      for (let i = 0; i < edMenu.length; i++) {
        // Get all the sections in the navigation bar of each person in the account and append them directly under the new menu-bar in the DOM
<<<<<<< HEAD:src/Design/sidebar.js
        let roleMenu = document.querySelectorAll('ul[class *= ed-menu-list]')[i];
=======
        let roleMenu = document.querySelectorAll('ul[role="menu"]')[i];
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Design/sidebar.js
        roleMenu.parentElement.parentElement.appendChild(roleMenu);

        // Removing the blue rectangle wrapping all the sections
        document.querySelector('.ed-menu-list-wrapper').remove();

        // Get the new location of the sections in the DOM and get each button that let the user go from one section to another one
        let button = roleMenu.querySelectorAll('li');

        for (let j = 0; j < button.length; j++) {
          // Append the HTML "a" element containing the link to the section of the button directly under the button in the DOM
          button[j].appendChild(button[j].querySelector('a'));

          // Adding role attribute
          button[j].role = 'menuitem';

          // Delete the element that contains the old HTML "a" element
          button[j].querySelector('ed-menu-block-item').remove();

          // Editing the new HTML "a" element, adding the new icon and the text associated with the button
          let a = button[j].querySelector('a');
          a.setAttribute(
            'class',
            (a.getAttribute('class') || '').replace(' nav-link', '') + ' nav-link'
          );
          a.setAttribute(
            'style',
            (a.getAttribute('style') || '').replace(
              ' text-decoration:none !important',
              ''
            ) + ' text-decoration:none !important'
          );

<<<<<<< HEAD:src/Design/sidebar.js
          let icon = a.querySelector('i, fa-icon');
=======
          let icon = a.querySelector('i');
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Design/sidebar.js
          icon.setAttribute('class', 'icon iconED ' + icon.getAttribute('class'));

          let span = a.querySelector('span');
          span.setAttribute(
            'class',
            (span.getAttribute('class') || '') + ' text nav-text'
          );
        }

        // Append the picture associated with each person of the account
        if (i > 0) {
          header.push(
            '<header><div class="image-text"><span class="image"><img title="Photo de profile" src=' +
              edMenu[i].parentElement.parentElement
                .querySelector('.overlay')
                .parentElement.style.backgroundImage.split('"')[1] +
              '></span><div class="text"><span class="name">' +
              edMenu[i].parentElement.parentElement.querySelector('.overlay').innerText +
              '</span></div></div></header>'
          );
        }

        // Adding classes
        roleMenu.parentElement.setAttribute('class', 'menu');
        roleMenu.parentElement.querySelector('a').remove();
        roleMenu.parentElement.parentElement.setAttribute('class', 'menu-bar');
        roleMenu.setAttribute(
          'class',
          (roleMenu.getAttribute('class') || '') + ' menu-links'
        );
<<<<<<< HEAD:src/Design/sidebar.js
        roleMenu.parentElement.kmlcReplaceElementNode('DIV');
=======
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Design/sidebar.js
      }

      // Handle multiple accounts
      if (edMenu.length > 1) {
        for (let i = 1; i < edMenu.length; i++) {
          edMenu[0].children[0].appendChild(edMenu[i].children[0].children[0]);
          edMenu[i].remove();
        }
      }

      document.querySelector('.ed-espace-title').remove();

      // Adding new HTML "LI" elements to add spaces between the first and second person in the navigation bar
      let menu = document.querySelector('.sidebar').querySelectorAll('.menu');
      menu[0].parentElement.insertBefore(fragmentFromString(header[0]), menu[0]);

      let ul = document.createElement('UL');
      ul.role = 'menu';
      let li = document.createElement('LI');
      li.role = 'menuitem';
      ul.appendChild(li);
      menu[0].kmlcInsertAfter(ul);

      // Adding spaces between each person in the navigation bar
      for (let i = 1; i < menu.length; i++) {
        menu[i].parentElement.insertBefore(fragmentFromString(header[i]), menu[i]);

        let ul = document.createElement('UL');
        ul.role = 'menu';
        let li = document.createElement('LI');
        li.role = 'menuitem';
        li.title = 'category';
        ul.appendChild(li);
        menu[i].kmlcInsertAfter(ul);
      }

      // Toggle visibility of menu sections when header is clicked
      document.querySelectorAll('header:not([class])').forEach((header) => {
        header.children[0].onclick = function () {
          let sibling = this.parentElement.nextElementSibling;
<<<<<<< HEAD:src/Design/sidebar.js
          sibling.style.setProperty(
            'visibility',
            sibling.style.visibility === 'hidden' ? '' : 'hidden'
          );
          sibling.style.setProperty(
            'margin-left',
            sibling.style.marginLeft === '-9999px' ? '' : '-9999px'
          );
          sibling.style.setProperty(
            'position',
            sibling.style.position === 'absolute' ? '' : 'absolute'
          );
=======
          sibling.style.visibility =
            sibling.style.visibility === 'hidden' ? '' : 'hidden';
          sibling.style.marginLeft =
            sibling.style.marginLeft === '-9999px' ? '' : '-9999px';
          sibling.style.position =
            sibling.style.position === 'absolute' ? '' : 'absolute';
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Design/sidebar.js
        };
      });

      startLoop();
    }
  }

  /**
   * Function to start the loop for dynamic updates
   */
  function startLoop() {
    if (document.querySelector('.sidebar')) {
      // Replace all ed-menu-badge class with menu-badge class
      document.querySelectorAll('.ed-menu-badge').forEach((el) => {
        el.className = el.className.replace('ed-menu-badge', 'menu-badge');
      });

      // Remove ed-menu class from elements
      document.querySelectorAll('div.menu.ed-menu').forEach((el) => {
        el.classList.remove('ed-menu');
      });

      setSidebarWidthStyles();

      document.onreadystatechange = function () {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
          replaceEdMenuBadge();
        }
      };

      replaceEdMenuBadge();
    }
  }

  /**
   * Function to set sidebar width styles
   */
  function setSidebarWidthStyles() {
    let sidebarWidth = document.querySelector('.sidebar').offsetWidth;
    sidebarWidth = Math.min(sidebarWidth, 280);

    if (!document.getElementById('kmlc_css_3')) {
      if (debug)
        console.log(
          '[DEBUG] setSidebarWidthStyles',
          'CSS Load',
          'Setting sidebar width styles',
          {
            id: 'kmlc_css_3',
            width: sidebarWidth
          }
        );
      const styleSheet3 = document.createElement('style');
      styleSheet3.type = 'text/css';
      styleSheet3.id = 'kmlc_css_3';
      styleSheet3.innerText = `
        .sidebar {
          width: ${sidebarWidth}px;
        }
        #main-part.sidebarhover {
          margin-left: ${sidebarWidth - 10}px !important;
          width: calc(100vw - ${sidebarWidth - 10}px) !important;
          transition: var(--tran-05);
        }
      `;
      document.head.appendChild(styleSheet3);
    }

    if (!document.getElementById('kmlc_css_4')) {
      if (debug)
        console.log(
          '[DEBUG] setSidebarWidthStyles',
          'CSS Load',
          'Setting closed sidebar width',
          {
            id: 'kmlc_css_4',
            width: 88
          }
        );
      const styleSheet4 = document.createElement('style');
      styleSheet4.type = 'text/css';
      styleSheet4.id = 'kmlc_css_4';
      styleSheet4.innerText = `
        .sidebar:not(:hover) {
          width: 88px;
        }
      `;
      document.head.appendChild(styleSheet4);
    }
  }

  /**
   * Function to replace all instances of ed-menu-badge class with menu-badge class
   */
  function replaceEdMenuBadge() {
    document.querySelectorAll('.ed-menu-badge').forEach((el) => {
      el.className = el.className.replace('ed-menu-badge', 'menu-badge');
    });
  }

  /**
   * Main function to initialize and set up the sidebar
   */
  function sidebar() {
    loadCSS();
    initializeSidebar();
  }

  // Exporting the sidebar function to be used in other modules
<<<<<<< HEAD:src/Design/sidebar.js
  exports({sidebar}).to('./src/Design/sidebar.js');
=======
  exports({sidebar}).to('./features/Design/sidebar.js');
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Design/sidebar.js
})();
