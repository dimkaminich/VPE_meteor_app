Router.route('/', {
    layoutTemplate: 'layout',
    waitOn: function() {
        storeIdToLocalStorage();
        storeSessionToLocalStorage();

        Meteor.subscribe('plate', Session.get('currentContainerId'));
    },
    action: function() {
        if (this.ready()) {
            this.render('index');
        }
    }
});


Router.route('/buildmask/drilling', {
    layoutTemplate: 'layout',
    name: 'drillingPath',
    waitOn: function() {
        storeIdToLocalStorage();
        storeSessionToLocalStorage();

        Meteor.subscribe('plate', Session.get('currentContainerId'));
        Meteor.subscribe('drilling', Session.get('currentPos'));
        Meteor.subscribe('cutting', Session.get('currentPos'));
    },
    data: function() {
        Session.set('templateVar', 'drilling');
    },
    action: function() {
        if (this.ready()) {
            this.render('drilling', {to: 'createPlates'});
        }
    }
});

Router.route('/buildmask/cutting', {
    layoutTemplate: 'layout',
    name: 'cuttingPath',
    waitOn: function() {
        storeIdToLocalStorage();
        storeSessionToLocalStorage();

        Meteor.subscribe('plate', Session.get('currentContainerId'));
        Meteor.subscribe('drilling', Session.get('currentPos'));
        Meteor.subscribe('cutting', Session.get('currentPos'));
    },
    data: function() {
        Session.set('templateVar', 'cutting');
    },
    action: function() {
        if (this.ready()) {
            this.render('cutting', {to: 'createPlates'});
        }
    }
});

Router.route('/buildmask/border', {
    layoutTemplate: 'layout',
    name: 'borderPath',
    waitOn: function() {
        storeIdToLocalStorage();
        storeSessionToLocalStorage();

        Meteor.subscribe('plate', Session.get('currentContainerId'));
        Meteor.subscribe('drilling', Session.get('currentPos'));
        Meteor.subscribe('cutting', Session.get('currentPos'));
    },
    data: function() {
        Session.set('templateVar', 'border');
    },
    action: function() {
        if (this.ready()) {
            this.render('border', {to: 'createPlates'});
        }
    }
});


