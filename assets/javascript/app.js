// Code is executed in strict mode
"use strict";

// Wrap all code in an anonymous function so functions cannot be called externally
(function () {

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

        // Add options to a dropdown
        function populateDropdowns(dropdown, min, max) {
            for (let i = min; i <= max; i++) {
                if (i < 10) {
                    dropdown.append($("<option>").text(`0${ i }`));
                } else {
                    dropdown.append($("<option>").text(i));
                }
            }
        }

        // Add options to the military hour dropdown
        populateDropdowns($("#military-hour"), 0, 23);
        // Add options to the military minute dropdown
        populateDropdowns($("#military-minute"), 0, 59);

        function validateInput() {
            return true;
        }

        // When the submit button is clicked
        $("#submit").on("click", function() {
            // Prevent the page from reloading
            event.preventDefault();

            console.log($("#military-hour").val());
            
            // Grabs user input
            let trainName = $("#train-name").val().trim();
            let destination = $("#destination").val().trim();
            let firstTimeHour = $("#military-hour").val();
            let firstTimeMinute = $("#military-minute").val();
            let frequency = $("#frequency").val().trim();

            // Add to database if all input fields are valid
            if (validateInput()) {

                // Creates local "temporary" object for holding train data
                let newTrain = {
                    trainName: trainName,
                    destination: destination,
                    firstTime: `${ firstTimeHour }:${ firstTimeMinute }`,
                    frequency: frequency
                };

                // Uploads train data to the database
                database.ref().push(newTrain);

                // Clears the form
                $("#train-name").val("");
                $("#destination").val("");
                $("#first-time").val("");
                $("#military-hour").val(0);
                $("#military-minute").val(0);
                $("#frequency").val("");
            }
        });

        // When a child is added in the database
        database.ref().on("child_added", function (childSnapshot) {
            // Store everything into a variable.
            let trainName = childSnapshot.val().trainName;
            let destination = childSnapshot.val().destination;
            let firstTime = childSnapshot.val().firstTime;
            let frequency = childSnapshot.val().frequency;
        
            // Calculate minutes away
            let nowMomment = moment();
            let firstTimeMoment = moment(firstTime, "HH:mm");
            let diffMinutes = nowMomment.diff(firstTimeMoment, "minutes");
            let minAway;
            // Case for when the current time is past the first train time
            if (diffMinutes >= 0) {
                minAway = frequency - (diffMinutes % frequency);
            // Case for when the current time is before the first train time
            } else {  // (difMinutes < 0)
                minAway = Math.abs(diffMinutes) + 1;
            }

            // Calculate next arrival time
            let nextArrival = nowMomment.add(minAway, "minutes").format("hh:mm A");
        
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