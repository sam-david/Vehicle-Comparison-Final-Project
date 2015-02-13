var carMakes = [],
 carMakes2 = [],
 carModels = [],
 fullCarModels = [],
 carMake = "",
 carModel = "",
 carModelName = "",
 carID = "",
 zip = 0,
 state = "",
 gasPrice = 0,
 energyPrice = 0,
 vehiclePhoto = [],
 yearTotals = {},

 carYear = 0,
 carIDs = [],
 modelID = {},

 compFuel = 0,
 compCost = 0,
 compFuelTankSize = 0,
 combinedMPG = 0,
 teslaTotalCost = 0,

 teslaFuelCost = 0,
 compFuelCost = 0,

 compPerformanceTest = 6,
 compMPGTest = false,
 compCostTest = 35,
 compPerformanceNames = [],

 teslaType = "",
 teslaCityMPG = [94,88,88],
 teslaHwyMPG = [97,90,90],
 teslaCombinedMPG = [95,89,89],
 teslaMileCapacity = [208,265,265], /* miles teslamotors.com */
 tesla60Sec = [5.9,5.4,4.2], /* sec teslamotors.com */
 teslaHorsepower = [302,362,416], /* hp teslamotors.com */
 teslaTorque = [317,325,443], /* lbs teslamotors.com */
 teslaWeight = 4647, /* teslamotors.com */
 teslaAeroDrag = .24, /* teslamotors.com */
 teslaTurnRadius = 37, /* ft teslamotors.com */
 teslaCargoCapacity = 31.6,  /* cubic feet. teslamotors.com */
 teslaInsurance = [2274,2274,2274,2274,2274], /* From http://www.motortrend.com/cars/2013/tesla/model_s/cost_of_ownership/ */
 teslaFinancing = [2065,1635,1189,743,265], /* From http://www.motortrend.com/cars/2013/tesla/model_s/cost_of_ownership/ */

 tesla60AnnualCosts = {
    insurance: [2274,2274,2274,2274,2274],
    financing: [2065,1635,1189,743,265],
    depreciation: [16699,6361,6228,6102,5983],
    taxandfees: [5960,18,18,18,18,6032],
    maintenance: [600,600,600,600,600,3000],
    repairs: [0,0,0,0,0,0],
    taxcredit: [-7500,0,0,0,0]
 };

 tesla60Depreciation = [16699,6361,6228,6102,5983], /* All the below expenses courtesy of Tesla Cost of Ownership Documentation Provided By Tesla */
 tesla60Tax = [5960,18,18,18,18,6032],
 tesla60Fuel = [340,340,340,340,340,1700],
 tesla60Maintenance = [600,600,600,600,600,3000],
 tesla60Repairs = [0,0,0,0,0,0],
 tesla60TaxCredit = [-7500,0,0,0,0,-7500];

 tesla85AnnualCosts = {
    insurance: [2274,2274,2274,2274,2274],
    financing: [2065,1635,1189,743,265],
    depreciation: [19088,7271,7119,6975,6839],
    taxandfees: [6810,18,18,18,18],
    maintenance: [600,600,600,600,600],
    repairs: [0,0,0,0,0],
    taxcredit: [-7500,0,0,0,0]
 };

 tesla85Depreciation = [19088,7271,7119,6975,6839],
 tesla85Tax = [6810,18,18,18,18],
 tesla85Fuel = [340,340,340,340,340],
 tesla85Maintenance = [600,600,600,600,600],
 tesla85Repairs = [0,0,0,0,0],
 tesla85TaxCredit = [-7500,0,0,0,0];

teslap85AnnualCosts = {
    insurance: [2274,2274,2274,2274,2274],
    financing: [2065,1635,1189,743,265],
    depreciation: [22672,8636,8456,8285,8123],
    taxandfees: [8085,18,18,18,18],
    maintenance: [600,600,600,600,600],
    repairs: [0,0,0,0,0],
    taxcredit: [-7500,0,0,0,0]
};

 teslap85Depreciation = [22672,8636,8456,8285,8123],
 teslap85Tax = [8085,18,18,18,18],
 teslap85Fuel = [340,340,340,340,340],
 teslap85Maintenance = [600,600,600,600,600],
 teslap85Repairs = [0,0,0,0,0],
 teslap85TaxCredit = [-7500,0,0,0,0],
 year1TeslaCost = 0,
 compFuelTotal = 0,
 compInsuranceTotal = 0,
 compMaintenanceTotal = 0,
 compRepairsTotal = 0,
 compDepreciationTotal = 0,
 compTaxTotal = 0,
 compFinancingTotal = 0,
 compTaxCreditTotal = 0,
 compGrandTotal = 0,
 compYear1 = 0,
 compYear2 = 0,
 compYear3 = 0,
 compYear4 = 0,
 compYear5 = 0,
 loadTest = false;

  compAnnualCosts = {
    fuel: [],
    insurance: [],
    maintenance: [],
    repairs: [],
    depreciation: [],
    taxandfees: [],
    financing: [],
    yearTotals: [0,0,0,0,0],
    grandTotal: 0
  };

  previousFuelCost = 0;

// firebase reference for database
 var myDataRef = new Firebase('https://tesla-comparison.firebaseio.com/');

$(document).ready(function(){

    $(document).foundation();

// grabs current nation average gas price to start
	$.getJSON("http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_NUS_DPG.W", function(json) {
	 	gasPrice = json.series[0].data[0][1];
        $("#currentgas").text("$" + gasPrice.toFixed(2));
	});

// grabs current nation average energy price
    $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=ELEC.PRICE.US-RES.M', function(json) {
        energyPrice = (json.series[0].data[0][1] / 100).toFixed(2);
        $("#currentenergy").text('$' + energyPrice);
    });

});

$(document).foundation({
  slider: {
    on_change: function(){
        miles = $('#our-stupid-slider').attr('data-slider');
        if (miles < 5000) {
        $("#annual-miles").text("00000" + miles);
        } else if (miles < 10000) {
            $("#annual-miles").text("00" + miles);
        } else if (miles < 100000 & miles >= 10000) {
            $("#annual-miles").text("0" + miles);
        } else {
            $("#annual-miles").text(miles);
        }
        teslaFuelCost = ((miles * .33) * energyPrice);
        teslaFuelTotal = teslaFuelCost * 5;
        teslaAnnualCost(teslaType);
        $("#tesla-fuel-total").text('$' + teslaFuelTotal.toFixed(0));
        $('#tesla-fuel-cost').text('$ ' + teslaFuelCost.toFixed(0));
        compFuelCost = ((miles / combinedMPG) * gasPrice);
        compFuelTotal = compFuelCost * 5;
        populateCompFuel();
        populateTCOData();
        $("#comp-fuel-cost").text('$ ' + compFuelCost.toFixed(0));
        $("#comp-fuel-total").text('$' + compFuelTotal.toFixed(0));
        // $("#comp-grand-total").text('$' + compGrandTotal.toFixed(0));
        $("#fuel-cost-difference").text('$ ' + (compFuelCost - teslaFuelCost).toFixed(0));
        }
    }
});

function populateCompFuel () {

    if (previousFuelCost == 0) {
        for (j = 0; j < 5; j++) {
        console.log("no previous");
        $("#comp-fuel" + (j + 1)).text('$' + compFuelCost.toFixed(0));
        compAnnualCosts.yearTotals[j] += compFuelCost;
        }
    } else {
        for (j = 0; j < 5; j++) {
        console.log("pervoius");
        $("#comp-fuel" + (j + 1)).text('$' + compFuelCost.toFixed(0));
        compAnnualCosts.yearTotals[j] -= previousFuelCost;
        compAnnualCosts.yearTotals[j] += compFuelCost;
        previousFuelCost = compFuelCost;
        }
    }
}

// mile slider change function, calculates
// function fuelPriceUpdate(miles) {
//     if (miles < 5000) {
//         $("#annual-miles").text("00000" + miles);
//     } else if (miles < 10000) {
//         $("#annual-miles").text("00" + miles);
//     } else if (miles < 100000 & miles >= 10000) {
//         $("#annual-miles").text("0" + miles);
//     } else {
//         $("#annual-miles").text(miles);
//     }
//     teslaFuelCost = ((miles * .33) * energyPrice).toFixed(0);
//     $('#tesla-fuel-cost').text('$ ' + teslaFuelCost);
//     compFuelCost = ((miles / combinedMPG) * gasPrice).toFixed(0);
//     $("#comp-fuel-cost").text('$ ' + compFuelCost);
//     $("#fuel-cost-difference").text('$ ' + (compFuelCost - teslaFuelCost));
// }

function fuelPriceSet() {
    teslaFuelCost = ((20000 * .33) * energyPrice).toFixed(0);
    teslaFuelTotal = teslaFuelCost * 5;
    for(i = 0; i < 5; i++) {
                $("#tesla-fuel" + (i + 1)).text('$' + teslaFuelCost);
            }
        $("#tesla-fuel-total").text('$' + teslaFuelTotal);
    $('#tesla-fuel-cost').text('$ ' + teslaFuelCost);
    compFuelCost = ((20000 / combinedMPG) * gasPrice).toFixed(0);
    populateCompFuel();
    $("#comp-fuel-cost").text('$ ' + compFuelCost);
    $("#fuel-cost-difference").text('$ ' + (compFuelCost - teslaFuelCost));
}

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

 // Select box on change functions

		$("#yearSelect").change(function() {
            carYear = $("#yearSelect").val();
            populateMakeSelect(carYear);
            setTimeout(function(){
                $("#makeSelect").prop('disabled', false);
            }, 800);
		});

		$("#makeSelect").change(function() {
            carMake = $("#makeSelect").val();
            populateModelSelect(carYear,carMake);
            setTimeout(function(){
                $("#modelSelect").prop('disabled', false);
            }, 500);
		});

        $("#modelSelect").change(function() {
            carModel =  $("#modelSelect").val();
            populateTrimSelect(carModel, carMake, carYear);
            setTimeout(function(){
                $("#trimSelect").prop('disabled', false);
            }, 500);
        });

        $("#trimSelect").change(function() {
            $("#zipCode").prop('disabled', false);
            $("#stateSelect").prop('disabled', false);
        });

// Populate Make select boxe by clearing all boxes after Make, then adding Edmunds Makes to select box
    function populateMakeSelect (year) {
        $('#makeSelect').children('option').remove();
        $('#modelSelect').children('option').remove();
        $('#trimSelect').children('option').remove();
        $('#makeSelect').append($("<option></option>").attr("value",0).text('Make'));
        $('#modelSelect').append($("<option></option>").attr("value",0).text('Model'));
        $('#trimSelect').append($("<option></option>").attr("value",0).text('Trim'));
        $("#modelSelect").prop('disabled', true);
        $("#trimSelect").prop('disabled', true);
        $("#stateSelect").prop('disabled', true);
         if (year > 2013) {
                $.getJSON('https://api.edmunds.com/api/vehicle/v2/makes?state=new&year=' + year + '&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                    for (j = 0; j < json.makes.length; j++){
                        $('#makeSelect').append('<option value="' + json.makes[j].name + '">' + json.makes[j].name + '</option>');
                    }
                });
        } else {
                $.getJSON('https://api.edmunds.com/api/vehicle/v2/makes?state=used&year=' + year + '&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                    for (j = 0; j < json.makes.length; j++){
                        $('#makeSelect').append('<option value="' + json.makes[j].name + '">' + json.makes[j].name + '</option>');
                    }
                });
            }
    }

// Populate Model select boxe by clearing all boxes after Model, then adding Edmunds Models to select box
    function populateModelSelect (year, make) {
        $('#modelSelect').children('option').remove();
        $('#trimSelect').children('option').remove();
        $('#modelSelect').append($("<option></option>").attr("value",0).text('Model'));
        $('#trimSelect').append($("<option></option>").attr("value",0).text('Trim'));
        $("#trimSelect").prop('disabled', true);
        $("#stateSelect").prop('disabled', true);
        if (year > 2013) {
            $.getJSON('https://api.edmunds.com/api/vehicle/v2/makes?state=new&year=' + year + '&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                for (j = 0; j < json.makes.length; j++) {
                    if (json.makes[j].name === make) {
                        for (m = 0; m < json.makes[j].models.length; m++){
                            $('#modelSelect').append('<option value="' + json.makes[j].models[m].niceName + '">' + json.makes[j].models[m].name + '</option>');
                        }
                    } else {
                    }
                }
            });
        } else {
            $.getJSON('https://api.edmunds.com/api/vehicle/v2/makes?state=used&year=' + year + '&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                for (j = 0; j < json.makes.length; j++) {
                    if (json.makes[j].name === make) {
                        for (m = 0; m < json.makes[j].models.length; m++){
                            $('#modelSelect').append('<option value="' + json.makes[j].models[m].niceName + '">' + json.makes[j].models[m].name + '</option>');
                        }
                    } else {
                    }
                }
            });
        }
    }

// Populate Trim select boxe by clearing Trim, then adding Edmunds Trims to select box
    function populateTrimSelect (model, make, year) {
        $('#trimSelect').children('option').remove();
        $('#trimSelect').append($("<option></option>").attr("value",0).text('Trim'));
        $("#stateSelect").prop('disabled', true);
        $('#zipCode').prop('disabled', true);
        if (carYear > 2013){
            $.getJSON('https://api.edmunds.com/api/vehicle/v2/' + make.toLowerCase() + '/' + model + '?state=new&year=' + year + '&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                for (j = 0; j < json.years[0].styles.length; j++) {
                    $('#trimSelect').append('<option value="' + json.years[0].styles[j].id + '">' + json.years[0].styles[j].name + '</option>');
                }
             });
        } else {
            $.getJSON('https://api.edmunds.com/api/vehicle/v2/' + make.toLowerCase() + '/' + model + '?state=used&year=' + year + '&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                for (j = 0; j < json.years[0].styles.length; j++) {

                    $('#trimSelect').append('<option value="' + json.years[0].styles[j].id + '">' + json.years[0].styles[j].name + '</option>');
                }
             });
        }
    }


//Annual cost for loop through Edmunds API from JSON request in other function

    function pullTCOData (json) {
            compAnnualCosts.grandTotal = 0;
            compAnnualCosts.insurance[5] = 0;
            compAnnualCosts.maintenance[5] = 0;
            compAnnualCosts.repairs[5] = 0;
            compAnnualCosts.depreciation[5] = 0;
            compAnnualCosts.taxandfees[5] = 0;
            compAnnualCosts.financing[5] = 0;
                for (j = 0; j < 5; j++) {
                    if (isNaN(json.fuel.values[j]) === true ) {
                        $("#comp-fuel" + (j + 1)).text("unknown");
                    } else {
                        compAnnualCosts.yearTotals[j] += compFuelCost;
                        compAnnualCosts.grandTotal += compFuelCost;
                        $("#comp-fuel" + (j + 1)).text('$' + compFuelCost);
                    }
                    if (isNaN(json.insurance.values[j]) === true ) {
                        $("#comp-insurance" + (j + 1)).text("unknown");
                    } else {
                        compCostTest -= 1;
                        compAnnualCosts.insurance[j] = json.insurance.values[j];
                        compAnnualCosts.insurance[5] += json.insurance.values[j];
                        compAnnualCosts.yearTotals[j] += json.insurance.values[j];
                        compAnnualCosts.grandTotal += json.insurance.values[j];
                        $("#comp-insurance" + (j + 1)).text('$' + compAnnualCosts.insurance[j]);
                    }
                    if (isNaN(json.maintenance.values[j]) === true ) {
                        $("#comp-maintenance" + (j + 1)).text("unknown");
                    } else {
                        compCostTest -= 1;
                        compAnnualCosts.maintenance[j] = json.maintenance.values[j];
                        compAnnualCosts.maintenance[5] += json.maintenance.values[j];
                        compAnnualCosts.yearTotals[j] += json.maintenance.values[j];
                        compAnnualCosts.grandTotal += json.maintenance.values[j];
                        $("#comp-maintenance" + (j + 1)).text('$' + compAnnualCosts.maintenance[j]);
                    }
                    if (isNaN(json.repairs.values[j]) === true ) {
                        $("#comp-repairs" + (j + 1)).text("unknown");
                    } else {
                        compCostTest -= 1;
                        compAnnualCosts.repairs[j] = json.repairs.values[j];
                        compAnnualCosts.repairs[5] += json.repairs.values[j];
                        compAnnualCosts.yearTotals[j] += json.repairs.values[j];
                        compAnnualCosts.grandTotal += json.repairs.values[j];
                        $("#comp-repairs" + (j + 1)).text('$' + compAnnualCosts.repairs[j]);
                    }
                    if (isNaN(json.depreciation.values[j]) === true ) {
                        $("#comp-depreciation" + (j + 1)).text("unknown");
                    } else {
                        compCostTest -= 1;
                        compAnnualCosts.depreciation[j] = json.depreciation.values[j];
                        compAnnualCosts.depreciation[5] += json.depreciation.values[j];
                        compAnnualCosts.yearTotals[j] += json.depreciation.values[j];
                        compAnnualCosts.grandTotal += json.depreciation.values[j];
                        $("#comp-depreciation" + (j + 1)).text('$' + compAnnualCosts.depreciation[j]);
                    }
                    if (isNaN(json.taxandfees.values[j]) === true ) {
                        $("#comp-tax" + (j + 1)).text("unknown");
                    } else {
                        compCostTest -= 1;
                        compAnnualCosts.taxandfees[j] = json.taxandfees.values[j];
                        compAnnualCosts.taxandfees[5] += json.taxandfees.values[j];
                        compAnnualCosts.yearTotals[j] += json.taxandfees.values[j];
                        compAnnualCosts.grandTotal += json.taxandfees.values[j];
                        $("#comp-tax" + (j + 1)).text('$' + compAnnualCosts.taxandfees[j]);
                    }
                    if (isNaN(json.financing.values[j]) === true ) {
                        $("#comp-financing" + (j + 1)).text("unknown");
                    } else {
                        compCostTest -= 1;
                        compAnnualCosts.financing[j] += json.financing.values[j];
                        compAnnualCosts.financing[5] += json.financing.values[j];
                        compAnnualCosts.yearTotals[j] += json.financing.values[j];
                        compAnnualCosts.grandTotal += json.financing.values[j];
                        $("#comp-financing" + (j + 1)).text('$' + json.financing.values[j]);
                    }
                   $("#comp-tax-credit" + (j + 1)).text('$' + 0);
               }
                populateCompFuel(20000,combinedMPG);
                console.log(compAnnualCosts);
                console.log(compAnnualCosts.yearTotals[0]);
                $("#comp-year1-total").text('$' + compAnnualCosts.yearTotals[0]);
                $("#comp-year2-total").text('$' + compAnnualCosts.yearTotals[1]);
                $("#comp-year3-total").text('$' + compAnnualCosts.yearTotals[2]);
                $("#comp-year4-total").text('$' + compAnnualCosts.yearTotals[3]);
                $("#comp-year5-total").text('$' + compAnnualCosts.yearTotals[4]);
                $("#comp-fuel-total").text('$' + compFuelTotal.toFixed(0));
                $("#comp-insurance-total").text('$' + compAnnualCosts.insurance[5]);
                $("#comp-maintenance-total").text('$' + compAnnualCosts.maintenance[5]);
                $("#comp-repairs-total").text('$' + compAnnualCosts.repairs[5]);
                $("#comp-depreciation-total").text('$' + compAnnualCosts.depreciation[5]);
                $("#comp-tax-total").text('$' + compAnnualCosts.taxandfees[5]);
                $("#comp-financing-total").text('$' + compAnnualCosts.financing[5]);
                $("#comp-tax-credit-total").text('$' + 0);
                $("#comp-grand-total").text('$' + compAnnualCosts.grandTotal);
    }

// JSON request for TCO data on car (Both New and Used car Functions)
    function populateTCOData (id, zip, state) {
        if (carYear > 2013) {
            $.getJSON('https://api.edmunds.com/api/tco/v1/details/allnewtcobystyleidzipandstate/' + id + '/' + zip + '/' + state + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                pullTCOData(json);
            });
        } else {
            $.getJSON('https://api.edmunds.com/api/tco/v1/details/allusedtcobystyleidzipandstate/' + id + '/' + zip + '/' + state + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                pullTCOData(json);
            });
        }

    }

// Populate performance data from two separate JSON requests, second reqeust delayed by 1.5 sec
    function populatePerformanceData (id) {
        $.getJSON('https://api.edmunds.com/api/vehicle/v2/styles/' + id + '?view=full&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
            if (isNaN(json.engine.horsepower) === false && isNaN(json.engine.horsepower) === false) {
                combinedMPG = Math.round((json.MPG.city * .55) + (json.MPG.highway * .45));
                $("#comp-MPG-combined").text(combinedMPG);
                $("#comp-MPG-city").text(json.MPG.city);
                $("#comp-MPG-highway").text(json.MPG.highway);
                compMPGTest = true;
            } else {
                compMPGTest = false;
            }

            if (isNaN(json.engine.horsepower) === true ) {
                $("#comp-horsepower").text('unknown');
            } else {
                $("#comp-horsepower").text(json.engine.horsepower + ' hp');
                compPerformanceTest -= 1;
            }
            if (isNaN(json.engine.torque) === true ) {
                $("#comp-torque").text('unknown');
            } else {
                $("#comp-torque").text(json.engine.torque + ' lbs');
                compPerformanceTest -= 1;
            }
            alertify.log("Tesla " + teslaType + " VS. " + carMake + " " + json.model.name);
            $("#comparison-title").text(carMake + " " + json.model.name);
            $("#comparison-title-performance").text(carMake + " " + json.model.name);
            $("#comp-annual-title").text(carMake + " " + json.model.name);
        });
        setTimeout(function(){
                $.getJSON('https://api.edmunds.com/api/vehicle/v2/styles/' + id + '/equipment?availability=standard&equipmentType=OTHER&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
            for (j = 0; j < json.equipment.length; j++) {
                if (json.equipment[j].name === "Specifications") {
                    for (q = 0; q < json.equipment[j].attributes.length; q++) {
                        if (json.equipment[j].attributes[q].name === "Aerodynamic Drag (cd)") {
                            compPerformanceTest -= 1;
                            $("#comp-airdrag").text(json.equipment[j].attributes[q].value);
                        } else if (json.equipment[j].attributes[q].name === "Curb Weight") {
                            compPerformanceTest -= 1;
                            $("#comp-weight").text(json.equipment[j].attributes[q].value + ' lbs');
                        } else if (json.equipment[j].attributes[q].name === "Epa Combined Mpg") {
                            combinedMPG = json.equipment[j].attributes[q].value;
                        } else if (json.equipment[j].attributes[q].name === "Fuel Capacity") {
                            compFuelTankSize = json.equipment[j].attributes[q].value;
                            var totalMilesCapacity = (compFuelTankSize * combinedMPG).toFixed(0);
                            $("#comp-capacity").text(json.equipment[j].attributes[q].value + ' gal (' + totalMilesCapacity + ' miles)');
                        } else if (json.equipment[j].attributes[q].name === "Manufacturer 0 60mph Acceleration Time (seconds)") {
                            compPerformanceTest -= 1;
                            compPerformanceNames.push('60');
                            $("#comp-0-60").text(json.equipment[j].attributes[q].value + ' sec.');
                        } else if (json.equipment[j].attributes[q].name === "Turning Diameter") {
                            compPerformanceTest -= 1;
                            $("#comp-radius").text(json.equipment[j].attributes[q].value + ' ft.');
                        }
                    }
                }
            }
        });
    }, 1500);


    }

// Populate tesla performance data
function teslaData (tesla) {
        if (tesla === "60") {
            $("#tesla-horsepower").text(teslaHorsepower[0] + " hp");
            $("#tesla-torque").text(teslaTorque[0] + " lbs");
            $("#tesla-airdrag").text(teslaAeroDrag);
            $("#tesla-cargo-capacity").text(teslaCargoCapacity);
            $("#tesla-weight").text(teslaWeight + ' lbs');
            $("#tesla-MPG-combined").text(teslaCombinedMPG[0]);
            $("#tesla-MPG-city").text(teslaCityMPG[0]);
            $("#tesla-MPG-highway").text(teslaHwyMPG[0]);
            $("#tesla-0-60").text(tesla60Sec[0] + ' sec.');
            $("#tesla-radius").text(teslaTurnRadius + ' ft.');
            $("#tesla-photo").attr('src','images/model-s-60.jpg');
            $("#tesla-title").text('Tesla Model S 60');
            $("#tesla-title-performance").text('Tesla Model S 60');
        } else if (tesla === "85") {
            $("#tesla-horsepower").text(teslaHorsepower[1] + " hp");
            $("#tesla-torque").text(teslaTorque[1] + " lbs");
            $("#tesla-airdrag").text(teslaAeroDrag);
            $("#tesla-cargo-capacity").text(teslaCargoCapacity);
            $("#tesla-weight").text(teslaWeight + ' lbs');
            $("#tesla-MPG-combined").text(teslaCombinedMPG[1]);
            $("#tesla-MPG-city").text(teslaCityMPG[1]);
            $("#tesla-MPG-highway").text(teslaHwyMPG[1]);
            $("#tesla-0-60").text(tesla60Sec[1] + ' sec.');
            $("#tesla-radius").text(teslaTurnRadius + ' ft.');
            $("#tesla-photo").attr('src','images/model-s-85.jpg');
            $("#tesla-title").text('Tesla Model S 85');
            $("#tesla-title-performance").text('Tesla Model S 85');
        } else {
            $("#tesla-horsepower").text(teslaHorsepower[2] + " hp");
            $("#tesla-torque").text(teslaTorque[2] + " lbs");
            $("#tesla-airdrag").text(teslaAeroDrag);
            $("#tesla-cargo-capacity").text(teslaCargoCapacity);
            $("#tesla-weight").text(teslaWeight + ' lbs');
            $("#tesla-MPG-combined").text(teslaCombinedMPG[2]);
            $("#tesla-MPG-city").text(teslaCityMPG[2]);
            $("#tesla-MPG-highway").text(teslaHwyMPG[2]);
            $("#tesla-0-60").text(tesla60Sec[2] + ' sec.');
            $("#tesla-radius").text(teslaTurnRadius + ' ft.');
            $("#tesla-photo").attr('src','images/model-s-p85.jpg');
            $("#tesla-title").text('Tesla Model S p85');
            $("#tesla-title-performance").text('Tesla Model S p85');
        }
    }

// Populate tesla annual cost data
    function teslaAnnualCost (tesla) {
        teslaInsuranceTotal = 0, teslaMaintenanceTotal = 0, teslaRepairsTotal = 0,
        teslaDepreciationTotal = 0, teslaTaxTotal = 0, teslaFinancingTotal = 0, teslaTaxCreditTotal = 0, teslaGrandTotal = 0;
        if (tesla === "60") {
            for(i = 0; i < 5; i++) {
                $("#tesla-fuel" + (i + 1)).text('$' + teslaFuelCost.toFixed(0));
                $("#tesla-insurance" + (i + 1)).text('$' + teslaInsurance[i]);
                teslaInsuranceTotal += teslaInsurance[i];
                $("#tesla-maintenance" + (i + 1)).text('$' + tesla60Maintenance[i]);
                teslaMaintenanceTotal += tesla60Maintenance[i];
                $("#tesla-repairs" + (i + 1)).text('$' + tesla60Repairs[i]);
                teslaRepairsTotal += tesla60Repairs[i];
                $("#tesla-depreciation" + (i + 1)).text('$' + tesla60Depreciation[i]);
                teslaDepreciationTotal += tesla60Depreciation[i];
                $("#tesla-tax" + (i + 1)).text('$' + tesla60Tax[i]);
                teslaTaxTotal += tesla60Tax[i];
                $("#tesla-financing" + (i + 1)).text('$' + teslaFinancing[i]);
                teslaFinancingTotal += teslaFinancing[i];
                $("#tesla-tax-credit" + (i + 1)).text('$' + tesla60TaxCredit[i]);
                teslaTaxCreditTotal += tesla60TaxCredit[i];
                var total = teslaFuelCost + tesla60TaxCredit[i] + teslaInsurance[i] + tesla60Maintenance[i] + tesla60Repairs[i] + tesla60Depreciation[i] + tesla60Tax[i]  + teslaFinancing[i];
                teslaGrandTotal += total;
                $("#tesla-total-year" + (i + 1)).text('$' + total.toFixed(0));
            }

        } else if (tesla === "85") {
            for(i = 0; i < 5; i++) {
                $("#tesla-fuel" + (i + 1)).text('$' + teslaFuelCost.toFixed(0));
                $("#tesla-insurance" + (i + 1)).text('$' + teslaInsurance[i]);
                teslaInsuranceTotal += teslaInsurance[i];
                $("#tesla-maintenance" + (i + 1)).text('$' + tesla85Maintenance[i]);
                teslaMaintenanceTotal += tesla85Maintenance[i];
                $("#tesla-repairs" + (i + 1)).text('$' + tesla85Repairs[i]);
                teslaRepairsTotal += tesla85Repairs[i];
                $("#tesla-depreciation" + (i + 1)).text('$' + tesla85Depreciation[i]);
                teslaDepreciationTotal += tesla85Depreciation[i];
                $("#tesla-tax" + (i + 1)).text('$' + tesla85Tax[i]);
                teslaTaxTotal += tesla85Tax[i];
                $("#tesla-financing" + (i + 1)).text('$' + teslaFinancing[i]);
                teslaFinancingTotal += teslaFinancing[i];
                $("#tesla-tax-credit" + (i + 1)).text('$' + tesla85TaxCredit[i]);
                teslaTaxCreditTotal += tesla85TaxCredit[i];
                var total = teslaFuelCost + tesla85TaxCredit[i] + teslaInsurance[i] + tesla85Maintenance[i] + tesla85Repairs[i] + tesla85Depreciation[i] + tesla85Tax[i]  + teslaFinancing[i];
                teslaGrandTotal += total;
                $("#tesla-total-year" + (i + 1)).text('$' + total.toFixed(0));
            }
        } else if (tesla === "p85") {
            for(i = 0; i < 5; i++) {
                $("#tesla-fuel" + (i + 1)).text('$' + teslaFuelCost.toFixed(0));
                $("#tesla-insurance" + (i + 1)).text('$' + teslaInsurance[i]);
                teslaInsuranceTotal += teslaInsurance[i];
                $("#tesla-maintenance" + (i + 1)).text('$' + teslap85Maintenance[i]);
                teslaMaintenanceTotal += teslap85Maintenance[i];
                $("#tesla-repairs" + (i + 1)).text('$' + teslap85Repairs[i]);
                teslaRepairsTotal += teslap85Repairs[i];
                $("#tesla-depreciation" + (i + 1)).text('$' + teslap85Depreciation[i]);
                teslaDepreciationTotal += teslap85Depreciation[i];
                $("#tesla-tax" + (i + 1)).text('$' + teslap85Tax[i]);
                teslaTaxTotal += teslap85Tax[i];
                $("#tesla-financing" + (i + 1)).text('$' + teslaFinancing[i]);
                teslaFinancingTotal += teslaFinancing[i];
                $("#tesla-tax-credit" + (i + 1)).text('$' + teslap85TaxCredit[i]);
                teslaTaxCreditTotal += teslap85TaxCredit[i];
                var total = teslaFuelCost + teslap85TaxCredit[i] + teslaInsurance[i] + teslap85Maintenance[i] + teslap85Repairs[i] + teslap85Depreciation[i] + teslap85Tax[i]  + teslaFinancing[i];
                teslaGrandTotal += total;
                $("#tesla-total-year" + (i + 1)).text('$' + total.toFixed(0));
            }
        }
        $("#tesla-insurance-total").text('$' + teslaInsuranceTotal);
        $("#tesla-maintenance-total").text('$' + teslaMaintenanceTotal);
        $("#tesla-repairs-total").text('$' + teslaRepairsTotal);
        $("#tesla-depreciation-total").text('$' + teslaDepreciationTotal);
        $("#tesla-tax-total").text('$' + teslaTaxTotal);
        $("#tesla-financing-total").text('$' + teslaFinancingTotal);
        $("#tesla-tax-credit-total").text('$' + teslaTaxCreditTotal);
        $("#tesla-grand-total").text('$' + teslaGrandTotal.toFixed(0));
    }


    function populateEnergyPrices (state) {
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=ELEC.PRICE.' + state +'-RES.M ', function(json) {
            energyPrice = (json.series[0].data[0][1] / 100);
            $("#currentenergy").text(state + ' $' + energyPrice.toFixed(2));
            });
    }

    function populateGasPrices (state) {
        if (state === "ME" || state === "CT" || state === "NH" || state === "RI" || state === "VT") {
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R1X_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "DE" || state === "DC" || state === "MD" || state === "NJ" || state === "NY"|| state === "PA"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R1Y_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "GA" || state === "NC" || state === "SC" || state === "VA"|| state === "WV"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R1Z_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "IL" || state === "IN" || state === "IO" || state === "KS" || state === "KY"|| state === "MI" || state === "MO" || state === "NE" || state === "ND" || state === "SD" || state === "OH" || state === "OK" || state === "TN" || state === "WI"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R20_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "AL" || state === "AR" || state === "LA" || state === "MS" || state === "NM"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R30_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "ID" || state === "MT" || state === "UT" || state === "WY"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R40_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "AK" || state === "AZ" || state === "HI" || state === "NV" || state === "OR"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R50_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "CA"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMR_PTE_SCA_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "CO"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SCO_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "FL"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SFL_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "MA"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMR_PTE_SMA_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "MN"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SMN_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "NY"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SNY_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "OH"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SOH_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "TX"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_STX_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        } else if (state === "WA"){
            $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SWA_DPG.W', function(json) {

            gasPrice = (json.series[0].data[0][1]);
            $("#currentgas").text(state + ' $' + gasPrice.toFixed(2));
            });
        }
    }

function reset () {
    location.reload();
}

function populatePhoto (id) {
    $.getJSON('https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId=' + id + '&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
        for(j = 0; j < json.length; j++) {
            if (json[j].subType === "exterior" && json[j].shotTypeAbbreviation === "FQ") {
                for(i = 0; i < json[j].photoSrcs.length; i++) {
                    var photo = json[j].photoSrcs[i];
                    if (photo.indexOf(500) > -1) {
                        // vehiclePhoto.push(json[j].photoSrcs[i]);
                        vehiclePhoto[0] = json[j].photoSrcs[i];
                    }
                }
            }
        }
        $("#comparison-photo").attr('src','http://media.ed.edmunds-media.com' + vehiclePhoto[0]);

    }).fail(function() {
        console.log("image load failed");
        });
}





function adjustEnergyPrice (adjust) {
        if (energyPrice <= .01) {
             alertify.alert("Energy must be more than .01");
        } else {
                if (adjust === "up") {
                energyPrice = (parseFloat(energyPrice) + .01).toFixed(2);
                $("#currentenergy").text('$' + energyPrice);
            } else if (adjust === "down") {
                energyPrice = (parseFloat(energyPrice) - .01).toFixed(2);
                $("#currentenergy").text('$' + energyPrice);
            }
        }
}

function adjustGasPrice (adjust) {
        if (gasPrice <= .01) {
             alertify.alert("Gas must be more than .01");
        } else {
                if (adjust === "up") {
                gasPrice = (parseFloat(gasPrice) + .01).toFixed(2);
                $("#currentgas").text('$' + gasPrice);
            } else if (adjust === "down") {
                gasPrice = (parseFloat(gasPrice) - .01).toFixed(2);
                $("#currentgas").text('$' + gasPrice);
            }
        }
}

function totalCarValue (zip, id, tesla) {
    $.getJSON('https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/' + id + '/' + zip + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
        $("#comp-value").text('$' + json.value);
    });
    setTimeout(function(){
                if (tesla === "60") {
        $.getJSON('https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/200691966/' + zip + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
        $("#tesla-value").text('$' + json.value);
        });
    } else if (tesla === "85") {
        $.getJSON('https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/200692320/' + zip + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
        $("#tesla-value").text('$' + json.value);
        });
    } else if (tesla === "p85") {
        $.getJSON('https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/200691967/' + zip + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
        $("#tesla-value").text('$' + json.value);
        });
    }
            }, 3500);
}

function submitFirebase () {
    myDataRef.push({
        caryear: carYear,
        make: carMake,
        model: carModel,
        edmundsID: carID,
        state: state,
        zipcode: zip,
        fiveyeartotal: compGrandTotal
        });
}


function navLinks () {
    if (compMPGTest === true ) {
        $(".fuel-section-div1").fadeIn( 3000 );
        $(".fuel-section-div2").fadeIn( 3000 );
        setTimeout(function(){
            $('.mile-slider').css('visibility','visible');
        }, 2500);
        $('#fuel-nav-button').css('border-color','green');
        $('#fuel-nav-button').removeAttr('disabled');
    } else {
        $('#fuel-nav-button').css('border-color','red');
    }
    if (compPerformanceTest < 2 ) {
        $(".performance-section-div").fadeIn( 3000 );
        $('#performance-nav-button').css('border-color','green');
        $('#performance-nav-button').removeAttr('disabled');
    } else if (compPerformanceTest >= 2 && compPerformanceTest < 5) {
        $(".performance-section-div").fadeIn( 3000 );
        $('#performance-nav-button').css('border-color','yellow');
        $('#performance-nav-button').removeAttr('disabled');
    } else {
        $('#performance-nav-button').css('border-color','red');
    }
    if (compCostTest < 10 ) {
        $(".comp-annual-div").fadeIn( 3000 );
        $('#comp-cost-nav-button').css('border-color','green');
        $('#comp-cost-nav-button').removeAttr('disabled');
    } else if (compCostTest >= 10 && compCostTest < 25) {
        $(".comp-annual-div").fadeIn( 3000 );
        $('#comp-cost-nav-button').css('border-color','yellow');
        $('#comp-cost-nav-button').removeAttr('disabled');
    } else {
        $('#comp-cost-nav-button').css('border-color','red');
    }
    $(".tesla-annual-div").fadeIn( 3000 );
    $(".section-nav").fadeIn( 1000 );
    $('#tesla-cost-nav-button').css('border-color','green');
    $('#tesla-cost-nav-button').removeAttr('disabled');
}

function populateCar (carID,zip,state) {
    loadTest = true;
    teslaData(teslaType);
    teslaAnnualCost(teslaType);
    populatePerformanceData(carID);
    populateEnergyPrices(state);
    populateGasPrices(state);
    setTimeout(function(){
        populateTCOData(carID,zip,state);
        populatePhoto(carID);
    }, 3500);
    setTimeout(function(){
        navLinks();
        fuelPriceSet();
    }, 6500);
    setTimeout(function(){
        submitFirebase();
    }, 7000);
}


 google.load("visualization", "1", {packages:["corechart"]});

      // google.setOnLoadCallback(drawChart);


    function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Tesla', 'Comp'],
          ['2015',  compYear1,  2160],
          ['2016',  compYear2,  9005],
          ['2017',  11540,  8560],
          ['2018',  10950,  9187],
          ['2019',  10336,  9719]
        ]);

        var data2 = google.visualization.arrayToDataTable([
          ['Year', 'Tesla', 'Comp'],
          ['2015',  88134,  68134],
          ['2016',  69046,  59046],
          ['2017',  61775,  51775],
          ['2018',  54656,  34656],
          ['2019',  47681,  27681]
        ]);

        var options = {
          title: 'Tesla vs. Comp Total Annual Costs ($Dollars)',
          curveType: 'function',
          colors: ['#bf0021','black'],
          backgroundColor: '#809BBF',
          legend: { position: 'bottom', alignment: 'center', textStyle: {fontSize: 16} }
        };

        var options2 = {
          title: 'Tesla vs. Comp Total Depreciation ($Dollars)',
          curveType: 'function',
          colors: ['#bf0021','black'],
          backgroundColor: '#809BBF',
          legend: { position: 'bottom', alignment: 'center', textStyle: {fontSize: 16} }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);

        var chart2 = new google.visualization.LineChart(document.getElementById('chart2_div'));
        chart2.draw(data2, options2);

      }

function submitCar () {
        carID =  $("#trimSelect").val();
        zip = $("#zipCode").val();
        state = $("#stateSelect").val();
            if (zip.length === 5 & teslaType != "") {
                if(loadTest === false) {
                    populateCar(carID,zip,state);
                } else if(loadTest === true) {
                    $(".fuel-section-div1").hide();
                    $(".fuel-section-div2").hide();
                    $('.mile-slider').css('visibility','hidden');
                    $(".performance-section-div").hide();
                    $(".comp-annual-div").hide();
                    $(".tesla-annual-div").hide();
                    $(".section-nav").hide();
                    populateCar(carID,zip,state);
                }
            } else if (zip.length === 5 & teslaType === "") {
               alertify.alert("Please select Tesla Type");
            } else if (zip.length != 5 & teslaType != "") {
                alertify.alert("Please select a Comparison Car");
            }  else {
                alertify.alert("Please select a Tesla and Comparison Car");
            }
        }
