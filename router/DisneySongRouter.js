const express = require('express');
const router = express.Router();
const song = require('../model/DisneySongModel');

router.get('/song', showSongList);
router.get('/song/:songId', showSongDetail);
router.post('/song', addSong);
router.delete('/song/:songId', deleteSong);
router.put('/song/:songId', updateSong);

module.exports = router;

function showSongList(req, res) {
    const SongList = song.getSongList();
    const result = { data: SongList, count: SongList.length };
    res.send(result);
}


// Async-await를 이용하기
async function showSongDetail(req, res) {
    try {
        // 영화 상세 정보 Id
        const songId = req.params.songId;
        console.log('songId : ', songId);
        const info = await song.getSongDetail(songId);
        res.send(info);
    }
    catch (error) {
        console.log('Can not Disney OST find, 404');
        res.status(error.code).send({ msg: error.msg });
    }
}


// 새 영화 추가
// POST 요청 분석 -> 바디 파서
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
        res.send({ msg: '선택하신 Disney OST 정보 추가가 완료되었습니다.', data: result });

        console.log('추가할 Disney OST 의 제목 : ' + OstTitle);
        console.log('추가할 Disney OST 의 영화 제목 : ' + MovieTitle);
        console.log('추가할 Disney OST 의 발매 년도 : ' + Year);
        console.log('추가할 Disney OST 의 영화 주인공 : ' + MainC);
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Delete
async function deleteSong(req, res) {
    const songId = req.params.songId;
    console.log('삭제할 Disney OST id 는 ' + songId + ' 입니다.');
    try {
        const result = await song.deleteSong(songId);
        res.send({ msg: '선택하신 Disney OST 정보 삭제가 완료되었습니다.', data: result });
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
        res.send({ msg: '선택하신 Disney OST 정보 수정이 완료되었습니다.', data: result });
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}
