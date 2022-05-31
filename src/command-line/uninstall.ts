import log from "../log";
import colors from "chalk";
import {Command} from "commander";
import Config from "../config";
import Utils from "./utils";

const program = new Command("uninstall");
program
	.usage("uninstall <package>")
	.description("Uninstall a theme or a package")
	.on("--help", Utils.extraHelp)
	.action(function (packageName) {
		const fs = require("fs");
		const path = require("path");

		const packagesConfig = path.join(Config.getPackagesPath(), "package.json");
		const packages = JSON.parse(fs.readFileSync(packagesConfig, "utf-8"));

		if (
			!packages.dependencies ||
			!Object.prototype.hasOwnProperty.call(packages.dependencies, packageName)
		) {
			log.warn(`${colors.green(packageName)} is not installed.`);
			process.exit(1);
		}

		log.info(`Uninstalling ${colors.green(packageName)}...`);

		return Utils.executeYarnCommand("remove", packageName)
			.then(() => {
				log.info(`${colors.green(packageName)} has been successfully uninstalled.`);
			})
			.catch((code) => {
				log.error(`Failed to uninstall ${colors.green(packageName)}. Exit code: ${code}`);
				process.exit(1);
			});
	});

export default program;