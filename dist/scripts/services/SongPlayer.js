(function () {
  function SongPlayer() {
    var SongPlayer = {};
    /**
    * @desc song object from album
    * @type {Object}
    */
    var currentSong = null;
    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;
    /**
    * @function setSong
    * @desc stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentSong = song;
    }
    /**
    *@function playSong
    *@desc plays current buzzObject, and sets the current song object property playing to boolean true
    *@param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    }
    /**
    @function play and pause
    @desc logic for playing or pausing a song based on ngclick
    @param {Object} song
    */
    SongPlayer.play = function(song) {
      if (currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (currentSong === song) {
          if (currentBuzzObject.isPaused()) {
            currentBuzzObject.play();
          }
      }
    };

    SongPlayer.pause = function(song) {
      currentBuzzObject.pause();
      song.playing = false;
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);
})();
