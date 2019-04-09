// Wrap all code in an anonymous function so functions cannot be called externally
(function () {
    // Code is executed in strict mode
    "use strict";

    $(document).ready(function () {
        // Initialize Firebase
        let config = {
            apiKey: "AIzaSyDopop5fSyimF0aTdBQdJ1W7nZ9FAsr3C4",
            authDomain: "train-scheduler-6805e.firebaseapp.com",
            databaseURL: "https://train-scheduler-6805e.firebaseio.com",
            projectId: "train-scheduler-6805e",
            storageBucket: "train-scheduler-6805e.appspot.com",
            messagingSenderId: "344303899198"
        };
        firebase.initializeApp(config);

        // Assign the the firebase databse as a variable
        let database = firebase.database();

        // When the submit button is clicked
        $("#submit").on("click", function() {
            // Prevent the page from reloading
            event.preventDefault();
            
            // Grabs user input
            let trainName = $("#train-name").val().trim();
            let destination = $("#destination").val().trim();
            let firstTime = $("#first-time").val().trim();
            let frequency = $("#frequency").val().trim();

            // Creates local "temporary" object for holding train data
            let newTrain = {
                trainName: trainName,
                destination: destination,
                firstTime: firstTime,
                frequency: frequency
            };

            // Uploads train data to the database
            database.ref().push(newTrain);

            // Clears all of the text-boxes
            $("#train-name").val("");
            $("#destination").val("");
            $("#first-time").val("");
            $("#frequency").val("");
        });

        // When a child is added in the database
        database.ref().on("child_added", function (childSnapshot) {
            console.log(childSnapshot.val());
        
            // Store everything into a variable.
            let trainName = childSnapshot.val().trainName;
            let destination = childSnapshot.val().destination;
            let firstTime = childSnapshot.val().firstTime;
            let frequency = childSnapshot.val().frequency;
        
            // Train Info
            console.log(trainName);
            console.log(destination);
            console.log(firstTime);
            console.log(frequency);
        
            // Calculate minutes away
            // TODO: Implement what happens if it's currently before the first time
            let nowMomment = moment();
            let firstTimeMoment = moment(firstTime, "HH:mm");
            let diffMinutes = nowMomment.diff(firstTimeMoment, "minutes");
            console.log("Diff Minutes:", diffMinutes);
            let minAway = frequency - (diffMinutes % frequency)
            console.log("Minutes Away:", minAway);

            // Calculate next arrival time
            let nextArrival = nowMomment.add(minAway, "minutes").format("HH:mm A");
        
            // Create the new row
            let newRow = $("<tr>").append(
              $("<td>").text(trainName),
              $("<td>").text(destination),
              $("<td>").text(frequency),
              $("<td>").text(nextArrival),
              $("<td>").text(minAway)
            );
        
            // Append the new row to the table
            $("#train-table > tbody").append(newRow);
        });
    });
})();