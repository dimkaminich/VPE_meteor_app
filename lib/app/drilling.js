Meteor.methods({
    //Create drilling
    'addHole': function(currentId) {
        //Get the number of the drilling
        var pos = Drilling.find({plateId: currentId}).count() + 1;

        //Insert the drilling to the database
        Drilling.insert({
            plateId : currentId,
            holename: pos,
            holeX   : 20,
            holeY   : 20,
            holeD   : 6,
            width   : 0,
            height  : 0
        }, { validationContext: "insertDrilling" });

        if (Meteor.isServer) {
            return true;
        }
    },

    //Delete drilling
    'delHole': function(selectedHoleArray, currentId) {
        //Remove the selected drillings from database
        selectedHoleArray.forEach(function(id) { Drilling.remove(id); });

        //Get the ids of undeleted drillings
        var holeArray = Drilling.find({plateId: currentId}, {
            sort  : {holename: 1},
            fields: {_id     : 1},
        }).map(function(el) { return el._id;  });

        //Rename the undeleted drillings
        for (var i = 0; i < holeArray.length; i++) {
            var no = i + 1;
            Drilling.update(holeArray[i], {$set: {
                holename: no
                }
            })
        }

        if (Meteor.isServer) {
            return true;
        }
    },

    //Update the drillings
    'updateHole': function(selectedHoleId, xHole, yHole, dHole, namedC) {
        //Update the inserted drillings
        for (var i = 0; i < selectedHoleId.length; i++) {
            Drilling.update(selectedHoleId[i], {$set: {
                 holeX: xHole[i],
                 holeY: yHole[i],
                 holeD: dHole[i]
            }}, {validationContext: namedC[i]});
        }

        if (Meteor.isServer) {
            return true;
        }
    }
});
