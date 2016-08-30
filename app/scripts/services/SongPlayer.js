(function () {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};
    /**
    *@desc gets the current album in the songplayer
    *@type {object}
    */
    var currentAlbum = Fixtures.getAlbum();
    /**
    *@function getSongIndex
    *@desc finds the songs current index
    *@param {object} song
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };
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
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    }
    /**
    * @desc song object from album
    * @type {Object}
    */
    SongPlayer.currentSong = null;
    /**
    *@desc Current playback time (in seconds) of currently playing song
    *@type {Number}
    */
    SongPlayer.currentTime = null;
    /**
    *@function playSong and stopSong
    *@desc plays (or stops) current buzzObject, and sets the current song object property playing to boolean true
    *@param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    }

    var stopSong = function(song) {
      currentBuzzObject.stop();
      song.playing = null;
    }
    /**
    @function play and pause
    @desc logic for playing or pausing a song based on ngclick
    @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
          if (currentBuzzObject.isPaused()) {
            playSong(song);
          }
      }
    };

    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    *@function previous and next
    *@desc grabs the songsIndex and reduces it by 1, if it goes below 0 it stops the object
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong();
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex > currentAlbum.songs.length) {
        stopSong();
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };
    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };


    SongPlayer.volume = 0;
    SongPlayer.max = 100;

    SongPlayer.setVolume = function(value) {
      if(currentBuzzObject) {
        currentBuzzObject.setVolume(value);
      }
    };

    return SongPlayer;
  }


  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
