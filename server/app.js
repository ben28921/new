"use strict";

const Path = require("path");
// const path = require("path");

let Config;

Config = require(Path.join(__dirname, "..", "config.json"));

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
const { type } = require("os");

const Upload = Multer({
	storage: Multer.diskStorage({
		destination: function (req, file, callback) {
			const path = Path.join(__dirname, "tmp");
			return callback(null, path);
		},
		filename: function (req, file, callback) {
			return callback(null, Math.random().toString(16).slice(2));
		},
	}),
});

const App = Express();

const AppContext = {};

(() => {
	const jobs = [];

	jobs.push((next) => {
		AppContext.config = Config;

		return next(undefined);
	});

	//set up middleware
	jobs.push((next) => {
		App.use(Express.json({ limit: "5mb" }));

		App.use(BearerToken());

		App.use(BodyParser.json());

		App.use(
			BodyParser.urlencoded({
				extended: false,
			})
		);

		return next(undefined);
	});

	//setup bunyan
	jobs.push((next) => {
		const logPath = Path.join(__dirname, "log", "logging.log");

		Fs.promises
			.mkdir(Path.dirname(logPath), { recursive: true })
			.catch(console.error);

		//setup bunyan logger
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

		AppContext.log = log;
		return next(undefined);
	});

	//setup knew
	jobs.push((next) => {
		const knex = Knex({
			client: "mysql",

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

		AppContext.knex = knex;

		return next(undefined);
	});

	jobs.push((next) => {
		//base api path
		const baseApiPath = "/api/v1";

		const baseControllerPath = Path.join(__dirname, "controllers", "api", "v1");

		//routes
		const routes = [
			{
				methods: ["POST"],

				path: baseApiPath + "/do-login",

				controllerPath: Path.join(baseControllerPath, "do-login.js"),
			},
			{
				methods: ["POST"],

				path: baseApiPath + "/c-port",

				controllerPath: Path.join(baseControllerPath, "c-port.js"),
			},
		];

		//create routes
		routes.forEach((m) => {
			//raw module handler
			let moduleHandler = require(m.controllerPath);

			//use execute method
			if (
				typeof moduleHandler === "object" &&
				typeof moduleHandler.execute === "function"
			) {
				moduleHandler = moduleHandler.execute;
			}

			//create context for module handler
			const handlers = [
				(request, response, next) => {
					AppContext.log.info("//" + request.method + "-->" + m.path);

					AppContext.log.info(
						JSON.stringify({ ...request.query, ...request.body })
					);

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

			//is upload files
			if (m.uploadFiles === true) {
				//add multer for handle files upload
				handlers.unshift(Upload.any());
			}

			//each methods
			m.methods.forEach((mt) => {
				//get
				if (mt === "GET") {
					App.get(m.path, ...handlers);
				}
				//post
				if (mt === "POST") {
					App.post(m.path, ...handlers);
					console.log("handle", ...handlers);
				}
				//delete
				if (mt === "DELETE") {
					App.delete(m.path, ...handlers);
				}
				//patch
				if (mt === "PATCH") {
					App.patch(m.path, ...handlers);
				}
			});
		});

		//static files
		//react add
		App.use(Express.static(Path.join(__dirname, "dist")));
		if (typeof process.pkg !== "underfined") {
			//For pkg uploads file
			App.use(Express.static(Path.resolve(process.execPath, "../", "dist")));
		}

		//route to index.html
		//.htaccess
		App.get("*", (req, res) => {
			//get single page react app
			const file = Fs.createReadStream(
				Path.join(__dirname, "dist", "index.html")
			);

			file.pipe(res);
		});
		return next(undefined);
	});

	//start http server
	jobs.push((next) => {
		//create server
		const httpServer = Http.createServer(App);

		//add to context
		AppContext.httpServer = httpServer;

		//start server
		httpServer.listen(Config.application.ports.http);

		//log
		AppContext.log.info(
			"http service started at port:" + Config.application.ports.http
		);

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

	//start up
	return Async.waterfall(jobs, (err) => err && AppContext.log.error(err));
})();
