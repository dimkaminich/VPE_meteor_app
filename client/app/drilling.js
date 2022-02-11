Template.drilling.events({
    //Add drilling to the plate
    'click #addHole': function (event, template) {
        event.preventDefault();

        if (Session.get('currentPos')) {
            //Run the "addHole" function from lib/app/drilling.js
            Meteor.call('addHole', Session.get('currentPos'), function (error, result) {
                if (error) {
                    throw new Meteor.Error(300, 'Add hole is not possible');
                }
            });
        }
    },

    //Delete drilling from plate
    'click #delHole': function (event, template) {
        event.preventDefault();

        if (Session.get('drillCont') && Session.get('currentPos')) {
            //Run the "delHole" function from lib/app/drilling.js
            Meteor.call('delHole', Session.get('drillCont'), Session.get('currentPos'), function (error, result) {
                if (error) {
                    throw new Meteor.Error(300, 'Delete hole is not possible');
                }
            });

            //Unselect all drilling buttons
            $(".drill").removeClass(".active");

            //Empty 'drillCont' Session
            Session.set('drillCont', []);
        }
    },

    //Accept the drilling properties like position and diameter
    'submit form': function (event, template) {
        event.preventDefault();

        //Get the current plate
        var currentPlateId = Session.get('currentPos');
        var currentPlate = Plate.findOne({ _id: currentPlateId });

        if (currentPlate) {

            //Get the drillings from db according to the drilling no.
            var holeArray = Session.get('drillCont');
            var sortedHoleObjects = Drilling.find({ _id: { $in: holeArray } }, {
                sort: { holename: 1 }
            }).fetch();

            if (sortedHoleObjects.length > 0) {
                //Get the parameter from input fields
                var xValue = template.$('#x').val().replace("," , ".");
                var yValue = template.$('#y').val().replace("," , ".");
                var dValue = template.$('#d').val().replace("," , ".");

                //Create array for drilling coordinates
                var xVArray = [];
                var yVArray = [];
                var dVArray = [];

                //Create array for names
                var namedC = [];
                sortedHoleObjects.forEach(function (el) {
                    namedC.push(el.holename.toString() + "_updateDrilling");
                });

                //Check if the x input value is iterrable (with ++)
                if (xValue.length !== 0 && /^\+\+/.test(xValue) && !isNaN(parseFloat(xValue.substring(2, xValue.length).trim()))) {
                    for (var i = 0; i < sortedHoleObjects.length; i++) {
                        var extractedXValue = parseFloat(xValue.substring(2, xValue.length).trim());
                        var actualXValue = (extractedXValue * (i + 1)) + sortedHoleObjects[i].holeX;
                        actualXValue = Math.round(actualXValue * 10) /10;
                        xVArray.push(actualXValue);
                    }
                    //Check if the x input is dynamical (with +/-)
                } else if (xValue.length !== 0 && /^\+/.test(xValue) && !isNaN(parseFloat(xValue.substring(1, xValue.length).trim())) ||
                    xValue.length !== 0 && /^\-/.test(xValue) && !isNaN(parseFloat(xValue.substring(1, xValue.length).trim()))) {
                    var op = xValue.substring(0, 1);
                    if (op && op === "+") {
                        for (var i = 0; i < sortedHoleObjects.length; i++) {
                            var extractedXValue = parseFloat(xValue.substring(1, xValue.length).trim());
                            var actualXValue = extractedXValue + sortedHoleObjects[i].holeX;
                            actualXValue = Math.round(actualXValue * 10) / 10;
                            xVArray.push(actualXValue);
                        }
                    } else if (op && op === "-") {
                        for (var i = 0; i < sortedHoleObjects.length; i++) {
                            var extractedXValue = parseFloat(xValue.substring(1, xValue.length).trim());
                            var actualXValue = sortedHoleObjects[i].holeX - extractedXValue;
                            actualXValue = Math.round(actualXValue * 10) / 10;
                            xVArray.push(actualXValue);
                        }
                    }
                    //Check if the x input is statical (without operator)
                } else if (xValue.length !== 0 && !isNaN(parseFloat(xValue.trim()))) {
                    for (var i = 0; i < sortedHoleObjects.length; i++) {
                        var extractedXValue = parseFloat(xValue.trim());
                        extractedXValue = Math.round(extractedXValue * 10) / 10;
                        xVArray.push(extractedXValue);
                    }
                    //If the input is unchanged
                } else {
                    for (var i = 0; i < sortedHoleObjects.length; i++) {
                        xVArray.push(sortedHoleObjects[i].holeX);
                    }
                }

                //Check if the y input value is iterrable (with ++)
                if (yValue.length !== 0 && /^\+\+/.test(yValue) && !isNaN(parseFloat(yValue.substring(2, yValue.length).trim()))) {
                    for (var i = 0; i < sortedHoleObjects.length; i++) {
                        var extractedYValue = parseFloat(yValue.substring(2, yValue.length).trim());
                        var actualYValue = (extractedYValue * (i + 1)) + sortedHoleObjects[i].holeY;
                        actualYValue = Math.round(actualYValue * 10) / 10;
                        yVArray.push(actualYValue);
                    }
                    //Check if the y input is dynamical (with +/-)
                } else if (yValue.length !== 0 && /^\+/.test(yValue) && !isNaN(parseFloat(yValue.substring(1, yValue.length).trim())) ||
                    yValue.length !== 0 && /^\-/.test(yValue) && !isNaN(parseFloat(yValue.substring(1, yValue.length).trim()))) {
                    var op = yValue.substring(0, 1);
                    if (op && op === "+") {
                        for (var i = 0; i < sortedHoleObjects.length; i++) {
                            var extractedYValue = parseFloat(yValue.substring(1, yValue.length).trim());
                            var actualYValue = extractedYValue + sortedHoleObjects[i].holeY;
                            actualYValue = Math.round(actualYValue * 10) / 10;
                            yVArray.push(actualYValue);
                        }
                    } else if (op && op === "-") {
                        for (var i = 0; i < sortedHoleObjects.length; i++) {
                            var extractedYValue = parseFloat(yValue.substring(1, yValue.length).trim());
                            var actualYValue = sortedHoleObjects[i].holeY - extractedYValue;
                            actualYValue = Math.round(actualYValue * 10) / 10;
                            yVArray.push(actualYValue);
                        }
                    }
                    //Check if the y input is statical (without operator)
                } else if (yValue.length !== 0 && !isNaN(parseFloat(yValue.trim()))) {
                    for (var i = 0; i < sortedHoleObjects.length; i++) {
                        var extractedYValue = parseFloat(yValue.trim());
                        extractedYValue = Math.round(extractedYValue * 10) / 10;
                        yVArray.push(extractedYValue);
                    }
                    //If the input is unchanged
                } else {
                    for (var i = 0; i < sortedHoleObjects.length; i++) {
                        yVArray.push(sortedHoleObjects[i].holeY);
                    }
                }

                //Check the d value (diameter)
                if (dValue.length !== 0 && !isNaN(parseFloat(dValue.trim()))) {
                    for (var i = 0; i < sortedHoleObjects.length; i++) {
                        var extractedDValue = parseFloat(dValue.trim());
                        extractedDValue = Math.round(extractedDValue * 10) / 10;
                        dVArray.push(extractedDValue);

                    }
                    //If the input is unchanged
                } else {
                    for (var i = 0; i < sortedHoleObjects.length; i++) {
                        dVArray.push(sortedHoleObjects[i].holeD);
                    }
                }

                //Run the "updateHole" function from lib/app/drilling.js
                Meteor.call('updateHole', sortedHoleObjects, xVArray, yVArray, dVArray, namedC, function (error, result) {
                    $(".drill").removeClass("active");
                    $(".drill").removeClass("danger");

                    if (error) {
                        var contextArray = [];
                        for (var i = 0; i < namedC.length; i++) {
                            var errorArray = [];
                            var context = Drilling.simpleSchema().namedContext(namedC[i]);
                            context.invalidKeys().map(function (data) {
                                errorArray.push(context.keyErrorMessage(data.name));
                            });
                            contextArray.push(errorArray);
                        }

                        for (var i = 0; i < contextArray.length; i++) {
                            if (contextArray[i].length > 0) {
                                var holeNr = namedC[i].split("_")[0];

                                $(".drill").each(function () {
                                    if (parseInt($(this).find("span")[0].innerHTML.trim()) === parseInt(holeNr)) {
                                        $(this).addClass("danger");
                                    }
                                });

                                var errorString = "Bohrung " + holeNr + ": ";
                                errorString += contextArray[i].join("! ");
                                sAlert.error(errorString);
                            }
                        }
                    }
                });

                //Empty the 'drillCont' array
                Session.set('drillCont', []);

                //Empty the input fields
                template.$('#x').val("");
                template.$('#y').val("");
                template.$('#d').val("");
            }
        }
    },
    //Align drillings horizontal
    'click #align-hor': function (event, template) {
        event.preventDefault();

        //Get the current plate
        var currentPlateId = Session.get('currentPos');
        var currentPlate = Plate.findOne({ _id: currentPlateId });

        if (currentPlate) {

            //Get the drillings from db according to the drilling no.
            var holeArray = Session.get('drillCont');
            var sortedHoleObjects = Drilling.find({ _id: { $in: holeArray } }, {
                sort: { holeX: 1, holename: 1 }
            }).fetch();

            if (sortedHoleObjects.length < 3) {
                return;
            }

            //Create array for drilling coordinates
            var xVArray = [];
            var yVArray = []; //Is not necessary, but I use here the same method, as in the submit function
            var dVArray = []; //Is not necessary, but I use here the same method, as in the submit function

            //Create array for names
            var namedC = []; //Is not necessary, but I use here the same method, as in the submit function
            sortedHoleObjects.forEach(function (el) {
                namedC.push(el.holename.toString() + "_updateDrilling");
            });

            //Calculate distances
            var smallestDis = sortedHoleObjects[0].holeX;
            var biggestDis = sortedHoleObjects[sortedHoleObjects.length - 1].holeX;
            var difference = biggestDis - smallestDis;
            var distance = difference / (sortedHoleObjects.length - 1);
            distance = Math.round(distance * 10) / 10;

            for (var i = 1; i < sortedHoleObjects.length - 1; i++) {
                xVArray.push(distance * i + sortedHoleObjects[0].holeX);
                yVArray.push(sortedHoleObjects[i].holeY);
                dVArray.push(sortedHoleObjects[i].holeD);
            }

            sortedHoleObjects = sortedHoleObjects.slice(1, sortedHoleObjects.length - 1);

            //Run the "updateHole" function from lib/app/drilling.js
            Meteor.call('updateHole', sortedHoleObjects, xVArray, yVArray, dVArray, namedC, function (error, result) {
                $(".drill").removeClass("active");
                if (error) {
                    throw new Menteor.Error(101, "Horizontal align is not possible");
                }
            });


            //Empty the 'drillCont' array
            Session.set('drillCont', []);

            //Empty the input fields
            template.$('#x').val("");
            template.$('#y').val("");
            template.$('#d').val("");
        }
    },
    //Align drillings horizontal
    'click #align-ver': function (event, template) {
        event.preventDefault();

        //Get the current plate
        var currentPlateId = Session.get('currentPos');
        var currentPlate = Plate.findOne({ _id: currentPlateId });

        if (currentPlate) {

            //Get the drillings from db according to the drilling no.
            var holeArray = Session.get('drillCont');
            var sortedHoleObjects = Drilling.find({ _id: { $in: holeArray } }, {
                sort: { holeY: 1, holename: 1 }
            }).fetch();

            if (sortedHoleObjects.length < 3) {
                return;
            }

            //Create array for drilling coordinates
            var xVArray = []; //Is not necessary, but I use here the same method, as in the submit function
            var yVArray = [];
            var dVArray = []; //Is not necessary, but I use here the same method, as in the submit function

            //Create array for names
            var namedC = []; //Is not necessary, but I use here the same method, as in the submit function
            sortedHoleObjects.forEach(function (el) {
                namedC.push(el.holename.toString() + "_updateDrilling");
            });

            //Calculate distances
            var smallestDis = sortedHoleObjects[0].holeY;
            var biggestDis = sortedHoleObjects[sortedHoleObjects.length - 1].holeY;
            var difference = biggestDis - smallestDis;
            var distance = difference / (sortedHoleObjects.length - 1);
            distance = Math.round(distance * 10) / 10;

            for (var i = 1; i < sortedHoleObjects.length - 1; i++) {
                xVArray.push(sortedHoleObjects[i].holeX);
                yVArray.push(distance * i + sortedHoleObjects[0].holeY);
                dVArray.push(sortedHoleObjects[i].holeD);
            }

            sortedHoleObjects = sortedHoleObjects.slice(1, sortedHoleObjects.length - 1);

            //Run the "updateHole" function from lib/app/drilling.js
            Meteor.call('updateHole', sortedHoleObjects, xVArray, yVArray, dVArray, namedC, function (error, result) {
                $(".drill").removeClass("active");
                if (error) {
                    throw new Menteor.Error(101, "Horizontal align is not possible");
                }
            });


            //Empty the 'drillCont' array
            Session.set('drillCont', []);

            //Empty the input fields
            template.$('#x').val("");
            template.$('#y').val("");
            template.$('#d').val("");
        }
    }
});


Template.drilling.helpers({
    //Get the drillings
    'holes': function () {
        if (Session.get('currentPos')) {
            return Drilling.find({ plateId: Session.get('currentPos') }, { sort: { holename: 1 } });
        }
    },
    //Get the coordinates for the input fields if only one drilling is selected
    'coordinates': function () {
        if (Session.get('drillCont') && Session.get('drillCont').length === 1) {
            return Drilling.findOne({ _id: Session.get('drillCont')[0] });
        }
    },
    //Plate token for disabling form
    'plateToken': function () {
        if (!Session.get('currentPos')) {
            return "disabled";
        }
    },
    //Drilling token for disabling fields and buttons
    'drillingToken': function () {
        if (!Session.get('drillCont') || Session.get('drillCont').length < 1) {
            return "disabled";
        }
    },
    'drillingSecondaryToken': function() {
        if (!Session.get('drillCont') || Session.get('drillCont').length < 3) {
            return "disabled";
        }
    }
});


/*Template.drilling.onDestroyed(function () {
    Session.set('drillCont', []);
});*/
