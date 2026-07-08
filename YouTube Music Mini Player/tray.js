import { Menu, Tray } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tray;

const createTray = ({
    app,
    showMainWindow,
    showMiniWindow,
    hideAllToTray,
    executePlaybackAction,
    isAnyWindowVisible,
    getSetting,
    onToggleSetting,
}) => {
    tray = new Tray(path.join(__dirname, 'assets', 'favicon_32.png'));

    const buildMenu = () => {
        return Menu.buildFromTemplate([
            {
                label: 'Show App',
                click: () => {
                    showMainWindow();
                },
            },
            {
                label: 'Mini Window',
                click: () => {
                    showMiniWindow();
                },
            },
            { type: 'separator' },
            {
                label: 'Play/Pause',
                click: () => {
                    void executePlaybackAction('togglePlayPause');
                },
            },
            {
                label: 'Next',
                click: () => {
                    void executePlaybackAction('pressNext');
                },
            },
            {
                label: 'Previous',
                click: () => {
                    void executePlaybackAction('pressPrevious');
                },
            },
            { type: 'separator' },
            {
                label: 'Minimize to Tray',
                type: 'checkbox',
                checked: getSetting('minimizeToTray'),
                click: (menuItem) => {
                    onToggleSetting('minimizeToTray', menuItem.checked);
                },
            },
            {
                label: 'Close to Tray',
                type: 'checkbox',
                checked: getSetting('closeToTray'),
                click: (menuItem) => {
                    onToggleSetting('closeToTray', menuItem.checked);
                },
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    app.isQuitting = true;
                    app.quit();
                },
            },
        ]);
    };

    const rebuildMenu = () => {
        tray.setContextMenu(buildMenu());
    };

    rebuildMenu();
    tray.setToolTip('YouTube Music Mini Player');

    tray.on('click', () => {
        if (isAnyWindowVisible()) {
            hideAllToTray();
            return;
        }

        showMainWindow();
    });

    tray.on('double-click', () => {
        showMainWindow();
    });

    return { tray, rebuildMenu };
};

export { createTray };
