const TABLES = require("../../.conf/.conf_tables")
const SRT = require("../../.conf/.conf_database")
const emailServices = require("../modules/email");
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class Security {

  decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  encrypt = (param) => {
    const text = param.toString();
    return CryptoJS.AES.encrypt(text, process.env.SECRET_KEY).toString();
  };

  EmailActivation = async (email) => {
    const CONNECTION = await SRT.getConnection()
    const QUERY = [`SELECT ${TABLES.COMPANY.COLUMN.PASS_ID} FROM ${TABLES.COMPANY.TABLE} WHERE ${TABLES.COMPANY.COLUMN.EMAIL} = ?`]
    const PARAMS = [[email]]
    try {
      const [raw] = await CONNECTION.query(QUERY[0], PARAMS[0])
      if (raw.length > 0 && raw[0]["PASS_ID"]) {
        const PASS_ID = raw[0]["PASS_ID"]
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '5m' });
        const currentTime = new Date();
        const expirationTime = new Date(currentTime.getTime() + 5 * 60000);
        const formattedExpirationTime = `${expirationTime.getHours()}:${expirationTime.getMinutes().toString().padStart(2, '0')}`;

        await emailServices.sendEmail(email, "Syikha Report Ticketing Email Activation", `Klik this link to finish registration :\n\n${process.env.URL}/api/get/company/registration/c/${PASS_ID}?token=${token} \n\nThis link will be valid until ${formattedExpirationTime}`)
        return
      }
      throw new Error("Email is not valid")
    } catch (error) {
      throw error
    } finally {
      CONNECTION.release()
    }
  }

  isEmailExist = async (email) => {
    const CONNECTION = await SRT.getConnection()
    const QUERY = [`SELECT ${TABLES.COMPANY.COLUMN.EMAIL} FROM ${TABLES.COMPANY.TABLE} WHERE ${TABLES.COMPANY.COLUMN.EMAIL} = ?`]
    const PARAMS = [[email]]

    try {
      const [result] = await CONNECTION.query(QUERY[0], PARAMS[0])
      if (result.length > 0) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw error
    } finally {
      CONNECTION.release()
    }
  }

  login = async (email, password) => {
    const CONNECTION = await SRT.getConnection();
    const QUERY_COMPANY = `SELECT * FROM ${TABLES.COMPANY.TABLE} WHERE ${TABLES.COMPANY.COLUMN.EMAIL} = ?`;
    const QUERY_USER = `SELECT * FROM ${TABLES.USER.TABLE} WHERE ${TABLES.USER.COLUMN.EMAIL} = ?`;
    const PARAMS = [email];

    try {
      let [result] = await CONNECTION.query(QUERY_COMPANY, PARAMS);

      if (result.length > 0) {
        const isMatch = await bcrypt.compare(password, result[0][TABLES.COMPANY.COLUMN.PASSWORD]);
        if (isMatch) {
          if (result[0][TABLES.COMPANY.COLUMN.STATUS] == 'ACTIVE') {
            return {
              cId: this.encrypt(result[0][TABLES.COMPANY.COLUMN.ID]), //Company Id
              cName: result[0][TABLES.COMPANY.COLUMN.NAME], //Company Name
              passC: this.encrypt(result[0][TABLES.COMPANY.COLUMN.PASS_ID]), //Company Pass Code
              jwtToken: jwt.sign({ email: result[0][TABLES.COMPANY.COLUMN.EMAIL] }, process.env.SECRET_KEY, { expiresIn: '1d' })
            };
          } else {
            throw new Error("Please finish your registration")
          }
        } else {
          throw new Error("Invalid password")
        }
      }

      [result] = await CONNECTION.query(QUERY_USER, PARAMS);

      if (result.length > 0) {
        const isMatch = await bcrypt.compare(password, result[0][TABLES.USER.COLUMN.PASSWORD]);
        if (isMatch) {
          return {
            cId: this.encrypt(result[0][TABLES.USER.COLUMN.COMPANY_ID]), //Users Company Id
            uId: this.encrypt(result[0][TABLES.USER.COLUMN.ID]), //User Id
            uName: result[0][TABLES.USER.COLUMN.USERNAME], //Company Name
            jwtToken: jwt.sign({ email: result[0][TABLES.USER.COLUMN.EMAIL] }, process.env.SECRET_KEY, { expiresIn: '1d' })
          };
        } else {
          throw new Error("Invalid password")
        }
      }

      return { success: false, message: 'Email not found' };
    } catch (error) {
      throw error;
    } finally {
      CONNECTION.release();
    }
  };

  verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      next();
    });
  };
}

module.exports = Security