const electron = require('electron')
const {dialog, Menu} = electron.remote
const fs = require('fs')

let template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: function () {
          open()
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
            label: 'Reload Window',
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

// add tab support to html textarea
document.getElementById('editor').addEventListener('keydown', function (e) {
  // if tab was pressed
  if (e.keyCode === 9) {
    // get caret selection/position
    let start = this.selectionStart
    let end = this.selectionEnd

    let target = e.target
    let value = target.value

    // set textarea value to: text before caret + tab + text after caret
    target.value = value.substring(0, start) + '\t' + value.substring(end)
    // put caret at right position again (add one for the tab)
    this.selectionStart = this.selectionEnd = start + 1
    // prevent focus lose
    e.preventDefault()
  }
}, false)

function open () {
  dialog.showOpenDialog({ filters: [{ name: 'text(.txt)', extensions: ['txt'] }, { name: 'all(*)', extensions: ['*'] }] }, (file) => {
    if (file === undefined) return
    fs.readFile(file[0], (err, data) => {
      document.getElementById('editor').value = data
      if (err) {
        dialog.showErrorBox('error', err.message)
      }
    })
  })
}

function save () {
  dialog.showSaveDialog({ filters: [{ name: 'text(.txt)', extensions: ['txt'] }, { name: 'other(*)', extensions: ['*'] }] }, (file) => {
    if (file === undefined) return
    fs.writeFile(file, document.getElementById('editor').value, (err) => {
      if (err) {
        dialog.showErrorBox('error', err.message)
      }
    })
  })
}
