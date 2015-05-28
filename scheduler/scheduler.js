Employees = new Mongo.Collection("employees");
//employee : {name : "Alex"}
Shifts = new Mongo.Collection("shifts");
//shift: {day : 2, name : "Alex", hours : "2 to 5"} 1 is Monday

if (Meteor.isClient) {
    Template.body.events({
	    "submit .new-employee" : function (event) {
		    event.preventDefault();
        var text = event.target.text.value;
		    Employees.insert({
			   name : text,
		    });
		
		    event.target.text.value = "";
	    },

      "submit .new-shift" : function (event) {
        var d = event.target.day.value;
        var n = event.target.employee.value;
        var h = event.target.hours.value;

        event.preventDefault();
        Shifts.insert({
          day : parseInt(d),
          name : n,
          hours : h
        });

        event.target.day.value = "";
        event.target.employee.value = "";
        event.target.hours.value = "";
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
        var d = event.currentTarget.offsetParent.cellIndex -1;
        var h = event.target.hours.value;
        var n = this.name;
         Shifts.insert({
          day : parseInt(d),
          name : n,
          hours : h
        });
         row.deleteCell(d+1);
         event.currentTarget.outerHTML = null;
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
      return Shifts.findOne({name : Template.parentData(1).name, day : d });
    }
  });
}