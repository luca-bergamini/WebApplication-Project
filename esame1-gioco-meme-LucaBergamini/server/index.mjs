// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import userRouter from './routes/userRoutes.mjs';
import memeRouter from './routes/memeRoutes.mjs';
import matchRouter from './routes/matchRoutes.mjs';


// init express
const app = new express();
const port = 3001;

//middleware
app.use(express.json());
app.use(morgan('dev'));
//set up and activate CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true                   //serve per accettare cockie da altri host
};
app.use(cors(corsOptions))

//Inizializzazione della sessione
app.use(session({
  secret: "inizializzando la sessione....",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

//Router per le diverse route
app.use('/api/users', userRouter);
app.use('/api/memes', memeRouter);
app.use('/api/matches', matchRouter);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});