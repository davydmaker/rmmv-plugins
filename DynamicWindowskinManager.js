/*:
 * @target MV
 * @plugindesc Allows dynamically changing the windowskin during the game.
 * @author HimeWorks (original) / Davyd Maker (refactored & improved)
 * @help
 * ------------------------------------------------------------------
 * Script Commands:
 * ------------------------------------------------------------------
 * $gameSystem.setWindowskin(filename);
 *   → Changes the windowskin to the specified filename
 *   → Example: $gameSystem.setWindowskin("Window_Red");
 *
 * $gameSystem.resetWindowskin();
 *   → Restores the default windowskin (Window.png)
 *
 * $gameSystem.getWindowskin();
 *   → Returns the current windowskin filename
 *
 * $gameSystem.preloadWindowskin(filename);
 *   → Preloads a windowskin for later use (recommended)
 *   → Example: $gameSystem.preloadWindowskin("Window_Red");
 *
 * ------------------------------------------------------------------
 * Example Usage:
 * ------------------------------------------------------------------
 * // Change to a red windowskin
 * $gameSystem.setWindowskin("Window_Red");
 *
 * // Preload multiple windowskins at the start
 * $gameSystem.preloadWindowskin("Window_Red");
 * $gameSystem.preloadWindowskin("Window_Blue");
 * $gameSystem.preloadWindowskin("Window_Dark");
 *
 * // Reset to default
 * $gameSystem.resetWindowskin();
 *
 * ------------------------------------------------------------------
 * Reference:
 *   Based on HimeWorks' Windowskin Change plugin (refactored & improved):
 *   https://himeworks.com/2016/04/windowskin-change/
 *
 * ------------------------------------------------------------------
 * Notes:
 * - All windowskin files must be in the img/system/ folder
 * - Changes are applied immediately to all visible windows
 * - Changes are saved together with the game save
 * - Preloading windowskins prevents loading delays
 * ------------------------------------------------------------------
 */

(() => {
  const DEFAULT_WINDOWSKIN = "Window";

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this._customWindowskin = null;
  };

  Game_System.prototype.setWindowskin = function (filename) {
    if (!filename) {
      console.warn("Windowskin filename cannot be empty!");
      return;
    }

    this._customWindowskin = filename;
    this.refreshAllWindowskins();
  };

  Game_System.prototype.resetWindowskin = function () {
    this._customWindowskin = null;
    this.refreshAllWindowskins();
  };

  Game_System.prototype.getWindowskin = function () {
    return this._customWindowskin || DEFAULT_WINDOWSKIN;
  };

  Game_System.prototype.preloadWindowskin = function (filename) {
    if (!filename) {
      console.warn("Cannot preload windowskin: filename is empty!");
      return;
    }
    ImageManager.loadSystem(filename);
  };

  Game_System.prototype.refreshAllWindowskins = function () {
    if (SceneManager._scene && SceneManager._scene._windowLayer) {
      const windowLayer = SceneManager._scene._windowLayer;
      const windows = windowLayer.children;

      for (let i = 0; i < windows.length; i++) {
        const win = windows[i];
        if (win instanceof Window) {
          win.loadWindowskin();
        }
      }
    }
  };

  const _Window_Base_loadWindowskin = Window_Base.prototype.loadWindowskin;
  Window_Base.prototype.loadWindowskin = function () {
    if ($gameSystem && $gameSystem.getWindowskin) {
      this.windowskin = ImageManager.loadSystem($gameSystem.getWindowskin());
    } else {
      _Window_Base_loadWindowskin.call(this);
    }
  };
})();
