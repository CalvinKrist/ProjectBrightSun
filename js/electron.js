function loadWebPage(webPage) {
	const {BrowserWindow} = require('electron')
  
	// Or use `remote` from the renderer process.
	// const {BrowserWindow} = require('electron').remote
  
	let win = new BrowserWindow({width: 800, height: 600})
	win.on('closed', () => {
		win = null
	})
 
	// Or load a local HTML file
	win.loadURL(`file://${__dirname}/` + webPage)
}