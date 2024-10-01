const SERVER_URL = "http://localhost:3001";

//Login
const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/users/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

//Logout
const logOut = async () => {
    const response = await fetch(SERVER_URL + '/api/users/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

//Get memes
const getMemes = async () => {
    const response = await fetch(SERVER_URL + '/api/memes/', {
        credentials: 'include',
    });
    const memes = await response.json();
    if (response.ok) {
        return memes;
    } else {
        throw memes;
    }
}

//Check answer
const checkCaption = async (memeId) => {
    const response = await fetch(SERVER_URL + '/api/memes/caption', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memeId })
    });

    if (!response.ok) {
        const errMessage = await response.json();
        throw errMessage;
    } else {
        const res = await response.json();
        return res;
    }
}

//Add Match
const addMatch = async (match, rounds) => {
    const response = await fetch(`${SERVER_URL}/api/matches/${match.userId}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: match.date, totalScore: match.totalScore, rounds: rounds }),
        credentials: 'include'
    });

    if(!response.ok) {
        const errMessage = await response.json();
        throw errMessage;
    } else {
        const obj = await response.json();
        return obj.id;
    }
}

const getGames = async (userId) => {
    const response = await fetch(`${SERVER_URL}/api/matches/${userId}`, {
        credentials: 'include'
    });

    if(!response.ok) {
        const errMessage = await response.json();
        throw errMessage;
    } else {
        const matches = await response.json();
        return matches;
    }
}


const API = { logIn, logOut, getMemes, checkCaption, addMatch, getGames };
export default API;