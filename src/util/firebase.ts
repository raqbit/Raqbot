import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

class Firebase {

    /**
     * Database instance
     */
    private database: admin.database.Database;

    constructor(cert: any, dbUrl: string, private functionsUrl: string) {

        admin.initializeApp({
            credential: admin.credential.cert(cert),
            databaseURL: dbUrl,
        });

        this.database = admin.database();
    }

    /**
     * Retrieve the global statistics
     * @return {Promise<any>} - A promise resolving to the global statistics
     */
    public fetchGlobalStats(): Promise<any> {
        const globalRef = this.database.ref('global');
        return new Promise((resolve, reject) => {
            globalRef.on('value',
                (data) => {
                    if (data) {
                        resolve(data.val());
                    } else {
                        reject('snapshot is null');
                    }
                },
                (error: any) => {
                    reject(error);
                });
        });
    }

    public updateData(refName: string, data: any) {
        const ref = this.database.ref(refName);
        ref.update(data);
    }

    public setData(refName: string, data: any) {
        const ref = this.database.ref(refName);
        ref.set(data);
    }

    public incrementNumber(refName: string, value: number) {
        const ref = this.database.ref(refName);
        ref.transaction((currentValue) => {
            return (currentValue || 0) + value;
        });
    }

    public updateWordCount(id: string, word: string) {
        const wordRef = this.database.ref(`wordCount/${id}/word`);
        const scoreRef = this.database.ref(`wordCount/${id}/score`);

        wordRef.set(word);

        scoreRef.transaction((currentValue) => {
            return (currentValue || 0) + 1;
        });
    }

    public async getRating(message: string): Promise<number> {
        const fetchOptions = {
            body: 'message=' + message,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: 'POST',
        };

        let jsonResponse;

        try {
            const res = await fetch(this.functionsUrl + '/rating', fetchOptions);
            jsonResponse = await res.json();
        } catch (e) {
            console.log(e);
            throw new Error('Rating error: Could not connect to function');
        }


        if (jsonResponse.type === "success") {
            return jsonResponse.rating;
        } else {
            throw new Error('Rating error: function did not return rating');
        }
    }
}

export default Firebase;
