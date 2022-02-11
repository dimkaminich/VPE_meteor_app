/**
 * Toggle the border button style according to the given boolean value
 * @param  {Boolean}                val
 * @param  {Raphael rectangular}    rect
 * @param  {Raphael text}           txt
 */
function checkBorderState(val, rect, txt) {
    rect.attr({
        "stroke-width": 1
    });

    rect.toFront();
    txt.toFront();

    //if user click to close the border
    if (val) {
        //Change color of rectangular
        rect.attr({
            stroke: "#707173",
            fill  : "#707173"
        });

        //Change color while mouse over and mouse out the rectangular
        rect.mouseover(function() {
            rect.attr({
                stroke: "#707173",
                fill: "#707173"
            });
        }).mouseout(function() {
            rect.attr({
                stroke: "#707173",
                fill: "#707173"
            });
        });

        //Change color of text
        txt.attr({
            text         : "G",
            "font-size"  : 15,
            fill         : "#efefef",
            "font-family": "'Roboto Condensed', Arial, Helvetica, sans-serif"
        });

        //Change color while mouse over and mouse out the text
        txt.mouseover(function() {
            rect.attr({
                fill: "#707173"
            });
        }).mouseout(function() {
            rect.attr({
                fill: "#707173"
            });
        });
    //if user click to open the border
    } else {
        //Change color of rectangular
        rect.attr({
            stroke: "#7e7e7e",
            fill  : "#ffffff"
        });

        //Change color while mouse over and mouse out the rectangular
        rect.mouseover(function() {
            rect.attr({
                stroke: "#7e7e7e",
                fill: "#ebebeb"
            });
        }).mouseout(function() {
            rect.attr({
                stroke: "#7e7e7e",
                fill: "#ffffff"
            });
        });

        //Change color of text
        txt.attr({
            text         : "O",
            "font-size"  : 15,
            fill         : "#505050",
            "font-family": "'Roboto Condensed', Arial, Helvetica, sans-serif"
        });

        //Change color while mouse over and mouse out the text
        txt.mouseover(function() {
            rect.attr({
                stroke: "#7e7e7e",
                fill: "#ebebeb"
            });
        }).mouseout(function() {
            rect.attr({
                stroke: "#cccccc",
                fill: "#ffffff"
            });
        });
    }
}

/**
 * Toggle the border between closed and opened if the user clicks on the button
 * @param {String} borderNo
 */
function setBorder(borderNo) {
    //Get the current plate Id
    var currentPlateId = Session.get('currentPos');
    //Check if the current plate set or exist
    if (Session.get('currentPos')) {
        //Get the current plate
        var currentPlate = Plate.findOne({_id: Session.get('currentPos')});
        delete currentPlate._id;
        (currentPlate[borderNo]) ? currentPlate[borderNo] = false : currentPlate[borderNo] = true;

        //Validate pseudo plate
        Plate.simpleSchema().namedContext('validateBorder').validate(currentPlate, {modifier: false});
        var pseudoContext = Plate.simpleSchema().namedContext("validateBorder");

        var errorobject;
        pseudoContext.invalidKeys().map(function(data) {
            errorobject = pseudoContext.keyErrorMessage(data.name);
        });

        if (errorobject && errorobject.split("_")[0].indexOf("#") !== -1) {

            sAlert.error(errorobject.split("_")[1]);

        } else if (errorobject && errorobject.split("_")[0] === "info") {

            Meteor.call('setBorderState', currentPlateId, borderNo, function(error, result) {
                if (error) {
                    throw new Meteor.Error(300, 'Border is not possible');
                }
            });

            bootbox.dialog({
                title: "INFORMATION ZUR PLATTE",
                message:
                    '<div class="row"> ' +
                        '<div class="col-md-12 setFont"> ' +
                            errorobject.split("_")[1] +
                        '</div> ' +
                    '</div> ',
                buttons: {
                    success: {
                        label: "OK",
                        className: "btn-success btn-square-green borderradius0 hvr-fade",
                        callback: function () {
                            return;
                        }
                    }
                }
            });

        } else {

            Meteor.call('setBorderState', currentPlateId, borderNo, function(error, result) {
                if (error) {
                    throw new Meteor.Error(300, 'Delete cut is not possible');
                }
            });

        }
    }
}



Template.border.onCreated(function() {
    //Create reactive variables for '#borderarea' div sizes
    this.divWidth = new ReactiveVar();
    this.divHeight = new ReactiveVar();
});



Template.border.onRendered(function() {
    var self = this;

    //Get default div sizes
    var defaultWidth  = self.$("#borderarea").width();
    var defaultHeight = self.$("#borderarea").height();

    //Set default div sizes into reactive variables
    self.divWidth.set(defaultWidth);
    self.divHeight.set(defaultHeight);

    //Create Raphael canvas with default sizes
    setBorderPaper = Raphael(self.find("#borderarea"), defaultWidth, defaultHeight, 0, 0);

    //Get div size if the window is resized
    $(window).resize(function() {
        var changedWidth  = $("#borderarea").width();
        var changedHeight = $("#borderarea").height();

        //Save the current div sizes
        self.divWidth.set(changedWidth);
        self.divHeight.set(changedHeight);

        //Resize Raphael canvas according to the new sizes
        if (typeof(setBorderPaper) !== 'undefined') {
            setBorderPaper.setSize(changedWidth, changedHeight);
        }
    });

    self.autorun(function() {
        //Get the Id of the current plate
        var currentPlateId = Session.get('currentPos');

        if (currentPlateId) {
            //Get the current Plate
            var plate = Plate.findOne({_id: currentPlateId});

            //Get the current sizes of the div
            var currentWidth  = Template.instance().divWidth.get();
            var currentHeight = Template.instance().divHeight.get();

            //Set the bounding sizes of the drawing canvas
            var boundWidth  = currentWidth - 50 - 50;
            var boundHeight = currentHeight - 150 - 50;

            //Calculate the shortest length
            var shortestLength = [boundWidth, boundHeight].sort(function(a, b) { return a - b; })[0];

            //Define the base point for rect
            var xValue = (currentWidth / 2) - (shortestLength / 2);
            var yValue = 150;

            //If the rectangle not exist, create a new one
            if (typeof(borderRect) === 'undefined') {
                borderRect = setBorderPaper.set();

                //Calculate the lengths of the main rectangular
                var l1path = "M" + (xValue + shortestLength).toString() + "," + yValue.toString() + "\
                          L" + xValue.toString() + "," + yValue.toString();

                var l2path = "M" + xValue.toString() + "," + yValue.toString() + "\
                          L" + xValue.toString() + "," + (yValue + shortestLength).toString();

                var l3path = "M" + xValue.toString() + "," + (yValue + shortestLength).toString() + "\
                          L" + (xValue + shortestLength).toString() + "," + (yValue + shortestLength).toString();

                var l4path = "M" + (xValue + shortestLength).toString() + "," + (yValue + shortestLength).toString() + "\
                          L" + (xValue + shortestLength).toString() + "," + yValue.toString();

                //Create main rectangular lines
                var bL1 = setBorderPaper.path(l1path);
                var bL2 = setBorderPaper.path(l2path);
                var bL3 = setBorderPaper.path(l3path);
                var bL4 = setBorderPaper.path(l4path);

                //Create a filling for the main rectangle
                var rectFilling = setBorderPaper.rect(xValue, yValue, shortestLength, shortestLength);
                rectFilling.toBack();
                rectFilling.attr({
                    stroke       : "none",
                    "stoke-width": "none",
                    fill         : "#ebebeb"
                });

                //Define the width and length of the border label rectangles
                var rectWidth = 30;

                //Create border label rectangles
                var lr1 = setBorderPaper.rect((xValue + shortestLength / 2 - rectWidth / 2), yValue - rectWidth / 2, rectWidth, rectWidth);
                lr1.translate(0.5, 0.5);
                lr1.node.setAttribute("class", "lr1 showHand");
                var lr2 = setBorderPaper.rect((xValue - rectWidth / 2), (yValue + shortestLength / 2 - rectWidth / 2), rectWidth, rectWidth);
                lr2.translate(0.5, 0.5);
                lr2.node.setAttribute("class", "lr2 showHand");
                var lr3 = setBorderPaper.rect((xValue + shortestLength / 2 - rectWidth / 2), (yValue + shortestLength - rectWidth / 2), rectWidth, rectWidth);
                lr3.translate(0.5, 0.5);
                lr3.node.setAttribute("class", "lr3 showHand");
                var lr4 = setBorderPaper.rect((xValue + shortestLength - rectWidth / 2), (yValue + shortestLength / 2 - rectWidth / 2), rectWidth, rectWidth);
                lr4.translate(0.5, 0.5);
                lr4.node.setAttribute("class", "lr4 showHand");

                //Create border labels
                var lt1 = setBorderPaper.text((xValue + shortestLength / 2), yValue, "");
                lt1.node.setAttribute("class", "lr1 showHand");
                var lt2 = setBorderPaper.text(xValue, (yValue + shortestLength / 2), "");
                lt2.node.setAttribute("class", "lr2 showHand");
                var lt3 = setBorderPaper.text((xValue + shortestLength / 2), (yValue + shortestLength), "");
                lt3.node.setAttribute("class", "lr3 showHand");
                var lt4 = setBorderPaper.text((xValue + shortestLength), (yValue + shortestLength / 2), "");
                lt4.node.setAttribute("class", "lr4 showHand");

                //Start modification of the labels
                checkBorderState(plate.b1, lr1, lt1);
                checkBorderState(plate.b2, lr2, lt2);
                checkBorderState(plate.b3, lr3, lt3);
                checkBorderState(plate.b4, lr4, lt4);

                //Collect the data in a set
                borderRect.push(bL1);
                borderRect.push(bL2);
                borderRect.push(bL3);
                borderRect.push(bL4);
                borderRect.push(rectFilling);
                borderRect.push(lr1);
                borderRect.push(lr2);
                borderRect.push(lr3);
                borderRect.push(lr4);
                borderRect.push(lt1);
                borderRect.push(lt2);
                borderRect.push(lt3);
                borderRect.push(lt4);

            } else {
                //Define the width and length of the border label rectangle
                var rectWidth = 30;

                //Calculate the lengths of the main rectangular
                var l1path = "M" + (xValue + shortestLength).toString() + "," + yValue.toString() + "\
                    L" + xValue.toString() + "," + yValue.toString();

                var l2path = "M" + xValue.toString() + "," + yValue.toString() + "\
                    L" + xValue.toString() + "," + (yValue + shortestLength).toString();

                var l3path = "M" + xValue.toString() + "," + (yValue + shortestLength).toString() + "\
                    L" + (xValue + shortestLength).toString() + "," + (yValue + shortestLength).toString();

                var l4path = "M" + (xValue + shortestLength).toString() + "," + (yValue + shortestLength).toString() + "\
                    L" + (xValue + shortestLength).toString() + "," + yValue.toString();

                //Modify existing main rectangle
                borderRect[0].attr({
                    path: l1path
                });
                borderRect[1].attr({
                    path: l2path
                });
                borderRect[2].attr({
                    path: l3path
                });
                borderRect[3].attr({
                    path: l4path
                });

                //Modife existing main rectangle filling
                borderRect[4].attr({
                    x     : xValue,
                    y     : yValue,
                    width : shortestLength,
                    height: shortestLength
                });

                //Calculate border label rectangle position
                borderRect[5].attr({
                    x: xValue + shortestLength / 2 - rectWidth / 2,
                    y: yValue - rectWidth / 2
                });
                borderRect[6].attr({
                    x: xValue - rectWidth / 2,
                    y: yValue + shortestLength / 2 - rectWidth / 2
                });
                borderRect[7].attr({
                    x: xValue + shortestLength / 2 - rectWidth / 2,
                    y: yValue + shortestLength - rectWidth / 2
                });
                borderRect[8].attr({
                    x: xValue + shortestLength - rectWidth / 2,
                    y: yValue + shortestLength / 2 - rectWidth / 2
                });

                //Calculate border label position
                borderRect[9].attr({
                    x: xValue + shortestLength / 2,
                    y: yValue
                });
                borderRect[10].attr({
                    x: xValue,
                    y: yValue + shortestLength / 2
                });
                borderRect[11].attr({
                    x: xValue + shortestLength / 2,
                    y: yValue + shortestLength
                });
                borderRect[12].attr({
                    x: xValue + shortestLength,
                    y: yValue + shortestLength / 2
                });

                //Start modification of the labels
                checkBorderState(plate.b1, borderRect[5], borderRect[9]);
                checkBorderState(plate.b2, borderRect[6], borderRect[10]);
                checkBorderState(plate.b3, borderRect[7], borderRect[11]);
                checkBorderState(plate.b4, borderRect[8], borderRect[12]);
            }
        } else {
            if (typeof(borderRect) !== 'undefined') {
                borderRect.remove();
                delete borderRect;
            }
        }
    });

    //Create Legend
    self.autorun(function() {
        //Get the Id of the current plate
        var currentPlateId = Session.get('currentPos');

        if (currentPlateId) {
            if (typeof(legCont) === "undefined") {
                legCont = setBorderPaper.set();
                var rectWidth = 30;

                //Create rectangle for opened border
                cExp1 = setBorderPaper.rect(1, 20, rectWidth, rectWidth);
                cExp1.attr({
                    stroke        : "#cccccc",
                    fill          : "#ffffff",
                    "stroke-width": 1
                }).translate(0.5, 0.5);

                //Create label for opened border
                cExp1Text = setBorderPaper.text(16, 35, "O");
                cExp1Text.attr({
                    "font-size"  : 15,
                    fill         : "#505050",
                    "font-family": "'Roboto Condensed', Arial, Helvetica, sans-serif"
                });

                //Create icon for opened Border
                p10 = setBorderPaper.path("M40,35 L50,35").attr({"stroke-width": 1}).translate(0.5, 0.5);
                p11 = setBorderPaper.path("M60,25 L118,25 L118,20 L60,20").attr({fill: "#949494", "stroke-width": 1}).translate(0.5, 0.5);
                p12 = setBorderPaper.path("M60,49 L118,49 L118,44 L60,44").attr({fill: "#949494", "stroke-width": 1}).translate(0.5, 0.5);
                p13 = setBorderPaper.path("M60,24 L118,24 L118,45 L60,45").attr({fill: "#D8D8D8", "stroke-width": 1}).translate(0.5, 0.5).toBack();

                //Create description for opened Border
                cDes1Text = setBorderPaper.text(130, 35, "(offene Kante)");
                cDes1Text.attr({
                    "font-size"  : 14,
                    fill         : "#333",
                    "font-weight": "bold",
                    "font-family": "'Roboto Condensed', Arial, Helvetica, sans-serif"
                }).attr({'text-anchor': 'start'});

                //Create rectangle for closed border
                cExp2 = setBorderPaper.rect(1, 60, rectWidth, rectWidth);
                cExp2.attr({
                    stroke        : "#707173",
                    fill          : "#707173",
                    "stroke-width": 1
                }).translate(0.5, 0.5);

                //Create label for closed border
                cExp2Text = setBorderPaper.text(16, 75, "G");
                cExp2Text.attr({
                    "font-size"  : 15,
                    fill         : "#efefef",
                    "font-family": "'Roboto Condensed', Arial, Helvetica, sans-serif"
                });

                //Create icon for closed border
                p20 = setBorderPaper.path("M40,75 L50,75").attr({"stroke-width": 1}).translate(0.5, 0.5);
                p21 = setBorderPaper.path("M60,60 L114,60 C114,60 118,60 118,64 L118,89 L113,89 L113,67 C113,67 113,65 111,65 L60,65").attr({fill: "#949494", "stroke-width": 1}).translate(0.5, 0.5);
                p22 = setBorderPaper.path("M60,89 L110,89 L110,84 L60,84").attr({fill: "#949494", "stroke-width": 1}).translate(0.5, 0.5);
                p23 = setBorderPaper.path("M60,63 L115,63 L115,84 L60,84").attr({fill: "#D8D8D8", "stroke-width": 0}).toBack();

                //Create description for opened Border
                cDes2Text = setBorderPaper.text(130, 75, "(geschl. Kante)");
                cDes2Text.attr({
                    "font-size"  : 14,
                    fill         : "#333",
                    "font-weight": "bold",
                    "font-family": "'Roboto Condensed', Arial, Helvetica, sans-serif"
                }).attr({'text-anchor': 'start'});

               //Collect geometry in a set
               legCont.push(cExp1);
               legCont.push(cExp2);
               legCont.push(cExp1Text);
               legCont.push(cExp2Text);
               legCont.push(cDes1Text);
               legCont.push(cDes2Text);
               legCont.push(p10);
               legCont.push(p11);
               legCont.push(p12);
               legCont.push(p13);
               legCont.push(p20);
               legCont.push(p21);
               legCont.push(p22);
               legCont.push(p23);
           }
        } else {
            //If a plate is unselected or deleted, remove the content
            if (typeof(legCont) !== 'undefined') {
                legCont.remove();
                delete legCont;
            }
        }
    });
});



Template.border.onDestroyed(function() {
    if (typeof(borderRect) !== 'undefined') {
        borderRect.remove();
        delete borderRect;
    }

    if (typeof(setBorderPaper) !== 'undefined') {
        setBorderPaper.remove();
        delete setBorderPaper;
    }

    if (typeof(legCont) !== 'undefined') {
        legCont.remove();
        delete legCont;
    }
});



Template.border.events({
    'click .lr1': function(event, template) {
        event.preventDefault();
        setBorder('b1');
    },

    'click .lr2': function(event, template) {
        event.preventDefault();
        setBorder('b2');
    },

    'click .lr3': function(event, template) {
        event.preventDefault();
        setBorder('b3');
    },
    
    'click .lr4': function(event, template) {
        event.preventDefault();
        setBorder('b4');
    }
});
