"use strict";

const Path = require("path");

let Config;
if (typeof process.pkg === "undefined") {
	Config = require(Path.join(__dirname, "..", "config.json"));
} else {
	// For pkg
	Config = require(Path.resolve(process.execPath, "../", "config.json"));
}

process.env.TZ = Config.application.timezone;

const Async = require("async");

const Https = require("https");

const Http = require("http");

const Fs = require("fs");

const Axios = require("axios");

const Knex = require("knex");

const Moment = require("moment");

const Bunyan = require("bunyan");

const RotatingFileStream = require("bunyan-rotating-file-stream");

const Express = require("express");

const BodyParser = require("body-parser");

const BearerToken = require("express-bearer-token");

const Multer = require("multer");

//const Mqtt = require(Path.join(__dirname, 'mqtt.js'));

//const CarPlateChecker = require(Path.join(__dirname, 'car-plate-checker.js'));

//const Startup = require(Path.join(__dirname, 'startup.js'));
// const Startup = require("./startup.js");

//const SCron = require(Path.join(__dirname, 'cron.js'));
// const SCron = require("./cron.js");

//const FBAdmin = require('firebase-admin');

const Upload = Multer({
	storage: Multer.diskStorage({
		destination: function (req, file, callback) {
			//const path = Path.join(__dirname, 'tmp');
			let path;
			if (typeof process.pkg === "undefined") {
				path = Path.join(__dirname, "tmp");
			} else {
				// For pkg
				path = Path.resolve(process.execPath, "../", "tmp");
			}

			if (!Fs.existsSync(path)) {
				Fs.mkdirSync(path);
			}

			return callback(null, path);
		},

		filename: function (req, file, callback) {
			return callback(null, Math.random().toString(16).slice(2));
		},
	}),
});

const App = Express();

const AppContext = {};

/**
 * main task
 */
(() => {
	// tasks
	const jobs = [];

	// setup config
	jobs.push((next) => {
		// add to context
		AppContext.config = Config;

		// do next
		return next(undefined);
	});

	// setup middleware
	jobs.push((next) => {
		// limit size
		App.use(Express.json({ limit: "5mb" }));

		// serve static files
		//App.use(Express.static(Path.join(__dirname, 'dist')));

		// parse bearer token from header
		App.use(BearerToken());

		// parse application/json
		App.use(BodyParser.json());

		// parse application/x-www-form-urlencoded
		App.use(
			BodyParser.urlencoded({
				extended: false,
			})
		);

		// do next
		return next(undefined);
	});

	/*
	// Import the functions you need from the SDKs you need
	import { initializeApp } from "firebase/app";
	import { getAnalytics } from "firebase/analytics";
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
	  apiKey: "AIzaSyA41tYH3giH7i6AvZgv2TnFeHNV1g47m-o",
	  authDomain: "lam-tin-tunnel.firebaseapp.com",
	  projectId: "lam-tin-tunnel",
	  storageBucket: "lam-tin-tunnel.appspot.com",
	  messagingSenderId: "682757351171",
	  appId: "1:682757351171:web:da44c84ccc958d692b2b36",
	  measurementId: "G-PRD26DDMRS"
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	*/

	// setup firebase
	// jobs.push(next => {

	// 	// initialize firebase app
	// 	FBAdmin.initializeApp({

	// 		// credential information
	// 		credential: FBAdmin.credential.cert(Path.join(__dirname, '..', 'google-firebase-service-account-key.json'))
	// 	});

	// 	// do next
	// 	return next(undefined);
	// });

	// setup bunyan
	jobs.push((next) => {
		// create file if not exist
		//const logPath = "./log/logging.log";
		let logPath;
		if (typeof process.pkg === "undefined") {
			logPath = Path.join(__dirname, "log", "logging.log");
		} else {
			// For pkg
			logPath = Path.resolve(process.execPath, "../", "log", "logging.log");
		}

		Fs.promises
			.mkdir(Path.dirname(logPath), { recursive: true })
			.catch(console.error);

		// setup bunyan logger
		const log = Bunyan.createLogger({
			name: "app",

			time: new Date(),

			streams: [
				{
					stream: process.stdout,
				},
				{
					stream: new RotatingFileStream({
						level: "trace",
						path: logPath,
						period: "1d", // daily rotation
						totalFiles: 30, // keep up to 10 back copies
						rotateExisting: true, // Give ourselves a clean file when we start up, based on period
						threshold: "10m", // Rotate log files larger than 10 megabytes
						totalSize: "20m", // Don't keep more than 20mb of archived log files
						gzip: true, // Compress the archive log files to save space
					}),
				},
			],
		});

		// 	// Convert time to current timezone (Only return startup time)
		// 	//log.fields.time = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

		// 	// add to context
		AppContext.log = log;

		// 	// do next
		return next(undefined);
	});

	// setup knex
	jobs.push((next) => {
		// prepare knex
		const knex = Knex({
			client: "mysql",

			// debug: true,

			pool: {
				min: 1,

				max: 10,
			},

			connection: {
				host: Config.application.database.host,
				port: Config.application.database.port,
				user: Config.application.database.user,
				password: Config.application.database.pass,
				database: Config.application.database.name,
			},
		});

		// add to context
		AppContext.knex = knex;

		// add ricky db to knex
		// {
		// 	const knex = Knex({

		// 		client: 'mysql2',

		// 		// debug: true,

		// 		pool: {

		// 			min: 1,

		// 			max: 10
		// 		},

		// 		connection: {

		// 			host: Config.application.cameraDatabase.host,

		// 			port: Config.application.cameraDatabase.port,

		// 			user: Config.application.cameraDatabase.user,

		// 			password: Config.application.cameraDatabase.pass,

		// 			database: Config.application.cameraDatabase.name
		// 		}
		// 	});

		// 	// add to context
		// 	AppContext.knexCamera = knex;
		// }

		// do next
		return next(undefined);
	});

	// setup database
	// jobs.push((next) => {
	// 	// load updater
	// 	//const dbUpdater = require(Path.join(__dirname, 'database', 'main.js'));
	// 	const dbUpdater = require("./database/main.js");

	// 	// do update
	// 	dbUpdater

	// 		.doUpdate(AppContext)

	// 		.then(() => next(undefined));

	// 	//.catch(err => next(err));
	// });

	// setup router (v1)
	jobs.push((next) => {
		// base api path
		const baseApiPath = "/api/v1";

		// base controller path
		const baseControllerPath = Path.join(__dirname, "controllers", "api", "v1");

		// routes
		const routes = [
			// {

			// 	methods: ['POST'],

			// 	path: baseApiPath + '/do-test-import-many-records',

			// 	controllerPath: Path.join(baseControllerPath, 'do-test-import-many-records.js')
			// },
			{
				methods: ["POST"],

				path: baseApiPath + "/do-login",

				controllerPath: Path.join(baseControllerPath, "do-login.js"),
			},
		];

		// create routes
		routes.forEach((m) => {
			// raw module handler
			let moduleHandler = require(m.controllerPath);

			// use execute method
			if (
				typeof moduleHandler === "object" &&
				typeof moduleHandler.execute === "function"
			) {
				moduleHandler = moduleHandler.execute;
			}

			// create context for module handler
			const handlers = [
				(request, response, next) => {
					// log
					AppContext.log.info("// " + request.method + " --> " + m.path);

					// log
					AppContext.log.info(
						JSON.stringify({
							...request.query,

							...request.body,
						})
					);

					// do real module handler action
					return moduleHandler(
						{
							request: request,

							rawResponse: response,

							response: {
								...response,

								send: (p1) => {
									// log
									//AppContext.log.info(JSON.stringify(p1));

									// send
									return response.send(p1);
								},
							},

							...AppContext,
						},
						next
					);
				},
			];

			// is upload files
			if (m.uploadFiles === true) {
				// add multer for handle files upload
				handlers.unshift(Upload.any());
			}

			// each methods
			m.methods.forEach((mt) => {
				// log
				// AppContext.log.info("prepare: " + mt + " " + m.path);

				// get
				if (mt === "GET") {
					App.get(m.path, ...handlers);
				}

				// post
				if (mt === "POST") {
					App.post(m.path, ...handlers);
				}

				// delete
				if (mt === "DELETE") {
					App.delete(m.path, ...handlers);
				}

				// patch
				if (mt === "PATCH") {
					App.patch(m.path, ...handlers);
				}
			});
		});

		// static files
		App.use(Express.static(Path.join(__dirname, "dist")));
		if (typeof process.pkg !== "undefined") {
			// For pkg uploads file
			App.use(Express.static(Path.resolve(process.execPath, "../", "dist")));
		}

		// route to index.html
		App.get("*", (req, res) => {
			// get single page react app
			const file = Fs
				.createReadStream
				// Path.join(__dirname, "dist", "index.html")
				();

			// send file
			file.pipe(res);
		});

		// do next
		return next(undefined);
	});

	// start http server
	jobs.push((next) => {
		// create server
		const httpServer = Http.createServer(App);

		// add to context
		AppContext.httpServer = httpServer;

		// start server
		httpServer.listen(Config.application.ports.http);

		// log
		AppContext.log.info(
			"http service started at port: " + Config.application.ports.http
		);

		// do next
		return next(undefined);
	});

	// start https server
	jobs.push((next) => {
		// prepare credentials
		let credentials;

		if (typeof process.pkg === "undefined") {
			credentials = {
				key: Path.resolve(
					__dirname,
					"ssl",
					Config.application.ssl.key
				).toString(),

				cert: Path.resolve(
					__dirname,
					"ssl",
					Config.application.ssl.cert
				).toString(),
			};
		} else {
			// For pkg

			credentials = {
				key: Path.resolve(
					process.execPath,
					"../",
					Config.application.ssl.key
				).toString(),

				cert: Path.resolve(
					process.execPath,
					"../",
					Config.application.ssl.cert
				).toString(),
			};
		}

		if (Fs.existsSync(credentials.key) && Fs.existsSync(credentials.cert)) {
			// create https server
			const httpsServer = Https.createServer(
				{
					key: Fs.readFileSync(credentials.key),

					cert: Fs.readFileSync(credentials.cert),
				},
				App
			);

			// add to context
			AppContext.httpsServer = httpsServer;

			// start server
			httpsServer.listen(Config.application.ports.https);

			// log
			// AppContext.log.info(
			// 	"https service started at port: " + Config.application.ports.https
			// );
		}

		// do next
		return next(undefined);
	});

	// start start up
	// jobs.push((next) => {
	// 	// start mqtt
	// 	Startup.start(AppContext);

	// 	// do next
	// 	return next(undefined);
	// });

	// start mqtt
	// jobs.push(next => {

	// 	// start mqtt
	// 	Mqtt.start(AppContext);

	// 	// do next
	// 	return next(undefined);
	// });

	// start cron
	// jobs.push((next) => {
	// 	// start cron
	// 	SCron.start(AppContext);

	// 	// do next
	// 	return next(undefined);
	// });

	// start up
	return Async.waterfall(jobs, (err) => err && AppContext.log.error(err));
})();
