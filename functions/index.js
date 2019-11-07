
const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.rateProduct = functions.firestore.document('rating/{ratingId}')
  .onCreate(doc => {
    const productId = doc.data().productId
    const rating = doc.data().rating
    var productRef = admin.firestore().collection("products").doc(productId);
    return admin.firestore().runTransaction(transaction => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(productRef).then(doc => {
        if (!doc.exists) {
            throw "Document does not exist!";
        }
        let prev_rating = product.data().rating
        let rating_count = product.data().rating_count
        if (!prev_rating) {
          prev_rating = 0
          rating_count = 0
        }
        const new_rating = (((prev_rating / 5 * rating_count) + rating) / (rating_count + 1)) * 5
        transaction.update(productRef, { rating: new_rating, rating_count: rating_count + 1 });
      })
    })
  })


    