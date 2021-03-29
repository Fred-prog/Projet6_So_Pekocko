const Sauce = require('../models/Sauce');
const fs = require('fs');




exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({ ...sauceObject, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
   likes: "0", dislikes: "0"});
    sauce.save().then(() => {
        res.status(201).json({ message: 'Post saved successfully!' });
      }).catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          const likeObject = req.body;
          const likeVote = likeObject.like;
          const likerId = likeObject.userId;

          switch (likeVote) {
            case 1: {
              if (sauce.userLiked.length == '0' && sauce.userDisliked.length == '0') {
                sauce.likes++;
                sauce.userLiked.push(likerId);
              } else if (sauce.userLiked.length == '0') {
                sauce.userDisliked.forEach(element => {
                  if (likerId == element) {
                    sauce.dislikes--;
                    sauce.userDisliked.splice(element, 1);
                    sauce.likes++;
                    sauce.userLiked.push(likerId);
                  } else {
                    sauce.likes++;
                    sauce.userLiked.push(likerId);
                  }
                });
                } else {
                  sauce.userLiked.forEach(element => {
                    if (likerId == element) {
                      sauce.likes + 0;
                    } else {
                      sauce.likes++;
                      sauce.userLiked.push(likerId);
                    }
                  })
                }
              sauce.save().then(() => {
                res.status(201).json({ message: 'Post saved successfully!' });
              }).catch((error) => res.status(400).json({ error }));
            }
            break;

            case -1: {
              if (sauce.userDisliked.length == '0' && sauce.userLiked.length == '0') {
                sauce.dislikes++;
                sauce.userDisliked.push(likerId);
              } else if (sauce.userDisliked.length == '0') {
                sauce.userLiked.forEach(function ( element, index) {
                  if (likerId == element) {
                    sauce.likes--;
                    sauce.userLiked.splice(index, 1);
                    sauce.dislikes++;
                    sauce.userDisliked.push(likerId);
                  } else {
                    sauce.dislikes++;
                    sauce.userDisliked.push(likerId);
                  }
                });
              } else {
                sauce.userDisliked.forEach(function ( element, index) {
                  if (likerId == element) {
                    sauce.dislikes + 0;
                  } else {
                    sauce.dislikes++;
                    sauce.userDisliked.push(likerId);
                  }
                })
              }
              sauce.save().then(() => {
                res.status(201).json({ message: 'Post saved successfully!' });
              }).catch((error) => res.status(400).json({ error }));
            }
            break;

            case 0: {
              if (sauce.userLiked.length == '0') {
                sauce.userDisliked.forEach(function ( element, index) {
                  if (likerId == element) {
                    sauce.dislikes--;
                    sauce.userDisliked.splice(index, 1);
                  }
                });
              } else if (sauce.userDisliked.length == '0') {
                  sauce.userLiked.forEach(function ( element, index){
                    if (likerId == element) {
                      sauce.likes--;
                      sauce.userLiked.splice(index, 1);
                    } 
                  });
              } else {
                sauce.userDisliked.forEach(function ( element, index) {
                  if (likerId == element) {
                    sauce.dislikes--;
                    sauce.userDisliked.splice(index, 1);
                  } else {
                    sauce.userLiked.forEach(function ( element, index) {
                      if (likerId == element) {
                        sauce.likes--;
                        sauce.userLiked.splice(index, 1);
                      } 
                    });
                  }
                });
              }
              sauce.save().then(() => {
                res.status(201).json({ message: 'Post saved successfully!' });
              }).catch((error) => res.status(400).json({ error }));
            }
            break;
          
            default:
              console.log("pas de like ");
              break;
          }

      })
      .catch(error => res.status(500).json({ error }));
};


exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};
  
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => { 
      res.status(200).json(sauces); 
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};
