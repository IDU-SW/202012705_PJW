const express = require('express');
const session = require('express-session'); //login을 위한 session 사용
const router = express.Router();
const song = require('../model/DisneySongModel');

router.get('/login', showLogin); //로그인 페이지 보여짐
router.get('/register', showRegister); //회원가입 페이지 보여짐
router.get('/song', showSongList);
router.get('/song/add', addSongForm);
router.get('/song/update/:Songid', updateSongForm);
router.get('/song/:Songid', showSongDetail);
router.get('/logout', logout);
router.post('/register', addRegister); // 회원가입 기능 구현
router.post('/login', sessionLogin); //로그인 기능 구현
router.post('/song', addSong);
router.post('/song/delete/:Songid', deleteSong);
router.post('/song/update/:Songid', updateSong);

module.exports = router;

// login (로그인 페이지 보여줌)
async function showLogin(req, res) {
    res.render('login');
}

// login (로그인 기능 구현)
async function sessionLogin(req, res) {
    const user = {
        loginId : req.body.loginId, // login page의 id 접근
        loginPw : req.body.loginPw // login page의 pw 접근
    };
    const result = await song.showLogin(user);
    
    if(!result) {
        res.redirect('/login');
    }
    else {
        req.session.user = result;
        res.redirect('/song');
    }
}

// logout (로그아웃 기능 구현)
async function logout(req, res) {
    req.session.user = null; //logout 하면 session 에 담긴 login 정보를 비움
    res.redirect('/');
}

// Register (회원가입 페이지를 보여줌)
async function showRegister(req, res) {
    res.render('register');
}

// Register (회원가입 기능)
async function addRegister(req, res) {
    const registerId = req.body.registerId; // 필수 입력값 ID
    const registerPw = req.body.registerPw; // 필수 입력값 PW
    const registerName = req.body.registerName;
    const registerEmail = req.body.registerEmail;

    if (!registerId || !registerPw) {
        res.status(400).send({ error: 'ID 와 PW 입력은 필수입니다.' });
        return;
    }

    try {
        const result = await song.addRegister(registerId, registerPw, registerName, registerEmail);
        console.log(result);
        if(result == null) { //회원 가입 id가 중복되면 회원가입 실패 페이지 띄우기
            res.render('registerFail');
        }
        else {
            res.render('registerComplete', { data: result }); //회원가입이 정상적으로 되면 완료페이지 띄우기
        }
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

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
