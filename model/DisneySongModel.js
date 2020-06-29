var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/example';
var ObjectID = require('mongodb').ObjectID;

var db;

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, database) {
    if (err) {
        console.error('MongoDB 연결 실패', err);
        return;
    }
    // mongodb 버전 3.0이상을 사용할 때는, connection을 할 때에 database명을 명시해야함
    db = database.db('example');
});

class DisenySong {}

// Login(로그인)
DisenySong.showLogin = async (user) => {
    console.log(await db.collection('user').findOne({ registerId: user.loginId, registerPw: user.loginPw }));
    return await db.collection('user').findOne({ registerId: user.loginId, registerPw: user.loginPw });
}

// Register (회원 가입)
DisenySong.addRegister = async (registerId, registerPw, registerName, registerEmail) => {
    const data = { registerId, registerPw, registerName, registerEmail };
    try {
        const returnValue = await userOneAdd(data);
        return returnValue;
    } catch (error) {
        console.error(error);
    }
}

// Register (회원 가입 : 실제 입력된 값 db에 추가)
async function userOneAdd(user) {
    try {
        let userData = await db.collection('user').insertOne({
            registerId: user.registerId,
            registerPw: user.registerPw,
            registerName: user.registerName,
            registerEmail: user.registerEmail
        }, { logging: false });
        const newUser = userData;
        console.log('입력된 데이터 : ', newUser);
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

// Read (전체 조회)
DisenySong.getSongList = async () => {
    return await db.collection('song').find({}).toArray();
}

// Read Detail (id값 별 상세 조회)
DisenySong.getSongDetail = async (Songid) => {
    return await db.collection('song').findOne({ _id: new ObjectID(Songid) });
}

// Add (노래 추가)
DisenySong.addSong = async (OstTitle, MovieTitle, Year, MainC) => {
    const data = { OstTitle, MovieTitle, Year, MainC };
    try {
        const returnValue = await dataOneAdd(data);
        return returnValue;
    } catch (error) {
        console.error(error);
    }
}

// Add : 실제 입력된 값(노래 추가폼) db에 추가
async function dataOneAdd(song) {
    try {
        let songData = await db.collection('song').insertOne({
            OstTitle: song.OstTitle,
            MovieTitle: song.MovieTitle,
            Year: song.Year,
            MainC: song.MainC
        }, { logging: false });
        const newSong = songData;
        console.log('입력된 데이터 : ', newSong);
        return newSong;
    } catch (error) {
        console.log(error);
    }
}

// Delete (노래 삭제)
DisenySong.deleteSong = async (Songid) => {
    try {
        let result = await db.collection('song').deleteOne({ _id: new ObjectID(Songid) });
        console.log('삭제한 id : ', _id);
    } catch (error) {
        console.log(error);
    }
}

// Update (노래 수정)
DisenySong.updateSong = async (Songid, OstTitle, MovieTitle, Year, MainC) => {
    try {
        let ret = await db.collection('song').updateOne({_id: new ObjectID(Songid)}, {$set : {OstTitle: OstTitle, MovieTitle: MovieTitle, Year: Year, MainC: MainC}});
        console.log('ret 값 : ', ret);
        return ret;
    } catch (error) {
        console.log(error);
    }
}

module.exports = DisenySong;