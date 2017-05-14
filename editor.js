const electron = require('electron')
const {dialog, Menu} = electron.remote
const fs = require('fs')
const path = require('path')

let filepath = 'untitled'

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
        label: 'Developer',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'Alt+CmdOrCtrl+R',
            click (item, focusedWindow) {
              if (focusedWindow) focusedWindow.reload()
            }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: 'Alt+CmdOrCtrl+I',
            click (item, focusedWindow) {
              if (focusedWindow) focusedWindow.webContents.toggleDevTools()
            }
          }
        ]
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

const editor = document.getElementById('editor')
// editor.contentEditable = true

window.onload = () => {
  editor.focus()
}

editor.addEventListener('keydown', (e) => {
  // preventing default tab functionality
  if (e.keyCode === 9) {
    e.preventDefault()
  }
})

function newfile () {
  if (filepath !== 'untitled') {
    filepath = 'untitled'
    updatetitle('notes - ', filepath)
    editor.value = ''
  }
}

function openfile () {
  dialog.showOpenDialog({ filters: [{ name: 'plain text(.txt)', extensions: ['txt'] }, { name: 'all(*)', extensions: ['*'] }] }, (file) => {
    if (file === undefined) return
    fs.readFile(file[0], (err, data) => {
      editor.value = data.toString()
      updatetitle('notes - ', file)
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
  dialog.showSaveDialog({ filters: [{ name: 'plain text(.txt)', extensions: ['txt'] }, { name: 'other(*)', extensions: ['*'] }] }, (file) => {
    if (file === undefined) return
    fs.writeFile(file, editor.value, (err) => {
      updatetitle('notes - ', file)
      if (err) {
        dialog.showErrorBox('error', err.message)
      }
    })
  })
}

function updatetitle (title, file) {
  filepath = file.toString()
  document.getElementById('title').textContent = title.concat(path.basename(filepath))
}
