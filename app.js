const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path')
const url = require('url')
// title: 'notes - '.concat(path.basename('index.html'))

let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600, title: ''})
  win.setMenu(null)
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
