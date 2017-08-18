import admin = require('firebase-admin');

class Firebase {

    /**
     * Database instance
     */
    private database: admin.database.Database;

    constructor(cert: any, url: string) {


        admin.initializeApp({
            credential: admin.credential.cert(cert),
            databaseURL: url
        });

        this.database = admin.database();
    }

    /**
     * Retrieve the global statistics
     * @return {Promise<any>} - A promise resolving to the global statistics
     */
    fetchGlobalStats(): Promise<any> {
        const globalRef = this.database.ref('global');
        return new Promise((resolve, reject) => {
            globalRef.on('value',
                (data) => {
                    if (data) {
                        resolve(data.val());
                    } else {
                        reject('snapshot is null')
                    }
                },
                (error: any) => {
                    reject(error);
                });
        });
    }

    updateData(refName: string, data: any) {
        const ref = this.database.ref(refName);
        ref.update(data);
    }

    setData(refName: string, data: any) {
        const ref = this.database.ref(refName);
        ref.set(data);
    }

    incrementNumber(refName: string, value: number) {
        const ref = this.database.ref(refName);
        ref.transaction((current_value) => {
            return (current_value || 0) + value;
        });
    }

    updateWordCount(id: string, word: string) {
        const wordRef = this.database.ref(`wordCount/${id}/word`);
        const scoreRef = this.database.ref(`wordCount/${id}/score`);

        wordRef.set(word);

        scoreRef.transaction((current_value) => {
            return (current_value || 0) + 1;
        });
    }
}

export = Firebase;
