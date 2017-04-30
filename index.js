const electron = require('electron')
const { app, BrowserWindow } = electron
const debug = true

app.on('ready', () => {
    setUpScreens()
})

function setUpScreens() {
    let electronScreen = electron.screen
    let displays = electronScreen.getAllDisplays()
    let externalDisplay = null

    let roulleteWin = null
    let controlWin = null

    for (var i in displays) {
        if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
            externalDisplay = displays[i]
            break
        }
    }

    if (externalDisplay) {
        roulleteWin = new BrowserWindow({
            frame: debug ? true : false,
            x: externalDisplay.bounds.x,
            y: externalDisplay.bounds.y,
            width: externalDisplay.bounds.width,
            height: externalDisplay.bounds.height
        })
    } else {
        roulleteWin = new BrowserWindow({
            frame: debug ? true : false,
            width: 1024,
            height: 768
        })
    }

    roulleteWin.loadURL(`file://${__dirname}/html/roullete.html`)
    roulleteWin.setResizable(false)

    if (!debug)
        roulleteWin.setMenu(null)

    if (debug)
        roulleteWin.webContents.openDevTools()

    const ipcMain = electron.ipcMain
    ipcMain.on('send-question', function (event, arg) {
        roulleteWin.webContents.send('send-question', arg)
    });

    controlWin = new BrowserWindow({
        width: 1024,
        height: (768 / 2) + 50
    })
    controlWin.loadURL(`file://${__dirname}/html/controller.html`)
    controlWin.setResizable(false)

    if (!debug)
        controlWin.setMenu(null)

    if (debug)
        controlWin.webContents.openDevTools()

    // Close the whole app
    controlWin.on('closed', function () {
        app.quit()
    })
}