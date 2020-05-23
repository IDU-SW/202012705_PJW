const express = require('express');
const router = express.Router();
const song = require('../model/DisneySongModel');

router.get('/song', showSongList);
router.get('/song/add', addSongForm);
router.get('/song/update/:Songid', updateSongForm); //
router.get('/song/:Songid', showSongDetail);
router.post('/song', addSong);
router.post('/song/delete/:Songid', deleteSong);
router.post('/song/update/:Songid', updateSong);

module.exports = router;

// Read (리스트조회)
async function showSongList(req, res) {
    const SongList = await song.getSongList();
    console.log(SongList);
    res.render('Song', { song: SongList, count: SongList.length })
}


// ReadDetail (리스트 상세조회)
async function showSongDetail(req, res) {
    try {
        const Songid = req.params.Songid;
        console.log('Songid : ', Songid);
        const info = await song.getSongDetail(Songid);
        res.render('SongDetail', { data: info });
    }
    catch (error) {
        console.log('Can not Disney OST find, 404');
        res.status(error.code).send({ msg: error.msg });
    }
}

// Add (노래 추가)
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

// Add Form (노래 추가 폼)
function addSongForm(req, res) {
    res.render('SongAdd');
}

// Delete (노래 삭제)
async function deleteSong(req, res) {
    try {
        const Songid = req.params.Songid;
        const result = await song.deleteSong(Songid);
        res.render('SongDelete', { data: result })
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Update (노래 수정)
async function updateSong(req, res) {
    const Songid = req.params.Songid;
    const OstTitle = req.body.OstTitle;

    if (!OstTitle) {
        res.status(400).send({ error: 'OstTitle 에 입력된 값이 존재하지 않습니다.' });
        return;
    }

    const MovieTitle = req.body.MovieTitle;
    const Year = parseInt(req.body.Year);
    const MainC = req.body.MainC;

    try {
        const result = await song.updateSong(Songid, OstTitle, MovieTitle, Year, MainC);
        res.render('SongUpdateComplete', { data: result });
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Update Form
async function updateSongForm(req, res) {
    try {
        const Songid = req.params.Songid;
        console.log('Songid : ', Songid);
        const info = await song.getSongDetail(Songid);
        res.render('SongUpdate', { data: info }); //ch
    }
    catch (error) {
        console.log('Can not find, 404');
        res.status(error.code).send({ msg: error.msg });
    }
}
