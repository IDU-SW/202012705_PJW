const pool = require('./dbConnection');

class DisenySong {}

// List (리스트 조회)
DisenySong.getSongList = async () => {
    const sql = 'SELECT * FROM song'; //table name

    let conn;
    try {
        conn = await pool.getConnection();
        const [rows, metadata] = await conn.query(sql);
        conn.release();
        return rows;
    } catch (error) {
        console.error(error);
    } finally {
        if ( conn ) conn.release();
    }
}    

// Add (노래 추가)
DisenySong.addSong = async (OstTitle, MovieTitle, Year, MainC) => {
    const sql = 'INSERT INTO song SET ?';
    const data= {OstTitle, MovieTitle, Year, MainC};

    let conn;
    try {
        conn = await pool.getConnection();
        const ret = await conn.query(sql, data);
        console.log(ret);
        const songId = ret[0]['insertId'];
        return songId;
    } catch (error) {
        console.error(error);
    } finally {
        if ( conn ) conn.release();
    }
}

// Detail (리스트 상세조회)
DisenySong.getSongDetail = async (Songid) => {
    const sql = 'SELECT * FROM song WHERE Songid = ?';
    let conn;
    try {        
        conn = await pool.getConnection();
        const [rows, metadata] = await conn.query(sql, Songid);
        conn.release();
        return rows[0];
    } catch (error) {
        console.error(error);
    } finally {
        if ( conn ) conn.release();
    }
}

// Delete (노래 삭제) : 09/Basic의 delete.js 참고
DisenySong.deleteSong = async (Songid) => {
    const sql = 'DELETE FROM song WHERE Songid = ?';
    let conn;
    try {
        conn = await pool.getConnection();        
        const ret = await conn.query(sql, parseInt(Songid));
        return ret[0]['affectedRows'];
    } catch (error) {
        console.error(error);  
    } finally {
        if ( conn ) conn.release();
    }
}

// Update (노래 수정) : 09/Basic의 update.js 참고
DisenySong.updateSong = async (Songid, OstTitle, MovieTitle, Year, MainC) => {
    const sql = 'UPDATE song SET ? WHERE Songid = ?';
    const data = {Songid, OstTitle, MovieTitle, Year, MainC};
    const condition = Songid;

    let conn;
    try {
        conn = await pool.getConnection();
        const ret = await conn.query(sql, [data, condition] );
        const info = ret[0];
        return data; // 수정 완료 페이지에 수정내용 띄우기 위함
    } catch (error) {
        console.error(error);  
    } finally {
        if ( conn ) conn.release();
    }
}

// table 초기화(db)
DisenySong.initModel = async () => {
    // 대문자 에러 날 수 있음 확인 필요
    const sql = 'drop table if exists song; create table song ( Songid int primary key auto_increment, OstTitle varchar(50), MovieTitle varchar(50), Year int, MainC varchar(50));';
    await pool.query(sql);
}

module.exports = DisenySong;