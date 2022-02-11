Meteor.methods({
    //Create cut
    'addCut': function(currentId, cuttingClassId, direction) {
        var currentPlate = Plate.findOne({_id: currentId});

        //Get the number of the cuts
        var pos = Cutting.find({plateId: currentId}).count() + 1;

        //Get the cutting class
        var cuttingClass = CuttingClasses.findOne({_id: cuttingClassId});
        if (!cuttingClass) { throw new Error("Cannot get CuttingClasses Object on server"); }

        if (direction === "hor") {
            var cuttingdistance = Math.round(currentPlate.height/2);
        } else if (direction === "ver") {
            var cuttingdistance = Math.round(currentPlate.width/2);
        } else {
            throw new Error("Cannot get Direction on server");
        }

        //Insert the cut to the database
        Cutting.insert({
            plateId       : currentId,
            cutname       : pos,
            distance      : cuttingdistance,
            angle         : cuttingClass.angle,
            tool          : cuttingClass.tool,
            cutdirection  : direction,
            benddirection : cuttingClass.bending,
            width         : 0,
            height        : 0
        }, { validationContext: "insertCutting" });

        if (Meteor.isServer) {
            return true;
        }
    },

    //Delete cut
    'delCut': function(selectedCut, currentId) {
        //Remove the selected cut from database
        if (Array.isArray(selectedCut)) {
            selectedCut.forEach(function(id) { Cutting.remove(id); });
        } else {
            Cutting.remove(selectedCut);
        }

        //Get the ids of undeleted drillings
        var cutArray = Cutting.find({plateId: currentId}, {
            sort  : {holename: 1},
            fields: {_id     : 1},
        }).map(function(el) { return el._id;  });

        //Rename the undeleted cuts
        for (var i = 0; i < cutArray.length; i++) {
            var no = i + 1;
            Cutting.update(cutArray[i], {$set: {
                cutname: no
                }
            })
        }

        if (Meteor.isServer) {
            return true;
        }
    },

    //Update the cutting
    'updateCutting': function(selectedCuttingId, distance) {
        //Update the inserted cutting

        Cutting.update(selectedCuttingId, {$set: {
             distance: distance,
        }}, {validationContext: "updateCutting"});

        if (Meteor.isServer) {
            return true;
        }
    }
});

