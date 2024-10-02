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

  EmailActivationLink = async (email, passId) => {
    try {
      const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '5m' });
      const currentTime = new Date();
      const expirationTime = new Date(currentTime.getTime() + 5 * 60000);
      const formattedExpirationTime = `${expirationTime.getHours()}:${expirationTime.getMinutes().toString().padStart(2, '0')}`;

      await emailServices.sendEmail(email, "Syikha Report Ticketing Email Activation", `Klik this link to finish registration :\n\n${process.env.URL}/api/get/company/registration/c/${passId}?token=${token} \n\nThis link will be valid until ${formattedExpirationTime}`)
    } catch (error) {
      throw error
    }
  }

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
    const QUERY_USER = `
        SELECT 
            U.*, 
            C.${TABLES.COMPANY.COLUMN.STATUS} AS STATUS,  
            C.${TABLES.COMPANY.COLUMN.NAME} AS companyName, 
            C.${TABLES.COMPANY.COLUMN.PASS_ID} AS passId
        FROM ${TABLES.USER.TABLE} AS U 
        JOIN ${TABLES.COMPANY.TABLE} AS C 
        ON U.${TABLES.USER.COLUMN.COMPANY_ID} = C.${TABLES.COMPANY.COLUMN.ID} 
        WHERE U.${TABLES.USER.COLUMN.EMAIL} = ?;
    `;
    const QUERY_PRIVILEGES = `
        SELECT *
        FROM ${TABLES.LIST_PRIVILEGE.TABLE}
        WHERE ${TABLES.LIST_PRIVILEGE.COLUMN.USER_ID} = ?;
    `;
    const PARAMS = [email];

    try {
      // Mendapatkan informasi user dan perusahaan
      const [userResult] = await CONNECTION.query(QUERY_USER, PARAMS);

      if (userResult.length > 0) {
        const user = userResult[0];
        const isPasswordMatch = await bcrypt.compare(password, user[TABLES.USER.COLUMN.PASSWORD]);

        if (isPasswordMatch) {
          if (user[TABLES.COMPANY.COLUMN.STATUS] === 'ACTIVE') {
            // Mendapatkan privileges untuk user
            const [privilegesResult] = await CONNECTION.query(QUERY_PRIVILEGES, [user[TABLES.USER.COLUMN.ID]]);

            // Mengumpulkan privileges ke dalam satu objek
            const privileges = privilegesResult.reduce((acc, privilege) => {
              acc[privilege.TABLE] = {
                can_create: privilege[TABLES.LIST_PRIVILEGE.COLUMN.CAN_CREATE],
                can_read: privilege[TABLES.LIST_PRIVILEGE.COLUMN.CAN_READ],
                can_update: privilege[TABLES.LIST_PRIVILEGE.COLUMN.CAN_UPDATE],
                can_delete: privilege[TABLES.LIST_PRIVILEGE.COLUMN.CAN_DELETE],
              };
              return acc;
            }, {});

            return {
              cId: this.encrypt(user[TABLES.USER.COLUMN.COMPANY_ID]), // Company Id
              cName: user.companyName, // Company Name
              passC: this.encrypt(user.passId), // Company Pass Code
              uId: this.encrypt(user[TABLES.USER.COLUMN.ID]), // User Id
              uName: user[TABLES.USER.COLUMN.USERNAME], // Username
              jwtToken: jwt.sign({ email: user[TABLES.USER.COLUMN.EMAIL] }, process.env.SECRET_KEY, { expiresIn: '7d' }),
              version: "1.2.7",
              privileges: privileges, // User Privileges
            };
          } else {
            throw new Error("Please finish your registration");
          }
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
    const token = req.headers['authorization'] || req.query.token

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

  verifyPrivilege = (table, action) => {
    return async (req, res, next) => {
      const CONNECTION = await SRT.getConnection()

      try {
        // const userId = this.decrypt(req.params.userId || req.body.uId)
        // const userId = req.body.userId
        const userId = req.body.userId || this.decrypt(req.params.userId)
        // if (req.params.userId) {
        //   userId = this.decrypt(req.params.userId)          
        // } else if (req.body.userId) {
        //   userId = req.body.userId
        // }
        
        const QUERY = [
          `SELECT * FROM ${TABLES.LIST_PRIVILEGE.TABLE} WHERE ${TABLES.LIST_PRIVILEGE.COLUMN.USER_ID} = ?`
        ]
        const PARAMS = [[userId]]
        const [privileges] = await CONNECTION.query(QUERY[0], PARAMS[0])

        let hasPrivilege = false;

        privileges.forEach((privilege) => {
          if (privilege[TABLES.LIST_PRIVILEGE.COLUMN.TABLE] === table) {
            if (privilege[action]) {
              hasPrivilege = true;
              next(); // Panggil next jika ditemukan privilege yang sesuai
            }
          }
        });

        if (!hasPrivilege) {
          return res.status(403).json({
            message: "Not Authorized"
          });
        }
      } catch (error) {
        res.status(500).json({
          message: error.message
        })
      } finally {
        CONNECTION.release()
      }
    }
  }
}

module.exports = Security