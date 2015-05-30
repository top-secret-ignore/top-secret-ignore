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
}