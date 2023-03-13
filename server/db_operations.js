import mysql from "mysql";
import express from "express";

class DBConnection {
    connection;

    // Constructor
    constructor (host, user, password, database) {
        this.connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });
    }

    connnectDB(){
        this.connection.connect();
    }

    // Query Method
    queryDB(sqlQuery, callabck) {
        this.connection.query(sqlQuery, function (err, result) {
            if (err) throw err;
            return callabck(result);
        });
    }
    
    // Destructor
    destructor(){
        this.connection.end();
    }
}

export default DBConnection;
