globalThis.Design.sidebar = function () {
	// If the css isn't loaded in the page we add it
	if (!document.getElementById("kmlc_css_1")) {
		let styleSheet = document.createElement("link");
		styleSheet.rel = "stylesheet";
		styleSheet.id = "kmlc_css_1";
		styleSheet.href = "https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css";
		document.head.appendChild(styleSheet);
	}
				
	if (!document.getElementById("kmlc_css_2")) {
		let styleSheet2 = document.createElement("style");
		styleSheet2.type = "text/css";
		styleSheet2.id = "kmlc_css_2";
		styleSheet2.innerText = `
		#newMenu {
		  position: absolute;
		  top: 0;
		  z-index: 3000;
		  width: 88px;
		  min-height: 100%;
		  overflow: hidden;
		  transition: all .5s;
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
		
		document.head.appendChild(styleSheet2);
		// The new css is loaded
	}
	
	// The file design.css can be removed but It's more easier to do css in a css file
	
	// If the newMenu id (id set when newMenu is loaded) doesn't exist we will apply our navigation bar changes
	if (!document.querySelector("#newMenu")) {
		console.log("AHHHHHHHHHhh")
		
		// Get the element containing all the persons in the account displayed in the navigation bar
		let navigationBarPersons = document.querySelector("#container-menu")
		
		// Get the whole old navigation bar
		let oldParent = navigationBarPersons.parentNode;
		
		// Creating the new navigation bar
		let newParent = document.createElement('div');
		newParent.setAttribute("id", "newMenu")

		// Replace the navigationBarPersons in the DOM with the newParent/new navigation bar, and append navigationBarPersons in the new navigation bar
		oldParent.replaceChild(newParent, navigationBarPersons);
		newParent.appendChild(navigationBarPersons);

		// Starting the changes by deleting the id and adding the new class sidebar to the new navigation bar
		navigationBarPersons.removeAttribute("id")
		navigationBarPersons.setAttribute("class", "sidebar")
		
		// When the mouse is over the newMenu we remove all the scroll bars
		document.querySelector("#newMenu").onmouseover = function () {
			// It can be commented users with a low-end pc can experience lags
			if (!window.location.href.includes("EmploiDuTemps")) document.getElementById("main-part").classList.add("sidebarhover");
			
			document.querySelector(".menu-bar").style.overflowY = "hidden";
			document.querySelector(".menu").style.overflowY = "hidden";
			document.querySelector(".menu-bar").style.overflowX = "hidden";
			document.querySelector(".menu").style.overflowX = "hidden";
			
			// Checking if the scroll bar is needed or not
			//if (document.querySelector(".menu-bar").scrollHeight == document.querySelector(".menu-bar").clientHeight) {
				//document.querySelector(".menu-bar").style.overflowY = "scroll";
			//}
		};
		document.querySelector("#newMenu").onmouseout = function () {
			// It can be commented because users with a low-end pc can experience lags
			document.getElementById("main-part").classList.remove("sidebarhover");
			document.getElementById("main-part").classList.add("sidebarnothover")
		};
		
		// Recover the logged account name and the message under it (in the old navgation bar) and add them to the new header. It's located in the top of the old navigation bar
		let header = []
		header.push('<header><div class="image-text"><div class="text logo-text"><span class="name">' + document.getElementById("user-account-link").innerText + '</span><span class="profession">' + document.querySelector(".ed-espace-title").textContent + '</span></div></div></header>')
		
		// Get all the persons displayed in the navigation bar
		let edMenu = document.querySelectorAll("ed-menu")
		
		for (let i = 0; i < document.querySelectorAll("ed-menu").length; i++) {
			// Get all the sections in the navigation bar of each person in the account and append them directly under the new menu-bar in the DOM
			let roleMenu = document.querySelectorAll("ul[role = menu]")[i]
			roleMenu.parentElement.parentElement.appendChild(roleMenu)
			
			// Removing the blue rectangle wrapping all the sections
			document.querySelector(".ed-menu-list-wrapper").remove()
			
			// Get the new location of the sections in the DOM and get each buttons that let the user to go from a section to another one
			roleMenu = document.querySelectorAll("ul[role = menu]")[i]
			let button = roleMenu.querySelectorAll("li")
			
			for (let j = 0; j < button.length; j++) {
				// Append the HTML "a" element containing the link to the section of the button directly under the button in the DOM
				button[j].appendChild(button[j].querySelector("a"))
				
				// We delete the element that contain the old HTML "a" element
				button[j].querySelector("ed-menu-block-item").remove()
				
				// Editing the new HTML "a" element, adding the new icon and the text associated to the button
				let a = button[j].querySelector("a")
				
				if (a.getAttribute("class")) {
					a.setAttribute("class", a.getAttribute("class").replace(" nav-link", "") + " nav-link")
				} else {
					a.setAttribute("class", "nav-link")
				}
				
				if (a.getAttribute("style")) {
					a.setAttribute("style", a.getAttribute("style").replace(" text-decoration:none !important", "") + " text-decoration:none !important")
				} else {
					a.setAttribute("style", "text-decoration:none !important")
				}
				
				let i = a.querySelector("i")
				i.setAttribute("class", "icon iconED " + i.getAttribute("class"))
				
				let span = a.querySelector("span")
				span.setAttribute("class", span.getAttribute("class") + " text nav-text")
			}
			
			// Append the picture associated to each person of the account
			if (i > 0) header.push('<header><div class="image-text"><span class="image"><img src=' + edMenu[i].parentElement.parentElement.querySelector(".overlay").parentElement.style.backgroundImage.split("\"")[1] + '></span><div class="text"><span class="name">' + edMenu[i].parentElement.parentElement.querySelector(".overlay").innerText + '</span></div></div></header>')
			
			// Adding classes
			roleMenu.parentElement.setAttribute("class", "menu")
			roleMenu.parentElement.querySelector("a").remove()
			roleMenu.parentElement.parentElement.setAttribute("class", "menu-bar")
			roleMenu.setAttribute("class", roleMenu.getAttribute("class") + " menu-links")
		}
		
		// If there is more than one person in the account
		if (edMenu.length > 1) {
			for (let i = 1; i < edMenu.length; i++) {
				// Append the menu wrapping all the sections of each person after the picture associated to them and remove the last parts of the old navigation bar associated to the person
				edMenu[0].children[0].appendChild(edMenu[i].children[0].children[0])
				edMenu[i].remove()
			}
		}
		
		document.querySelector(".ed-espace-title").remove()
		
		// Adding a new HTML "LI" element to add some spaces between the first and second person in the navigation bar
		let menu = document.querySelector(".sidebar").querySelectorAll(".menu")
		menu[0].parentElement.insertBefore(fragmentFromString(header[0]), menu[0])
		menu[0].insertAfter(document.createElement("LI"))
		
		// Adding after each person in the account a new HTML "LI" element to add some spaces between each person in the navigation bar
		for (let i = 1; i < menu.length; i++) {
			menu[i].parentElement.insertBefore(fragmentFromString(header[i]), menu[i])
			menu[i].insertAfter(document.createElement("LI"))
		}
		
		// For each HTML "header" element with no class so for each person associated text and picture, if someone click on it, it will hide (or show) the menu wrapping all sections associated with the person
		for (let i = 0; i < document.querySelectorAll("header:not([class])").length; i++) {
			document.querySelectorAll("header:not([class])")[i].children[0].onclick = function () {
				if (this.parentElement.nextElementSibling.style.visibility != 'hidden') {
					this.parentElement.nextElementSibling.style.visibility = 'hidden'
					this.parentElement.nextElementSibling.style.marginLeft = '-9999px'
					this.parentElement.nextElementSibling.style.position = 'absolute'
				} else {
					this.parentElement.nextElementSibling.style.marginLeft = ''
					this.parentElement.nextElementSibling.style.visibility = ''
					this.parentElement.nextElementSibling.style.position = ''
				}
			}
		}
		
		loop()
	}
	
	// Replace all ed-menu-badge class with menu-badge class
	for (let i = 0; i < document.getElementsByClassName("ed-menu-badge").length; i++)
		document.getElementsByClassName("ed-menu-badge")[i].className = document.getElementsByClassName("ed-menu-badge")[i].className.replace("ed-menu-badge", "menu-badge")

	// Remove from all elements the class ed-menu
	if (document.querySelectorAll("div.menu.ed-menu"))
		for (let i = 0; i < document.querySelectorAll("div.menu.ed-menu").length; i++)
			document.querySelectorAll("div.menu.ed-menu")[i].classList.remove("ed-menu")

	if (!document.getElementById("kmlc_css_3")) {
		let sidebarWidth = document.querySelector(".sidebar").offsetWidth
		if (sidebarWidth > 280) sidebarWidth = 280
		
		let styleSheet3 = document.createElement("style");
		styleSheet3.type = "text/css";
		styleSheet3.id = "kmlc_css_3";
		styleSheet3.innerText = `
		.sidebar {
			width: ` + sidebarWidth + `px;
		}` + `
		
		#main-part.sidebarhover {
		  margin-left: ` + (sidebarWidth - 10) + `px !important;
		  width: calc(100vw - ` + (sidebarWidth - 10) + `px) !important;
		  transition: var(--tran-05);
		}
		`;
		
		document.head.appendChild(styleSheet3);
		// We get the sidebar width and then we add it to the width style
	}
	
	if (!document.getElementById("kmlc_css_4")) {
		let styleSheet4 = document.createElement("style");
		styleSheet4.type = "text/css";
		styleSheet4.id = "kmlc_css_4";
		styleSheet4.innerText = `
		.sidebar:not(:hover) {
			width: 88px;
		}
		`;
		
		document.head.appendChild(styleSheet4);
		// After getting the sidebar width we set the closed sidebar width
	}
    
    document.onreadystatechange = function () {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            // Replace all ed-menu-badge class with menu-badge class
            for (let i = 0; i < document.getElementsByClassName("ed-menu-badge").length; i++)
                document.getElementsByClassName("ed-menu-badge")[i].className = document.getElementsByClassName("ed-menu-badge")[i].className.replace("ed-menu-badge", "menu-badge")
        }
    }
}