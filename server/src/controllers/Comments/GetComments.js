const Comment = require("../../models/Comment");

const getComments = async (req, res) => {
  try {
    const comentario = await Comment.find()
      .populate("Client") 
      .populate("Professional") 
      .exec();
    res.status(200).json(comentario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving comments" });
  }
};

module.exports = getComments;
