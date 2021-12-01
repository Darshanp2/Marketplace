<<<<<<< Updated upstream
const express = require("express");
const app = express();
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");
const session = require("express-session");


const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === 'number')
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    }
});

app.use;
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');


app.use(session({
    name: 'AuthCookie',
    secret: 'Dont Touch Me',
    resave: false,
    saveUninitialized: true
}))

// app.use('/private', (req, res, next) => {
//     if (!req.session.user) {
//         return res.status(403).render("users/error", { title: "You are not logged In", error: "So please log in" });
//     } else {
//         next();
//     }
// });

let m = function(req, res, next) {
    let time = new Date().toUTCString();
    let RM = req.method;
    let RR = req.originalUrl;
    if (!req.session.user) {
        console.log("[" + time + "]: " + RM + " " + RR + " Non-Authenticated User");
    } else {

        console.log("[" + time + "]: " + RM + " " + RR + " Authenticated User");
    }
    next();
}

app.use(m)
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
=======
const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === 'number')
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    }
});
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use;
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
>>>>>>> Stashed changes
});