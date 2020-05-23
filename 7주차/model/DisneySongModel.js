const fs = require('fs');

class DisenySong {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.song = JSON.parse(data)
    }

    // Promise 예제
    // Read
    getSongList() {
        if (this.song) {
            return this.song;
        }
        else {
            return [];
        }
    }

    // Create
    addSong(OstTitle, MovieTitle, Year, MainC) {
        return new Promise((resolve, reject) => {
            let last = this.song[this.song.length - 1];
            let id = last.id + 1;

            let newDisenySong = { id, OstTitle, MovieTitle, Year, MainC };
            this.song.push(newDisenySong);

            resolve(newDisenySong);
        });
    }

    // Promise - Reject
    // Read - ReadDetail
    getSongDetail(songId) {
        return new Promise((resolve, reject) => {
            for (var disney of this.song) {
                if (disney.id == songId) {
                    resolve(disney);
                    return;
                }
            }
            reject({ msg: 'Can not find Disney OST Song', code: 404 });
        });
    }

    // Delete
    deleteSong(songId) {
        return new Promise((resolve, reject) => {
            for (var disney of this.song) {
                if (disney.id == songId) {
                    this.song.splice(songId, 1);
                    resolve(disney);
                    return;
                }
            }
            reject({ msg: 'Can not find Disney OST Song', code: 404 });
        });
    }

    // Update
    updateSong(songId, OstTitle, MovieTitle, Year, MainC) {
        return new Promise((resolve, reject) => {
            const id = parseInt(songId);
            let newDisenySong = { id, OstTitle, MovieTitle, Year, MainC };
            for (var disney of this.song) {
                if (disney.id == id) {
                    this.song.splice(id, 1, newDisenySong);
                    resolve(newDisenySong);
                    return;
                }
            }
        });
    }
}

module.exports = new DisenySong();