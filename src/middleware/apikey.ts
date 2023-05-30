const apikey = (req, res, next) => {
  console.log(req.query);
  if (!req.query.key) {
    res.status(401).send("Missing API Key");
    return;
  }
  if (req.query.key !== process.env.API_KEY) {
    res.status(401).send("Invalid API Key");
    return;
  }
  next();
};

export default apikey;
