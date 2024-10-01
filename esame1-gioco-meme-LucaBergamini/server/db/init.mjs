import { db } from "../db/db.mjs";
import { runQuery } from "../db/db.mjs";
import crypto from 'crypto';

const salt1 = crypto.randomBytes(16).toString('hex');
const salt2 = crypto.randomBytes(16).toString('hex');
const password = "test";
const hashedPassword1 = crypto.scryptSync(password, salt1, 16).toString('hex');
const hashedPassword2 = crypto.scryptSync(password, salt2, 16).toString('hex');

db.serialize(() => {
    //Users
    runQuery(`
        CREATE TABLE users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            surname TEXT NOT NULL,
            password TEXT NOT NULL,
            salt TEXT NOT NULL
        )
    `);

    //Memes
    runQuery(`
        CREATE TABLE memes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL UNIQUE
        )
    `);

    //Captions
    runQuery(`
        CREATE TABLE captions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL UNIQUE
        )
    `);

    //CaptionMatchesMeme
    runQuery(`
        CREATE TABLE captionMatchesMeme(
            memeId INTEGER NOT NULL,
            captionId INTEGER NOT NULL,
            PRIMARY KEY (memeId, captionId),
            FOREIGN KEY (memeId) REFERENCES memes(id) ON DELETE CASCADE,
            FOREIGN KEY (captionId) REFERENCES captions(id) ON DELETE CASCADE
        )
    `)

    //MatchHistories
    runQuery(`
        CREATE TABLE matchHistories(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            date DATE NOT NULL,
            totalScore INTEGER NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    //Rounds
    runQuery(`
        CREATE TABLE rounds(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            matchId INTEGER NOT NULL,
            memeId INTEGER NOT NULL,
            captionId INTEGER,
            score INTEGER NOT NULL CHECK (score IN (0,5)),
            FOREIGN KEY (matchId) REFERENCES matchHistories(id) ON DELETE CASCADE,
            FOREIGN KEY (memeId) REFERENCES memes(id) ON DELETE CASCADE,
            FOREIGN KEY (captionId) REFERENCES captions(id) ON DELETE CASCADE
        )
    `);

    //Inserimento utenti
    runQuery(`
        INSERT INTO users (username, name, surname, password, salt) VALUES 
        ('user1', 'test1', 'test1', '${hashedPassword1}', '${salt1}'),
        ('user2', 'test2', 'test2', '${hashedPassword2}', '${salt2}')
    `);

    //Inserimento memes
    runQuery(`
        INSERT INTO memes (url) VALUES
        ('https://i.imgflip.com/8tojof.jpg'),
        ('https://i.imgflip.com/8tojmu.jpg'),
        ('https://i.imgflip.com/8tojjg.jpg'),
        ('https://i.imgflip.com/8toji7.jpg'),
        ('https://i.imgflip.com/8tojg4.jpg'),
        ('https://i.imgflip.com/8tojek.jpg'),
        ('https://i.imgflip.com/8tojd7.jpg'),
        ('https://i.imgflip.com/8tojbz.jpg'),
        ('https://i.imgflip.com/8tojai.jpg'),
        ('https://i.imgflip.com/8toj4t.jpg')
    `);

    //Inserimento Captions
    runQuery(`
        INSERT INTO captions (text) VALUES
        ("Quando finalmente capisci la domanda"),
        ("La mia faccia quando la risposta finalmente arriva"),
        ("Io cercando di evitare i miei problemi"),
        ("Quando i problemi mi inseguono"),
        ("Quando la complessità si trasforma in chiarezza"),
        ("Quando ti dicono che 'non sembri affatto stressato' durante la settimana degli esami"),
        ("Quando esci con il tuo gruppo di amici e sei l'unico che non ha capito la battuta"),
        ("Io cliccando 'Accetto' senza leggere"),
        ("Giovedì: sembra venerdì."),
        ("Il momento in cui capisci che il computer ha preso il controllo"),
        ("Io cercando di far finta di sapere cosa sto facendo"),
        ("Fintanto che sembro sicuro, va tutto bene"),
        ("Quando parlano durante un film"),
        ("Quando ti fanno lo spoiler più atteso"),
        ("Il mio cervello durante l'assemblaggio di IKEA"),
        ("Il momento in cui tutto ha senso"),
        ("Il momento in cui ti accorgi che hai lasciato il telefono a casa"),
        ("Quando ti rendi conto che hai preso l'autobus sbagliato"),
        ("Io mentre guardo una scena epica in un film"),
        ("Quando capisci l'umorismo di un meme dopo un secondo"),
        ("La vita è troppo breve per avere paura"),
        ("Non c'è nessuna strada per la felicità, la felicità è la strada"),
        ("In ogni fallimento si nasconde l'opportunità di imparare"),
        ("La gentilezza è sempre di moda"),
        ("Sii il cambiamento che vuoi vedere nel mondo"),
        ("Non aspettare l'occasione, creala"),
        ("Il segreto del successo è la costanza nel perseguire i propri obiettivi"),
        ("La vita è fatta di momenti, goditi ogni istante"),
        ("Le piccole cose sono le più grandi"),
        ("La felicità non è qualcosa da trovare, è qualcosa da creare"),
        ("Lascia che la tua luce interiore brilli più luminosa di ogni oscurità"),
        ("La vita è una avventura audace o non è niente affatto"),
        ("Sii te stesso, tutti gli altri sono già presi"),
        ("Il segreto per ottenere tutto ciò che vuoi nella vita è chiedere"),
        ("Ogni giorno è una seconda possibilità"),
        ("Non guardare indietro, stai andando nella giusta direzione"),
        ("Lavora sodo in silenzio, lascia che il successo faccia rumore"),
        ("La felicità è un viaggio, non una destinazione"),
        ("La vita è troppo corta per rimpiangere"),
        ("Sogna in grande e osa fallire"),
        ("Non smettere mai di imparare, perché la vita non smette mai di insegnare"),
        ("La gratitudine trasforma ciò che abbiamo in abbondanza"),
        ("L'unica limitazione è quella che tu ti imponi"),
        ("La tua mente è un giardino, coltivala con pensieri positivi"),
        ("Credi in te stesso e sarai invincibile"),
        ("Non si tratta di quanti respiri prendi, ma dei momenti che ti tolgono il respiro"),
        ("La vita è come una bicicletta, per mantenere l'equilibrio devi continuare a muoverti"),
        ("Il tuo unico limite è la tua mente"),
        ("L'ottimismo è la chiave del successo"),
        ("La felicità è una scelta, non una conseguenza")
    `);

    //Inserimento CaptionMatchesMeme
    runQuery(`
        INSERT INTO captionMatchesMeme (memeId, captionId) VALUES
        (1,1),
        (1,2),
        (2,3),
        (2,4),
        (3,5),
        (3,6),
        (4,7),
        (4,8),
        (5,9),
        (5,10),
        (6,11),
        (6,12),
        (7,13),
        (7,14),
        (8,15),
        (8,16),
        (9,17),
        (9,18),
        (10,19),
        (10,20)
    `);
});

db.close();