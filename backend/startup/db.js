import { logger } from "./logging";
import config from "config";

export default function(mongoose){
    const db = config.get("db");
    mongoose.connect(db)
        .then(() => logger.info(`Connected to ${db}...`))
        .catch(()=> logger.info(`Can not connect to ${db}...`));
}
