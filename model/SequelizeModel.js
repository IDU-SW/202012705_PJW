var Sequelize = require('sequelize');
const sequelize = new Sequelize('example', 'dev', 'secret', { dialect: 'mysql', host: '127.0.0.1' });

class DisenySong { }

// Table 생성 및 정보 (table 이름 : song)
class ostSong extends Sequelize.Model { }
ostSong.init({
    Songid: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    OstTitle: Sequelize.STRING,
    MovieTitle: Sequelize.STRING,
    Year: Sequelize.INTEGER,
    MainC: Sequelize.STRING,
}, { tableName: 'song', sequelize, timestamps: false });

// 실제 입력된 값(노래 추가폼) db에 추가
async function dataOneAdd(song) {
    try {
        let songData = await ostSong.create({
            OstTitle: song.OstTitle,
            MovieTitle: song.MovieTitle,
            Year: song.Year,
            MainC: song.MainC
        }, { logging: false });
        const newSong = songData.dataValues;
        console.log('입력된 데이터 : ', newSong);
        return newSong;
    } catch (error) {
        console.log(error);
    }
}

// List (리스트 조회)
DisenySong.getSongList = async () => {
    let conn;
    await ostSong.findAll({}).then(results => {
        for (var song of results) {
            console.log('id값 : ', song.Songid, ' 노래제목 : ', song.OstTitle);
        }
        returnValue = results;
    })
        .catch(error => {
            console.log('조회 오류 : ', error);
        });
    return returnValue;
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

// Detail (리스트 상세조회)
DisenySong.getSongDetail = async (Songid) => {
    try {
        const ret = await ostSong.findAll({
            where: { Songid: Songid }
        });
        if (ret) {
            return ret[0];
        }
        else {
            console.log('상세 조회할 데이터가 없습니다');
        }
    }
    catch (error) {
        console.log('상세 조회 오류 : ', error);
    }
}

// Delete (노래 삭제)
DisenySong.deleteSong = async (Songid) => {
    try {
        let result = await ostSong.destroy({ where: { Songid: Songid } });
        console.log('삭제한 id : ', Songid);
    } catch (error) {
        console.log(error);
    }
}

// Update (노래 수정) : 09/Basic의 update.js 참고
DisenySong.updateSong = async (Songid, OstTitle, MovieTitle, Year, MainC) => {
    try {
        let ostsong = await DisenySong.getSongDetail(Songid) // 기존 데이터 조회

        ostsong.OstTitle = !OstTitle ? ostsong.OstTitle : OstTitle;
        ostsong.MovieTitle = !MovieTitle ? ostsong.MovieTitle : MovieTitle;
        ostsong.Year = !Year ? ostsong.Year : Year;
        ostsong.MainC = !MainC ? ostsong.MainC : MainC;
        console.log('저장확인 : ', ostsong);
        let ret = await ostsong.save(); // db 저장
        console.log('ret 값 : ', ret);
        return ret;
    } catch (error) {
        console.log(error);
    }
}

module.exports = DisenySong;