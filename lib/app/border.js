Meteor.methods({
    //Method for toggling the border state
    'setBorderState': function (currentId, attribute) {
        //Find the current plate
        var currentPlate = Plate.findOne({ _id: currentId });
        if (currentPlate) {
            //If the border is closed
            if (currentPlate[attribute]) {
                //Create a pseudo object
                var pseudoObject = {};

                //Add the current key with the value
                pseudoObject[attribute] = false;

                //Update the Document
                Plate.update(currentId, { $set: pseudoObject }, {validationContext: "updateBorder"});
            //If the border is opened
            } else {
                //Create a pseudo object
                var pseudoObject = {};

                //Add the current key with the value
                pseudoObject[attribute] = true;

                //Update the document
                Plate.update(currentId, { $set: pseudoObject }, {validationContext: "updateBorder"});
            }
        }
    }
});
