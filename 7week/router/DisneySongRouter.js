const express = require('express');
const router = express.Router();
const song = require('../model/DisneySongModel');

router.get('/song', showSongList);
router.get('/song/add', addSongForm);
router.get('/song/update/:songId', updateSongForm); //
router.get('/song/:songId', showSongDetail);
router.post('/song', addSong);
router.post('/song/delete/:songId', deleteSong);
router.post('/song/update/:songId', updateSong);

module.exports = router;

// Read
function showSongList(req, res) {
    const SongList = song.getSongList();
    res.render('Song', { song: SongList, count: SongList.length }) //ch
}


// ReadDetail
async function showSongDetail(req, res) {
    try {
        // 영화 상세 정보 Id
        const songId = req.params.songId;
        console.log('songId : ', songId);
        const info = await song.getSongDetail(songId);
        res.render('SongDetail', { data: info }); //ch
    }
    catch (error) {
        console.log('Can not Disney OST find, 404');
        res.status(error.code).send({ msg: error.msg });
    }
}

// Add
async function addSong(req, res) {
    const OstTitle = req.body.OstTitle;

    if (!OstTitle) {
        res.status(400).send({ error: 'OstTitle 에 입력된 값이 존재하지 않습니다.' });
        return;
    }

    const MovieTitle = req.body.MovieTitle;
    const Year = parseInt(req.body.Year);
    const MainC = req.body.MainC;

    try {
        const result = await song.addSong(OstTitle, MovieTitle, Year, MainC);
        res.render('SongAddComplete', { data: result });

        console.log('추가할 Disney OST 의 제목 : ' + OstTitle);
        console.log('추가할 Disney OST 의 영화 제목 : ' + MovieTitle);
        console.log('추가할 Disney OST 의 발매 년도 : ' + Year);
        console.log('추가할 Disney OST 의 영화 주인공 : ' + MainC);
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Add Form
function addSongForm(req, res) {
    res.render('SongAdd');
}

// Delete
async function deleteSong(req, res) {
    // console.log('삭제할 Disney OST id 는 ' + songId + ' 입니다.');
    try {
        const songId = req.params.songId;
        const result = await song.deleteSong(songId);
        res.render('SongDelete', {data:result})
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Update
async function updateSong(req, res) {
    const songId = req.params.songId;
    const OstTitle = req.body.OstTitle;
    
    if (!OstTitle) {
        res.status(400).send({ error: 'OstTitle 에 입력된 값이 존재하지 않습니다.' });
        return;
    }

    const MovieTitle = req.body.MovieTitle;
    const Year = parseInt(req.body.Year);
    const MainC = req.body.MainC;

    try {
        const result = await song.updateSong(songId, OstTitle, MovieTitle, Year, MainC);
        res.render('SongUpdateComplete', { data: result });
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Update Form
async function updateSongForm(req, res) {
    try {
        const songId = req.params.songId;
        console.log('songId : ', songId);
        const info = await song.getSongDetail(songId);
        res.render('SongUpdate', { data: info }); //ch
    }
    catch (error) {
        console.log('Can not find, 404');
        res.status(error.code).send({ msg: error.msg });
    }
}
