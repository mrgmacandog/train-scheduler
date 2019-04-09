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
            let firstTime = moment($("#first-time").val().trim(), "HH:mm").format("X");
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
    });
})();