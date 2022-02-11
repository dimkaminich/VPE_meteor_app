Template.cutting.events({
    'click .cuttingIndex': function(event, template) {
        event.preventDefault();
        var direction = $(event.currentTarget).attr("value");

        if (Session.get('currentPos')) {
            //Run the "addCut" function from lib/app/cutting.js
            Meteor.call('addCut', Session.get('currentPos'), this._id, direction, function(error, result) {
                if (error) {
                    throw new Meteor.Error(300, 'Add cut is not possible');
                }
            });
        }
    },
    'click #delCut': function(event, template) {
        event.preventDefault();

        if (Session.get('cuttingCont') && Session.get('currentPos')) {
            //Run the "delHole" function from lib/app/cutting.js
            Meteor.call('delCut', Session.get('cuttingCont'), Session.get('currentPos'), function(error, result) {
                if (error) {
                    throw new Meteor.Error(300, 'Delete cut is not possible');
                }
            });

            //Unselect all cutting buttons
            template.$(".cut").removeClass(".active");

            //Empty 'cuttingCont' Session
            Session.set('cuttingCont', null);
        }
    },
    'submit form': function(event, template) {
        event.preventDefault();

        //Get the current plate
        var currentPlate = Plate.findOne({_id: Session.get('currentPos')});
        var cuttingId    = Session.get('cuttingCont');

        if (currentPlate && cuttingId) {
            var distance = template.$("#cutdis").val().replace("," , ".");

            template.$("#cutdis").blur();
            template.$("#cutdis").removeClass("form-controlError");

            //Run the "updateCutting" function from lib/app/cutting.js
            Meteor.call('updateCutting', cuttingId, distance, function(error, result) {
                if (error) {
                    var context = Cutting.simpleSchema().namedContext("updateCutting");
                    context.invalidKeys().map(function(data) {
                        var errormessage = context.keyErrorMessage(data.name);
                        template.$(errormessage.split("_")[0]).addClass("form-controlError");
                        sAlert.error(errormessage.split("_")[1]);
                    });
                }
            });
        }
    },
});


Template.cutting.helpers({
    //Plate token for disabling form
    'plateToken': function() {
        if (!Session.get('currentPos')) {
            return "disabled";
        }
    },
    //Cutting token for disabling fields and buttons
    'cuttingToken': function() {
        if (!Session.get('cuttingCont')) {
            return "disabled";
        }
    },
    //View the dropdown content cuttings
    'cuttingContHlp': function() {
      if (Session.get('currentPos')) {
        var resultA = CuttingClasses.find({bending: "down"}, {sort: {ordernumber: 1}}).fetch();
        var resultI = CuttingClasses.find({bending: "up"}, {sort: {ordernumber: 1}}).fetch();

        var firstCut = Cutting.find({plateId: Session.get('currentPos')}).fetch()[0];

        var cutVariants = {
            AE: {},
            IE: {},
        };

        if (firstCut && firstCut.cutdirection === "hor") {
            cutVariants["AE"] = {hor: resultA};
            cutVariants["IE"] = {hor: resultI};
        } else if (firstCut && firstCut.cutdirection === "ver") {
            cutVariants["AE"] = {ver: resultA};
            cutVariants["IE"] = {ver: resultI};
        } else {
            cutVariants["AE"] = {hor: resultA, ver: resultA};
            cutVariants["IE"] = {hor: resultI, ver: resultI};
        }

        return cutVariants;
      }
    },
    //Get the cuttings
    'cuts': function() {
        if (Session.get('currentPos')) {
            return Cutting.find({plateId: Session.get('currentPos')}, {sort: {cutname: 1}});
        }
    },
    //Get the coordinates for the input fields if only one drilling is selected
    'currentcut': function() {
        if (Session.get('cuttingCont')) {
            return Cutting.findOne({_id: Session.get('cuttingCont')});
        }
    },
});


Template.cutting.onDestroyed(function () {
    Session.set('cuttingCont', null);
});
