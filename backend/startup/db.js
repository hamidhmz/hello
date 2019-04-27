import winston from "winston";
import config from "config";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logFile.log' })
    ]
});
export default function(mongoose){
    const db = config.get("db");
    mongoose.connect(db)
        .then(() => logger.info(`Connected to ${db}...`));
}
