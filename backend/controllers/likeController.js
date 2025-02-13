const{pool,connectDB} = require("../database/databaseConfig");

exports.likeReview = async (req, res) => {
  try {
    const { review_id } = req.body;
     const user_id = req.user.id;
     const [isLiked] = await pool.query(
       "SELECT * FROM likes WHERE review_id = ? and user_id = ?",
       [review_id,user_id]
     );

     if (isLiked.length != 0) {
       return res.status(404).json({ message: "Already Liked" });
     }

    //  console.log("====================",isLiked,user_id,);
    await pool.query("INSERT INTO likes (user_id, review_id) VALUES (?, ?)", [
      req.user.id,
      review_id,
    ]);
    res.status(201).json({ message: "Review liked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unlikeReview = async (req, res) => {
  try {

      const { review_id } = req.params;
    await pool.query("DELETE FROM likes WHERE user_id = ? AND review_id = ?", [
      req.user.id,
      review_id,
    ]);
    console.log("----------------------", req.user.id, review_id);
    res.status(200).json({ message: "Review unliked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
