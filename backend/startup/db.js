const { logger } = require("./logging");
const config = require("config");

module.exports = function(mongoose){
    const db = config.get("db");
    mongoose.connect(db)
        .then(() => logger.info(`Connected to ${db}...`))
        .catch(()=> logger.info(`Can not connect to ${db}...`));
};
