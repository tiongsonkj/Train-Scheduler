// Initialize Firebase
var config = {
apiKey: "AIzaSyBQ6c2E5hJrzZwI_TCCedBLo_2M0kGlbXE",
authDomain: "train-schedule-homework-f47d8.firebaseapp.com",
databaseURL: "https://train-schedule-homework-f47d8.firebaseio.com",
projectId: "train-schedule-homework-f47d8",
storageBucket: "train-schedule-homework-f47d8.appspot.com",
messagingSenderId: "625740817469"
};
firebase.initializeApp(config);

var database = firebase.database();

// current time
var currentTime = setInterval(function(){
    $("#current-time").html(moment(moment()).format("hh:mm:ss"));
    }, 1000);

// create function with submit button to submit to train schedule
$("#submit-btn").on("click", function(event) {
	event.preventDefault();

	// grab user input
	var trainName = $("#train-name").val().trim();
	var trainDestination = $("#destination").val().trim();
	// edit train time to include MOMENT.JS!!!
	// do this because we want the value as a moment?
	var firstTrainTime = $("#train-time").val().trim();
	var frequency = $("#frequency").val().trim();

	// create local object for holding train
	var newTrain = {
		train: trainName,
		destination: trainDestination,
		trainTime: firstTrainTime,
		minFrequency: frequency
	};

	// uploads the object train data to the database
	database.ref().push(newTrain);

	alert("Great you added a train!");

	// clears each text box
	$("#train-name").val("");
	$("#destination").val("");
	$("#train-time").val("");
	$("#frequency").val("");
});

// create firebase event for adding train to database
// and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {

	console.log(childSnapshot.val());

	var name = childSnapshot.val().train;
	var place = childSnapshot.val().destination;
	var firstTime = childSnapshot.val().trainTime;
	var minutes = childSnapshot.val().minFrequency;

  	// train time calculations
  	// pushed back 1 day to make sure conversion comes before current time
  	var firstTimeConverted = moment(firstTime, "hh::mm").subtract(1, "days");

  	// difference between times with minutes
  	var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");

  	// get the remainder which is the time apart
  	var remainder = timeDiff % minutes;

  	// finds minutes until the next train
  	var nextTrainMinutes = minutes - remainder;
  	
  	// finds time until next train
  	var nextTrainTime = moment().add(nextTrainMinutes, "minutes");

  // add train data into table
  $("#train-body").append("<tr><td>" + name + "</td><td>" + place + "</td><td>" +
  minutes + "</td><td>" + moment(nextTrainTime).format("hh:mm") +
   "</td><td>" + nextTrainMinutes + "</td></tr>");

});

