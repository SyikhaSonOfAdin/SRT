const { emailServices } = require("../modules/email");
const TABLES = require("../../.conf/.conf_tables")
const SRT = require("../../.conf/.conf_database")
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
    const QUERY_USER = `SELECT U.*, C.${TABLES.COMPANY.COLUMN.NAME} FROM ${TABLES.USER.TABLE} AS U JOIN ${TABLES.COMPANY.TABLE} AS C ON U.${TABLES.USER.COLUMN.COMPANY_ID} = C.${TABLES.COMPANY.COLUMN.ID} WHERE U.${TABLES.USER.COLUMN.EMAIL} = ?`;
    const PARAMS = [email];

    try {
      let [companyResult] = await CONNECTION.query(QUERY_COMPANY, PARAMS);
      let [userResult] = await CONNECTION.query(QUERY_USER, PARAMS);

      if (companyResult.length > 0 && userResult.length > 0) {
        // Email found in both tables
        const company = companyResult[0];
        const user = userResult[0];

        const isCompanyPasswordMatch = await bcrypt.compare(password, company[TABLES.COMPANY.COLUMN.PASSWORD]);
        const isUserPasswordMatch = await bcrypt.compare(password, user[TABLES.USER.COLUMN.PASSWORD]);

        if (isCompanyPasswordMatch && isUserPasswordMatch) {
          if (company[TABLES.COMPANY.COLUMN.STATUS] == 'ACTIVE') {
            return {
              cId: this.encrypt(company[TABLES.COMPANY.COLUMN.ID]), // Company Id
              cName: company[TABLES.COMPANY.COLUMN.NAME], // Company Name
              passC: this.encrypt(company[TABLES.COMPANY.COLUMN.PASS_ID]), // Company Pass Code
              uId: this.encrypt(user[TABLES.USER.COLUMN.ID]), // User Id
              uName: user[TABLES.USER.COLUMN.USERNAME], // Username
              jwtToken: jwt.sign({ email: company[TABLES.COMPANY.COLUMN.EMAIL] }, process.env.SECRET_KEY, { expiresIn: '1d' })
            };
          } else {
            throw new Error("Please finish your registration");
          }
        } else {
          throw new Error("Invalid password");
        }
      } else if (userResult.length > 0) {
        // Email found only in user table
        const user = userResult[0];
        const isMatch = await bcrypt.compare(password, user[TABLES.USER.COLUMN.PASSWORD]);

        if (isMatch) {
          return {
            cId: this.encrypt(user[TABLES.USER.COLUMN.COMPANY_ID]), // Users Company Id
            cName: user[TABLES.COMPANY.COLUMN.NAME], // Users Company Id
            uId: this.encrypt(user[TABLES.USER.COLUMN.ID]), // User Id
            uName: user[TABLES.USER.COLUMN.USERNAME], // User Name
            jwtToken: jwt.sign({ email: user[TABLES.USER.COLUMN.EMAIL] }, process.env.SECRET_KEY, { expiresIn: '1d' })
          };
        } else {
          throw new Error("Invalid password");
        }
      } else {
        return { status: false, message: 'Email not found' };
      }
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
      if (err) return res.status(403).json({ message: 'Expired token, please login again!' });
      next();
    });
  };

  verifyUser = async (req, res, next) => {
    const { companyId, userId } = req.body

    if (!companyId || !userId) return res.status(400).json({ message: "Invalid parameters" });

    const decryptedCompanyId = this.decrypt(companyId)
    const decryptedUserId = this.decrypt(userId)

    if (!decryptedCompanyId || !decryptedUserId) return res.status(400).json({ message: "Invalid parameters" });

    const CONNECTION = await SRT.getConnection()

    const QUERY = [
      `SELECT 1 FROM ${TABLES.USER.TABLE} AS U 
      WHERE U.${TABLES.USER.COLUMN.ID} = ? AND U.${TABLES.USER.COLUMN.COMPANY_ID} = ?`
    ]
    const PARAMS = [[decryptedUserId, decryptedCompanyId]]
    try {
      const [USER] = await CONNECTION.query(QUERY[0], PARAMS[0])

      if (USER.length) {
        req.body.companyId = decryptedCompanyId
        req.body.userId = decryptedUserId
        next()
      } else {
        res.status(403).json({
          message: "Forbidden to access this resource"
        })
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    } finally {
      CONNECTION.release()
    }
  }
}

module.exports = Security