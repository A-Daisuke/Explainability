function __method_wrapper__() {
    pauseAllActiveSounds(): void {
      const soundList = this._freeSounds.concat(this._freeMusics);
      for (let key in this._sounds) {
        if (this._sounds.hasOwnProperty(key)) {
          soundList.push(this._sounds[key]);
        }
      }
      for (let key in this._musics) {
        if (this._musics.hasOwnProperty(key)) {
          soundList.push(this._musics[key]);
        }
      }
      for (let i = 0; i < soundList.length; i++) {
        const sound = soundList[i];
        if (!sound.paused() && !sound.stopped()) {
          sound.pause();
          this._pausedSounds.push(sound);
        }
      }
      this._paused = true;
    }

}
