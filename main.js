async function register({
    registerHook,
    getRouter,
    registerSetting,
    settingsManager,
    storageManager,
    videoCategoryManager,
    videoLicenceManager,
    videoLanguageManager,
    registerExternalAuth,
    peertubeHelpers
}) {
    const defaultAdmin = 'PeerTube admin'

    registerHook({
        target: 'action:application.listening',
        handler: () => displayHelloWorld(settingsManager, defaultAdmin)
    })

}

async function unregister() {
    return
}

module.exports = {
    register,
    unregister
}

// ############################################################################

async function displayHelloWorld(settingsManager, defaultAdmin) {
    let value = await settingsManager.getSetting('admin-name')
    if (!value) value = defaultAdmin

    console.log('hello world ' + value)
}