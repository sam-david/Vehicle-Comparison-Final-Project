// Model S 60 button on click functions
$("#60kwh").click(function () {
        teslaType = "60";
        $("#60kwh").css("border-color", "#FFB426");
        $("#85kwh").css("border-color", "#bf0021");
        $("#p85kwh").css("border-color", "#bf0021");
    });

// Model S 85 button on click functions
$("#85kwh").click(function () {
        teslaType = "85";
        $("#85kwh").css("border-color", "#FFB426");
        $("#60kwh").css("border-color", "#bf0021");
        $("#p85kwh").css("border-color", "#bf0021");
    });

// Model S p85 button on click functions
$("#p85kwh").click(function () {
        teslaType = "p85";
        $("#p85kwh").css("border-color", "#FFB426");
        $("#85kwh").css("border-color", "#bf0021");
        $("#60kwh").css("border-color", "#bf0021");
        $("#60kwh-description").css("border-color", "#bf0021");
        $("#85kwh-description").css("border-color", "#bf0021");
        $("#p85kwh-description").css("border-color", "#FFB426");
    });
