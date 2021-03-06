const db = require("../config/_database");

exports.postUrl = (req, res) => {
  const userId = req.body.userId;
  const url = req.body.url;
  const shortUrl = req.body.shortUrl;

  async function save() {
    const query =
      "INSERT INTO tbl_urls (id_user, url_complete, url_short) VALUES($1, $2, $3)";
    const values = [userId, url, shortUrl];
    await db.query(query, values);
  }

  //verificação se a pessoa ja encurtou o msm link
  db.query("SELECT * FROM tbl_urls WHERE url_complete = $1", [url]).then(
    (result) => {
      if (result.rowCount < 1) {
        save();
        res.send({ saved: true });
      } else {
        res.send({ saved: false });
      }
    }
  );
};

exports.getMyUrls = (req, res) => {
  const userId = req.body.userId;

  const query =
    "SELECT id_url, url_complete, url_short FROM tbl_urls WHERE id_user = $1";

  db.query(query, [userId]).then((result) => res.send(result.rows));
};

exports.deleteUrl = (req, res) => {
  const urlId = req.body.idUrl;

  const query = "DELETE FROM tbl_urls WHERE id_url = $1";
  db.query(query, [urlId]);
  res.send({ deleted: true });
};
