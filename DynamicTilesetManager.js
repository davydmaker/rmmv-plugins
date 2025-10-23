/*:
 * @target MV
 * @plugindesc Allows dynamically changing the tileset of any map (MV/MZ version).
 * @author Kyonides Arkanthes (original) / Davyd Maker (MV reimplementation)
 * @help
 * ------------------------------------------------------------------
 * Script Commands:
 * ------------------------------------------------------------------
 * $gameMap.changeTileset(mapId, tilesetId);
 *   → Changes the tileset of the map "mapId" to the tileset "tilesetId"
 *
 * $gameMap.resetTileset(mapId);
 *   → Restores the original tileset of the map "mapId"
 *
 * ------------------------------------------------------------------
 * Example:
 *   $gameMap.changeTileset($gameMap.mapId(), 5);
 *   → Changes the current tileset to the ID 5.
 *
 * ------------------------------------------------------------------
 * Original Implementation (RPG Maker XP):
 *   https://forums.rpgmakerweb.com/index.php?threads/switching-tilesets-while-making-the-map.157060/#post-1345100
 *
 * ------------------------------------------------------------------
 * Notes:
 * - Works even if the player is still on the map.
 * - Does not change the saved map in the editor, only at runtime.
 * - Changes are saved together with the game save.
 * ------------------------------------------------------------------
 */

(() => {
  const _Game_Map_initialize = Game_Map.prototype.initialize;
  Game_Map.prototype.initialize = function () {
    _Game_Map_initialize.call(this);
    this._tilesetOverrides = this._tilesetOverrides || {};
  };

  Game_Map.prototype.changeTileset = function (mapId, tilesetId) {
    if (!tilesetId || !$dataTilesets[tilesetId]) {
      console.warn(`Tileset ID ${tilesetId} invalid!`);
      return;
    }

    this._tilesetOverrides[mapId] = tilesetId;
    if (this._mapId === mapId) this.refreshTileset();
  };

  Game_Map.prototype.resetTileset = function (mapId) {
    delete this._tilesetOverrides[mapId];
    if (this._mapId === mapId) this.refreshTileset();
  };

  Game_Map.prototype.getTilesetIdOverride = function () {
    return (
      this._tilesetOverrides[this._mapId] ||
      this._map?.tilesetId ||
      this._tilesetId
    );
  };

  Game_Map.prototype.refreshTileset = function () {
    const newId = this.getTilesetIdOverride();
    if (newId === this._tilesetId) return;

    this._tilesetId = newId;
    this._tileset = $dataTilesets[newId];
    this.requestRefresh();

    if (SceneManager._scene instanceof Scene_Map) {
      SceneManager._scene._spriteset.loadTileset();
    }
  };

  const _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function (mapId) {
    _Game_Map_setup.call(this, mapId);

    const override = this._tilesetOverrides[mapId];
    if (override && $dataTilesets[override]) {
      this._tilesetId = override;
      this._tileset = $dataTilesets[override];
    }
  };
})();
