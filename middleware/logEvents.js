//SUNUCU TARAFINDA OLUŞAN İÇ İŞLEYİŞİ TAKİP ETMEK İÇİN KULLANIYROUZ.

const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;

const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "dd.MM.yyyy\tHH.mm.ss"); //ters / ile tab bırakmak için kullanıyoruz
  const logItem = `${dateTime}\t${uuid()}\t${message}`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.log(err);
  }
};

logEvents("Bu origine izin verilmedi", "errLog.log");

//Request loglama middleware

const logger = (req, res, next) => {
  const message = `${req.method}\t${req.url}\t${req.headers.origin}`;
  logEvents(message, "reqLog.log");
  next();
};

module.exports = { logEvents, logger };
