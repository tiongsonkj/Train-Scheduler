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

function getNextTrainTime(firstTime, timeFrequency) {

	// grab value of first train time
	var originalTime = firstTime;

	// push first time back a year to make sure it is before current time
	var firstTimeConverted = moment(originalTime, "hh:mm").subtract(1, "years");

	// current time
	var time = moment();

	// difference between times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

	// remainder of time apart
	var timeRemainder = diffTime % timeFrequency;

	// minute(s) until train
	var minutesTillNextTrain = timeFrequency - timeRemainder;
	console.log("MINUTES TILL NEXT TRAIN: " + minutesTillNextTrain);

	// next train
	var nextTrain = moment().add(minutesTillNextTrain, "minutes");
}

// create function with submit button to submit to train schedule
$("#submit-btn").on("click", function(event) {
	event.preventDefault();

	// grab user input
	var trainName = $("#train-name").val().trim();
	var trainDestination = $("#destination").val().trim();
	// edit train time to include MOMENT.JS!!!
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


	// log to console to see new object
	console.log(newTrain.train);
	console.log(newTrain.destination);
	console.log(newTrain.trainTime);
	console.log(newTrain.minFrequency);

	alert("Great you added a train!");

	// clears each text box
	$("#train-name").val("");
	$("#destination").val("");
	$("#train-time").val("");
	$("#frequency").val("");

	// call getTrainTime function here!
	// use firstTrainTime for parameter!
	// also use frequency for other parameter!
	// I THINK THIS IS RIGHT! BUT HOW DO I DISPLAY?!?!
	getNextTrainTime(firstTrainTime, frequency);
});

// create firebase event for adding train to database
// and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {

	console.log(childSnapshot.val());

	var name = childSnapshot.val().train;
	var place = childSnapshot.val().destination;
	var time = childSnapshot.val().trainTime;
	var minutes = childSnapshot.val().minFrequency;

	// log the variables above which are the train information
	console.log(name);
	console.log(place);
	console.log(time);
	console.log(minutes);

	// Prettify the employee start
  // var empStartPretty = moment.unix(empStart).format("MM/DD/YY");

  // add train data into table
  $("#train-body").append("<tr><td>" + name + "</td><td>" + place + "</td><td>" +
  minutes + "</td></tr>");

});

