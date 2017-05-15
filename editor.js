const electron = require('electron')
const {dialog, Menu} = electron.remote
const path = require('path')
const fs = require('fs')

let filepath = 'untitled'
let title = 'notes' + ' - '

let template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New File...',
        accelerator: 'CmdOrCtrl+N',
        click: function () {
          newfile()
        }
      },
      {
        label: 'Open File...',
        accelerator: 'CmdOrCtrl+O',
        click: function () {
          openfile()
        }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: function () {
          save()
        }
      },
      {
        label: 'Save As...',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: function () {
          saveas()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        type: 'separator'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'togglefullscreen'
      },
      {
        type: 'separator'
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+Shift+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

const editor = document.getElementById('editor')
const behave = new Behave({
  textarea: editor,
  replaceTab: true,
  softTabs: true,
  tabSize: 2,
  autoOpen: true,
  overwrite: true,
  autoStrip: true,
  autoIndent: true,
  fence: false
})

/*editor.addEventListener('keydown', (e) => {
  if (e.keyCode === 9) {
    e.preventDefault()
  }
})*/

window.onload = () => {
  settitle(title, filepath)
  editor.focus()
}

function newfile () {
  if (filepath !== 'untitled') {
    filepath = 'untitled'
    settitle(title, filepath)
  }
  editor.value = ''
}

function openfile () {
  dialog.showOpenDialog({ filters: [{ name: 'plain text(.txt)', extensions: ['txt'] }, { name: 'all(*)', extensions: ['*'] }] }, (f) => {
    if (f === undefined) return
    fs.readFile(f[0], (err, data) => {
      editor.value = data.toString()
      settitle(title, f)
      if (err) {
        dialog.showErrorBox('error', err.message)
      }
    })
  })
}

function save () {
  if (filepath === 'untitled') {
    saveas()
  } else {
    fs.writeFile(filepath, editor.value, (err) => {
      if (err) {
        dialog.showErrorBox('error', err.message)
      }
    })
  }
}

function saveas () {
  dialog.showSaveDialog({ filters: [{ name: 'plain text(.txt)', extensions: ['txt'] }, { name: 'other(*)', extensions: ['*'] }] }, (f) => {
    if (f === undefined) return
    fs.writeFile(f, editor.value, (err) => {
      settitle(title, f)
      if (err) {
        dialog.showErrorBox('error', err.message)
      }
    })
  })
}

function settitle (t, f) {
  filepath = f.toString()
  document.getElementById('title').textContent = t + path.basename(filepath)
}
