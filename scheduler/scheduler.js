Employees = new Mongo.Collection("employees");
//employee : {name : "Alex"}
Shifts = new Mongo.Collection("shifts");
//shift: {day : 2, name : "Alex", hours : "2 to 5"} 1 is Monday

if (Meteor.isClient) {
    Session.set('currentweek', new Date());

    Template.body.events({
      "click .last-week" : function (event) {
        var date = Session.get('currentweek');
        date = moment(date);
        date.subtract(1, 'weeks');
        Session.set('currentweek', date.toDate());
      },

      "click .next-week" : function (event) {
        var date = Session.get('currentweek');
        date = moment(date);
        date.add(1, 'weeks');
        Session.set('currentweek', date.toDate());
      },

	    "submit .new-employee" : function (event) {
		    event.preventDefault();
        var text = event.target.text.value;
		    Employees.insert({
			   name : text,
		    });
		
		    event.target.text.value = "";
	    }
      //"submit .new-shift" : function (event) {
      //  var d = event.target.day.value;
      //  var n = event.target.employee.value;
      //  var h = event.target.hours.value;
      //
      //  event.preventDefault();
      //  Shifts.insert({
      //    day : parseInt(d),
      //    name : n,
      //    hours : h
      //  });
      //
      //  event.target.day.value = "";
      //  event.target.employee.value = "";
      //  event.target.hours.value = "";
     // }
    });

    Template.hireEmployee.events({
      "submit .hireEmployee" : function (event, template) {

        event.preventDefault();
        var lastNameInfo = template.find('#lastName').value;
        var firstNameInfo = template.find('#firstName').value;
        var usernameInfo = template.find('#username').value;
        var passwordInfo = template.find('#password').value;
        var typeInfo = event.target.type.value;

        var usertobeadded = {
          username: usernameInfo,
          password: passwordInfo,
          profile: {
            lastName: lastNameInfo,
            firstName: firstNameInfo,
            type: typeInfo
          }
        };

        Meteor.call('createEmployee', usertobeadded);
        /*Accounts.createUser( usertobeadded, function (error) {
          if (error){
            console.log("creatUser error has occured");
          }
        });*/

        console.log("New hire submitted");
        console.log(lastNameInfo + " " + firstNameInfo + " " + usernameInfo + " " + passwordInfo);
        console.log(typeInfo);
        console.log(usertobeadded);

      }
    });

    Template.logoutButton.events({
      "submit .logoutButton" : function (event, template) {

        event.preventDefault();
        Meteor.logout();
        console.log("User has been logged out");

      }
    });


    Template.loginForm.events({
      "submit .loginForm" : function (event, template) {

        event.preventDefault();
        var usernameInfo = template.find('#username').value;
        var passwordInfo = template.find('#password').value;
        Meteor.loginWithPassword(usernameInfo, passwordInfo);
        console.log("Login submitted");
        console.log(usernameInfo, passwordInfo);

        if (Meteor.user()){
          console.log("we found user");
        }

        else{
          console.log("user not found");
        }

      }
    });

    Template.employee.events({
      "click .cell" : function (event) {
        event.preventDefault();
        var s = event.currentTarget.innerHTML;
        if (event.currentTarget.outerHTML.indexOf("<form") == -1) {
          var form = "<td class=\"cell\"><form class=\"change-hours\"><input type=\"text\" name=\"hours\" placeholder="+"\""+s+"\""+" autofocus></form></td>";
          event.currentTarget.outerHTML = form;
        }
      },

       "submit .change-hours" : function (event) {
        event.preventDefault();
        row = event.currentTarget.offsetParent.parentNode;
        var w = row.parentNode.parentNode.rows[0].cells[0].textContent;
        var d = event.currentTarget.offsetParent.cellIndex -1;
        var h = event.target.hours.value;
        var n = this.name;
        
        var flag = Shifts.findOne({name : n, day : d});
        if (flag == undefined) {        
          Shifts.insert({
            day : parseInt(d),
            name : n,
            hours : h,
            weeks : w
          });
          row.deleteCell(d+1);
          event.currentTarget.outerHTML = null;
        } else {
          Shifts.update(flag._id, {$set : {hours : h}});
          event.currentTarget.outerHTML = "<td class=\"cell\">"+h+"</td>";
        }
        
        
      }
    });

    
  Template.body.helpers({
    employees : function () 
    {
      return Employees.find().fetch();
    }
  });

  Template.currentLoggedIn.helpers({
    loggedInAs : function() {
      return Meteor.user().profile.firstName;
    }
  });

  Template.employee.helpers({
    day : [{num : 0}, {num : 1}, {num : 2}, {num : 3}, {num : 4}, { num : 5}, {num : 6}],

    shift : function ( d ) 
    { 
      var date = Session.get('currentweek');
      date = moment(date);
      var week = Template.parentData(2).week;
      date.add(week, 'weeks');
      return Shifts.findOne({name : Template.parentData(1).name, day : d, weeks : date.format("dddd, MMMM Do YYYY")});
    }
  });

<<<<<<< HEAD
}

if (Meteor.isServer){

  Meteor.methods({

    createEmployee : function(user) {

      /*event.preventDefault();
      var lastNameInfo = template.find('#lastName').value;
      var firstNameInfo = template.find('#firstName').value;
      var usernameInfo = template.find('#username').value;
      var passwordInfo = template.find('#password').value;
      var typeInfo = event.target.type.value;

      var usertobeadded = {
        username: usernameInfo,
        password: passwordInfo,
        profile: {
          lastName: lastNameInfo,
          firstName: firstNameInfo,
          type: typeInfo
        }
      };*/

      Accounts.createUser(user);

      /*console.log("New hire submitted");
      console.log(lastNameInfo + " " + firstNameInfo + " " + usernameInfo + " " + passwordInfo);
      console.log(typeInfo);
      console.log(usertobeadded.profile);*/
    }

  });

=======
  Template.currentWeek.helpers({
      currentweek : function () 
      {
        var date = Session.get('currentweek');
        return moment(date).format("dddd, MMMM Do YYYY");
      }
    });
    
    Template.nextWeek.helpers({
      nextweek : function () 
      {
        date = Session.get('currentweek');
        date = moment(date);
        date.add(1, 'weeks');
        return date.format("dddd, MMMM Do YYYY");
      }
    });
>>>>>>> origin/master
}