const mysql = require('mysql');

class MySQLConnector {
    constructor(config) {
        this.config = config;
        this.connection = null;
    }

    async connect() {
        this.connection = mysql.createConnection(this.config);
        
        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async disconnect() {
        if (this.connection) {
            this.connection.end();
            this.connection = null;
        }
    }
}
module.exports = MySQLConnector;