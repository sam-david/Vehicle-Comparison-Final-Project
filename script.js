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
 compPerformanceNames = [],

 teslaType = "",
 teslaCityMPG = [94,88,88],
 teslaHwyMPG = [97,90,90],
 teslaCombinedMPG = [95,89,89],
 teslaMileCapacity = [208,265,265], /* miles teslamotors.com */
 tesla60Sec = [5.9,5.4,4.2], /* sec teslamotors.com */
 teslaHorsepower = [302,362,416], /* hp teslamotors.com */
 teslaTorque = [317,325,443], /* lbs teslamotors.com */
 teslaWeight = 4647.3, /* teslamotors.com */
 teslaAeroDrag = .24, /* teslamotors.com */
 teslaTurnRadius = 37, /* ft teslamotors.com */
 teslaCargoCapacity = 31.6,  /* cubic feet. teslamotors.com */
 teslaInsurance = [2274,2274,2274,2274,2274], /* From http://www.motortrend.com/cars/2013/tesla/model_s/cost_of_ownership/ */
 teslaFinancing = [2065,1635,1189,743,265], /* From http://www.motortrend.com/cars/2013/tesla/model_s/cost_of_ownership/ */
 tesla60Depreciation = [16699,6361,6228,6102,5983], /* All the below expenses courtesy of Tesla Cost of Ownership Documentation Provided By Tesla */
 tesla60Tax = [5960,18,18,18,18,6032],
 tesla60Fuel = [340,340,340,340,340,1700],
 tesla60Maintenance = [600,600,600,600,600,3000],
 tesla60Repairs = [0,0,0,0,0,0],
 tesla60TaxCredit = [-7500,0,0,0,0,-7500],
 tesla85Depreciation = [19088,7271,7119,6975,6839],
 tesla85Tax = [6810,18,18,18,18],
 tesla85Fuel = [340,340,340,340,340],
 tesla85Maintenance = [600,600,600,600,600],
 tesla85Repairs = [0,0,0,0,0],
 tesla85TaxCredit = [-7500,0,0,0,0],
 teslap85Depreciation = [22672,8636,8456,8285,8123],
 teslap85Tax = [8085,18,18,18,18],
 teslap85Fuel = [340,340,340,340,340],
 teslap85Maintenance = [600,600,600,600,600],
 teslap85Repairs = [0,0,0,0,0],
 teslap85TaxCredit = [-7500,0,0,0,0],
 year1TeslaCost = 0,
 teslaFuelTotal = 0,
 teslaInsuranceTotal = 0,
 teslaMaintenanceTotal = 0,
 teslaRepairsTotal = 0,
 teslaDepreciationTotal = 0,
 teslaTaxTotal = 0,
 teslaFinancingTotal = 0,
 teslaTaxCreditTotal = 0,
 teslaGrandTotal = 0,
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
 compYear5 = 0;

 var myDataRef = new Firebase('https://tesla-comparison.firebaseio.com/')

$(document).ready(function(){

        // $("#yearSelect").chosen().change(console.log("chosen sucks") console.log("test"));

        // $("#makeSelect").chosen({
            
        // });


    	$("#60kwh").mouseover(function() {
            $("#60kwh").css("border-color", "#FFB426");
            $("#60kwh-description").css("border-color", "#FFB426");
    	});

        $("#60kwh-description").mouseover(function() {
            $("#60kwh").css("border-color", "#FFB426");
            $("#60kwh-description").css("border-color", "#FFB426");
        });

    	$("#60kwh").mouseout(function() {
            if(teslaType === "60") {
                $("#60kwh").css("border-color", "#FFB426");
                $("#60kwh-description").css("border-color", "#FFB426");
            } else {
                $("#60kwh").css("border-color", "#bf0021");
                $("#60kwh-description").css("border-color", "#bf0021");
            }
    	});

        $("#60kwh-description").mouseout(function() {
            if(teslaType === "60") {
                $("#60kwh").css("border-color", "#FFB426");
                $("#60kwh-description").css("border-color", "#FFB426");
            } else {
                $("#60kwh").css("border-color", "#bf0021");
                $("#60kwh-description").css("border-color", "#bf0021");
            }
        });

        
    	$("#85kwh").mouseover(function() {
    		$("#85kwh").css("border-color", "#FFB426");
            $("#85kwh-description").css("border-color", "#FFB426");
    	});

        $("#85kwh-description").mouseover(function() {
            $("#85kwh").css("border-color", "#FFB426");
            $("#85kwh-description").css("border-color", "#FFB426");
        });

    	$("#85kwh").mouseout(function() {
            if(teslaType === "85") {
                $("#85kwh").css("border-color", "#FFB426");
                $("#85kwh-description").css("border-color", "#FFB426");
            } else {
                $("#85kwh").css("border-color", "#bf0021");
                $("#85kwh-description").css("border-color", "#bf0021");
            }
    	});

        $("#85kwh-description").mouseout(function() {
            if(teslaType === "85") {
                $("#85kwh").css("border-color", "#FFB426");
                $("#85kwh-description").css("border-color", "#FFB426");
            } else {
                $("#85kwh").css("border-color", "#bf0021");
                $("#85kwh-description").css("border-color", "#bf0021");
            }
        });

    	$("#p85kwh").mouseover(function() {
    		$("#p85kwh").css("border-color", "#FFB426");
            $("#p85kwh-description").css("border-color", "#FFB426");
    	});

        $("#p85kwh-description").mouseover(function() {
            $("#p85kwh").css("border-color", "#FFB426");
            $("#p85kwh-description").css("border-color", "#FFB426");
        });

    	$("#p85kwh").mouseout(function() {
            if(teslaType === "p85") {
                $("#p85kwh").css("border-color", "#FFB426");
                $("#p85kwh-description").css("border-color", "#FFB426");
            } else {
                $("#p85kwh").css("border-color", "#bf0021");
                $("#p85kwh-description").css("border-color", "#bf0021");
            }
    	});

        $("#p85kwh-description").mouseout(function() {
            if(teslaType === "p85") {
                $("#p85kwh").css("border-color", "#FFB426");
                $("#p85kwh-description").css("border-color", "#FFB426");
            } else {
                $("#p85kwh").css("border-color", "#bf0021");
                $("#p85kwh-description").css("border-color", "#bf0021");
            }
        });

	$.getJSON("http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_NUS_DPG.W", function(json) {
	 	gasPrice = json.series[0].data[0][1];
        $("#currentgas").text("$" + gasPrice.toFixed(2));
	});

    $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=ELEC.PRICE.US-RES.M', function(json) {
        energyPrice = (json.series[0].data[0][1] / 100).toFixed(2);
        $("#currentenergy").text('$' + energyPrice);
    });

   $("#mileslide").bind("slider:changed", function (event, data) {
        teslaFuelCost = ((data.value * .33) * energyPrice).toFixed(0);
        $("#tesla-fuel-cost").text('$ ' + teslaFuelCost);
        compFuelCost = ((data.value / combinedMPG) * gasPrice).toFixed(0);
        console.log(data.value, combinedMPG, gasPrice);
        $("#comp-fuel-cost").text('$ ' + compFuelCost);
        $("#annualMiles").text(data.value + " Miles");
        $("#fuel-cost-difference").text('$ ' + (compFuelCost - teslaFuelCost));
    });


});

        $("#60kwh").click(function () {
            teslaType = "60";
            $("#60kwh").css("border-color", "#FFB426");
            $("#85kwh").css("border-color", "#bf0021");
            $("#p85kwh").css("border-color", "#bf0021");
            $("#60kwh-description").css("border-color", "#FFB426");
            $("#85kwh-description").css("border-color", "#bf0021");
            $("#p85kwh-description").css("border-color", "#bf0021");
        });

        $("#60kwh-description").click(function () {
            teslaType = "60";
            $("#60kwh").css("border-color", "#FFB426");
            $("#85kwh").css("border-color", "#bf0021");
            $("#p85kwh").css("border-color", "#bf0021");
            $("#60kwh-description").css("border-color", "#FFB426");
            $("#85kwh-description").css("border-color", "#bf0021");
            $("#p85kwh-description").css("border-color", "#bf0021");
        });

        $("#85kwh").click(function () {
            teslaType = "85";
            $("#85kwh").css("border-color", "#FFB426");
            $("#60kwh").css("border-color", "#bf0021");
            $("#p85kwh").css("border-color", "#bf0021");
            $("#60kwh-description").css("border-color", "#bf0021");
            $("#85kwh-description").css("border-color", "#FFB426");
            $("#p85kwh-description").css("border-color", "#bf0021");
        });

        $("#85kwh-description").click(function () {
            teslaType = "85";
            $("#85kwh").css("border-color", "#FFB426");
            $("#60kwh").css("border-color", "#bf0021");
            $("#p85kwh").css("border-color", "#bf0021");
            $("#60kwh-description").css("border-color", "#bf0021");
            $("#85kwh-description").css("border-color", "#FFB426");
            $("#p85kwh-description").css("border-color", "#bf0021");
        });

         $("#p85kwh").click(function () {
            teslaType = "p85";
            $("#p85kwh").css("border-color", "#FFB426");
            $("#85kwh").css("border-color", "#bf0021");
            $("#60kwh").css("border-color", "#bf0021");
            $("#60kwh-description").css("border-color", "#bf0021");
            $("#85kwh-description").css("border-color", "#bf0021");
            $("#p85kwh-description").css("border-color", "#FFB426");
        });

         $("#p85kwh-description").click(function () {
            teslaType = "p85";
            $("#p85kwh").css("border-color", "#FFB426");
            $("#85kwh").css("border-color", "#bf0021");
            $("#60kwh").css("border-color", "#bf0021");
            $("#60kwh-description").css("border-color", "#bf0021");
            $("#85kwh-description").css("border-color", "#bf0021");
            $("#p85kwh-description").css("border-color", "#FFB426");
        });

		$("#yearSelect").change(function() {
			$("#makeSelect").prop('disabled', false);
			carYear = $("#yearSelect").val();
            populateMakeSelect(carYear);
		});

        // $('#yearSelect').chosen().change(
        //     carYear = $("#yearSelect").val();
        //     populateMakeSelect(carYear);
        //     );


		$("#makeSelect").change(function() {
            carMake = $("#makeSelect").val();
			$("#modelSelect").prop('disabled', false);
            populateModelSelect(carYear,carMake);
		});

        $("#modelSelect").change(function() {
            carModel =  $("#modelSelect").val();
            $("#specificModelSelect").prop('disabled', false);
            individualModels(carModel, carMake, carYear);
        });


        $("#specificModelSelect").change(function() {
            $("#zipCode").prop('disabled', false);
            $("#stateSelect").prop('disabled', false);
        });

    function populateMakeSelect (year) {
         if (year > 2012) {
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

    function populateModelSelect (year, make) {
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


    function individualModels (model, make, year) {
        if (carYear > 2013){
            $.getJSON('https://api.edmunds.com/api/vehicle/v2/' + make.toLowerCase() + '/' + model + '?state=new&year=' + year + '&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                for (j = 0; j < json.years[0].styles.length; j++) {
                    
                    $('#specificModelSelect').append('<option value="' + json.years[0].styles[j].id + '">' + json.years[0].styles[j].name + '</option>');
                }
             });
        } else {
            $.getJSON('https://api.edmunds.com/api/vehicle/v2/' + make.toLowerCase() + '/' + model + '?state=used&year=' + year + '&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                for (j = 0; j < json.years[0].styles.length; j++) {
                    
                    $('#specificModelSelect').append('<option value="' + json.years[0].styles[j].id + '">' + json.years[0].styles[j].name + '</option>');
                }
             });
        }
    }

    function submitCar () {
        carID =  $("#specificModelSelect").val();
        zip = $("#zipCode").val();
        state = $("#stateSelect").val();
        console.log(carID);
        if (zip.length === 5 & teslaType != "") {
            populateTCOData(carID,zip,state);
            teslaData(teslaType);
            teslaAnnualCost(teslaType);
            populatePerformanceData(carID);
            populateEnergyPrices(state);
            populateGasPrices(state);
            populatePhoto(carID);
            comparisonAlertify(carID);
            fightAppear();
            submitFirebase();
            totalCarValue(zip, carID);
            navLinks();
        } else if (zip.length === 5 & teslaType === "") { 
           alertify.alert("Please select Tesla Type");
        } else if (zip.length != 5 & teslaType != "") { 
           alertify.alert("Please select a Location");
        } else {
            alertify.alert("Please fill out all of the data forms");
        }
    }

    function populateTCOData (id, zip, state) {
        if (carYear > 2013) {
            $.getJSON('https://api.edmunds.com/api/tco/v1/details/allnewtcobystyleidzipandstate/' + id + '/' + zip + '/' + state + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                // compCost = json.fuel.values[0] + json.insurance.values[0] + json.maintenance.values[0] + json.repairs.values[0] + json.depreciation.values[0] + json.taxandfees.values[0] + json.financing.values[0];
                if (isNaN(json.fuel.values[0]) === true ) {
                        $("#comp-fuel").text("N/A");
                    } else {
                        $("#comp-fuel").text('$' + json.fuel.values[0]);
                        compCost += json.fuel.values[0];
                    }
                if (isNaN(json.insurance.values[0]) === true ) {
                        $("#comp-insurance").text("N/A");
                    } else {
                        $("#comp-insurance").text('$' + json.insurance.values[0]);
                        compCost += json.insurance.values[0];
                    }
                if (isNaN(json.maintenance.values[0]) === true ) {
                        $("#comp-maintenance").text("N/A");
                    } else {
                        $("#comp-maintenance").text('$' + json.maintenance.values[0]);
                        compCost += json.maintenance.values[0];
                    }
                if (isNaN(json.repairs.values[0]) === true ) {
                        $("#comp-repairs").text("N/A");
                    } else {
                        $("#comp-repairs").text('$' + json.repairs.values[0]);
                        compCost += json.repairs.values[0];
                    }
                if (isNaN(json.depreciation.values[0]) === true ) {
                        $("#comp-depreciation").text("N/A");
                    } else {
                        $("#comp-depreciation").text('$' + json.depreciation.values[0]);
                        compCost += json.depreciation.values[0];
                    }
                if (isNaN(json.taxandfees.values[0]) === true ) {
                        $("#comp-tax").text("N/A");
                    } else {
                        $("#comp-tax").text('$' + json.taxandfees.values[0]);
                        compCost += json.taxandfees.values[0];
                    }
                if (isNaN(json.financing.values[0]) === true ) {
                        $("#comp-financing").text("N/A");
                    } else {
                        $("#comp-financing").text('$' + json.financing.values[0]);
                        compCost += json.financing.values[0];
                    }
                $("#comp-tax-credit").text('$' + 0);
                $("#comp-total").text('$' + compCost);
                for (j = 0; j < 5; j++) { //Annual Cost For Loop Through API
                    if (isNaN(json.fuel.values[j]) === true ) {
                        $("#comp-fuel" + (j + 1)).text("N/A");
                    } else {
                        $("#comp-fuel" + (j + 1)).text('$' + json.fuel.values[j]);
                        compFuelTotal += json.fuel.values[j];
                    }
                    if (isNaN(json.insurance.values[j]) === true ) {
                        $("#comp-insurance" + (j + 1)).text("N/A");
                    } else {
                        $("#comp-insurance" + (j + 1)).text('$' + json.insurance.values[j]);
                        compInsuranceTotal += json.insurance.values[j];
                    }
                    if (isNaN(json.maintenance.values[j]) === true ) {
                        $("#comp-maintenance" + (j + 1)).text("N/A");
                    } else {
                        $("#comp-maintenance" + (j + 1)).text('$' + json.maintenance.values[j]);
                        compMaintenanceTotal += json.maintenance.values[j];
                    }
                    if (isNaN(json.repairs.values[j]) === true ) {
                        $("#comp-repairs" + (j + 1)).text("N/A");
                    } else {
                        $("#comp-repairs" + (j + 1)).text('$' + json.repairs.values[j]);
                        compRepairsTotal += json.repairs.values[j];
                    }
                    if (isNaN(json.depreciation.values[j]) === true ) {
                        $("#comp-depreciation" + (j + 1)).text("N/A");
                    } else {
                        $("#comp-depreciation" + (j + 1)).text('$' + json.depreciation.values[j]);
                        compDepreciationTotal += json.depreciation.values[j];
                    }
                    if (isNaN(json.taxandfees.values[j]) === true ) {
                        $("#comp-tax" + (j + 1)).text("N/A");
                    } else {
                        $("#comp-tax" + (j + 1)).text('$' + json.taxandfees.values[j]);
                        compTaxTotal += json.taxandfees.values[j];
                    }
                    if (isNaN(json.financing.values[j]) === true ) {
                        $("#comp-financing" + (j + 1)).text("N/A");
                    } else {
                        $("#comp-financing" + (j + 1)).text('$' + json.financing.values[j]);
                        compFinancingTotal += json.financing.values[j];
                    }
                   $("#comp-tax-credit" + (j + 1)).text('$' + 0); 
                }
                $("#comp-fuel-total").text('$' + compFuelTotal);
                $("#comp-insurance-total").text('$' + compInsuranceTotal);
                $("#comp-maintenance-total").text('$' + compMaintenanceTotal);
                $("#comp-repairs-total").text('$' + compRepairsTotal);
                $("#comp-depreciation-total").text('$' + compDepreciationTotal);
                $("#comp-tax-total").text('$' + compTaxTotal);
                $("#comp-financing-total").text('$' + compFinancingTotal);
                $("#comp-tax-credit-total").text('$' + 0);
                compYear1 = 
                $("#comp-grand-total").text('$' + (compFuelTotal + compInsuranceTotal + compMaintenanceTotal + compRepairsTotal + compDepreciationTotal + compTaxTotal + compFinancingTotal));
            });
        } else {
            $.getJSON('https://api.edmunds.com/api/tco/v1/details/allusedtcobystyleidzipandstate/' + id + '/' + zip + '/' + state + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                compCost = json.fuel.values[0] + json.insurance.values[0] + json.maintenance.values[0] + json.repairs.values[0] + json.depreciation.values[0] + json.taxandfees.values[0] + json.financing.values[0];
                $("#comp-fuel").text('$' + json.fuel.values[0]);
                $("#comp-insurance").text('$' + json.insurance.values[0]);
                $("#comp-maintenance").text('$' + json.maintenance.values[0]);
                $("#comp-repairs").text('$' + json.repairs.values[0]);
                $("#comp-depreciation").text('$' + json.depreciation.values[0]);
                $("#comp-tax").text('$' + json.taxandfees.values[0]);
                $("#comp-financing").text('$' + json.financing.values[0]);
                $("#comp-total").text('$' + compCost);
                  for (j = 0; j < 6; j++) {
                   $("#comp-fuel" + (j + 1)).text('$' + json.fuel.values[j]);
                   $("#comp-insurance" + (j + 1)).text('$' + json.insurance.values[j]);
                   $("#comp-maintenance" + (j + 1)).text('$' + json.maintenance.values[j]);
                   $("#comp-repairs" + (j + 1)).text('$' + json.repairs.values[j]);
                   $("#comp-depreciation" + (j + 1)).text('$' + json.depreciation.values[j]);
                   $("#comp-tax" + (j + 1)).text('$' + json.taxandfees.values[j]);
                   $("#comp-financing" + (j + 1)).text('$' + json.financing.values[j]);
                }
            });
        }
        
    }

    function teslaData (tesla) {
        if (tesla === "60") {
            teslaTotalCost = tesla60Fuel[0] + teslaInsurance[0] + tesla60Maintenance[0] + tesla60Repairs[0] + tesla60Depreciation[0] + tesla60Tax[0] + teslaFinancing[0] + tesla60TaxCredit[0];
            $("#tesla-fuel").text('$' + tesla60Fuel[0]);
            $("#tesla-insurance").text('$' + teslaInsurance[0]);
            $("#tesla-maintenance").text('$' + tesla60Maintenance[0]);
            $("#tesla-repairs").text('$' + tesla60Repairs[0]);
            $("#tesla-depreciation").text('$' + tesla60Depreciation[0]);
            $("#tesla-tax").text('$' + tesla60Tax[0]);
            $("#tesla-financing").text('$' + teslaFinancing[0]);
            $("#tesla-tax-credit").text('$' + tesla60TaxCredit[0]);
            $("#tesla-total").text('$' + teslaTotalCost);
            $("#tesla-horsepower").text(teslaHorsepower[0] + " hp");
            $("#tesla-torque").text(teslaTorque[0] + " lbs");
            $("#tesla-airdrag").text(teslaAeroDrag);
            $("#tesla-cargo-capacity").text(teslaCargoCapacity);
            $("#tesla-weight").text(teslaWeight + ' lbs');
            $("#tesla-MPG-combined").text(teslaCombinedMPG[0] + " MPG");
            $("#tesla-MPG").text(teslaCityMPG[0] + ' / ' + teslaHwyMPG[0]);
            $("#tesla-capacity").text(teslaMileCapacity[0] + " miles");
            $("#tesla-0-60").text(tesla60Sec[0] + ' sec.');
            $("#tesla-radius").text(teslaTurnRadius + ' ft.');
            $("#tesla-photo").attr('src','images/model-s-60.jpg');
            $("#tesla-title").text('Tesla Model S 60');
            $("#tesla-title-performance").text('Tesla Model S 60');
        } else if (tesla === "85") {
            teslaTotalCost = tesla85Fuel[0] + teslaInsurance[0] + tesla85Maintenance[0] + tesla85Repairs[0] + tesla85Depreciation[0] + tesla85Tax[0] + teslaFinancing[0] + tesla85TaxCredit[0];
            $("#tesla-fuel").text('$' + tesla85Fuel[0]);
            $("#tesla-insurance").text('$' + teslaInsurance[0]);
            $("#tesla-maintenance").text('$' + tesla85Maintenance[0]);
            $("#tesla-repairs").text('$' + tesla85Repairs[0]);
            $("#tesla-depreciation").text('$' + tesla85Depreciation[0]);
            $("#tesla-tax").text('$' + tesla85Tax[0]);
            $("#tesla-financing").text('$' + teslaFinancing[0]);
            $("#tesla-tax-credit").text('$' + tesla85TaxCredit[0]);
            $("#tesla-total").text('$' + teslaTotalCost);
            $("#tesla-horsepower").text(teslaHorsepower[1] + " hp");
            $("#tesla-torque").text(teslaTorque[1] + " lbs");
            $("#tesla-airdrag").text(teslaAeroDrag);
            $("#tesla-cargo-capacity").text(teslaCargoCapacity);
            $("#tesla-weight").text(teslaWeight + ' lbs');
            $("#tesla-MPG-combined").text(teslaCombinedMPG[1] + " MPG");
            $("#tesla-MPG").text(teslaCityMPG[1] + ' / ' + teslaHwyMPG[1]);
            $("#tesla-capacity").text(teslaMileCapacity[1] + " miles");
            $("#tesla-0-60").text(tesla60Sec[1] + ' sec.');
            $("#tesla-radius").text(teslaTurnRadius + ' ft.');
            $("#tesla-photo").attr('src','images/model-s-85.jpg');
            $("#tesla-title").text('Tesla Model S 85');
            $("#tesla-title-performance").text('Tesla Model S 85');
        } else {
            teslaTotalCost = teslap85Fuel[0] + teslaInsurance[0] + teslap85Maintenance[0] + teslap85Repairs[0] + teslap85Depreciation[0] + teslap85Tax[0] + teslaFinancing[0] + teslap85TaxCredit[0];
            $("#tesla-fuel").text('$' + teslap85Fuel[0]);
            $("#tesla-insurance").text('$' + teslaInsurance[0]);
            $("#tesla-maintenance").text('$' + teslap85Maintenance[0]);
            $("#tesla-repairs").text('$' + teslap85Repairs[0]);
            $("#tesla-depreciation").text('$' + teslap85Depreciation[0]);
            $("#tesla-tax").text('$' + teslap85Tax[0]);
            $("#tesla-financing").text('$' + teslaFinancing[0]);
            $("#tesla-tax-credit").text('$' + teslap85TaxCredit[0]);
            $("#tesla-total").text('$' + teslaTotalCost);
            $("#tesla-horsepower").text(teslaHorsepower[2] + " hp");
            $("#tesla-torque").text(teslaTorque[2] + " lbs");
            $("#tesla-airdrag").text(teslaAeroDrag);
            $("#tesla-cargo-capacity").text(teslaCargoCapacity);
            $("#tesla-weight").text(teslaWeight + ' lbs');
            $("#tesla-MPG-combined").text(teslaCombinedMPG[2] + " MPG");
            $("#tesla-MPG").text(teslaCityMPG[2] + ' / ' + teslaHwyMPG[2]);
            $("#tesla-capacity").text(teslaMileCapacity[2] + " miles");
            $("#tesla-0-60").text(tesla60Sec[2] + ' sec.');
            $("#tesla-radius").text(teslaTurnRadius + ' ft.');
            $("#tesla-photo").attr('src','images/model-s-p85.jpg');
            $("#tesla-title").text('Tesla Model S p85');
            $("#tesla-title-performance").text('Tesla Model S p85');
        }
    }

    function populatePerformanceData (id) {
        $.getJSON('https://api.edmunds.com/api/vehicle/v2/styles/' + id + '?view=full&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
            combinedMPG = Math.round((json.MPG.city * .55) + (json.MPG.highway * .45));
            $("#comp-MPG-combined").text(combinedMPG + ' MPG');
            $("#comp-MPG").text(json.MPG.city + ' / ' + json.MPG.highway);
            if (isNaN(json.engine.horsepower) === true ) {
                $("#comp-horsepower").text('N/A');
            } else {
                $("#comp-horsepower").text(json.engine.horsepower + ' hp');
                compPerformanceTest -= 1;
            }
            if (isNaN(json.engine.torque) === true ) {
                $("#comp-torque").text('N/A');
            } else {
                $("#comp-torque").text(json.engine.torque + ' lbs');
                compPerformanceTest -= 1;
            }
            alertify.log("Tesla " + teslaType + " VS. " + carMake + " " + json.model.name);
            $("#comparison-title").text(carMake + " " + json.model.name);
            $("#comparison-title-performance").text(carMake + " " + json.model.name);
        });
        $.getJSON('https://api.edmunds.com/api/vehicle/v2/styles/' + id + '/equipment?availability=standard&equipmentType=OTHER&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
            for (j = 0; j < json.equipment.length; j++) {
                if (json.equipment[j].name === "Specifications") {
                    for (q = 0; q < json.equipment[j].attributes.length; q++) {
                        if (json.equipment[j].attributes[q].name === "Aerodynamic Drag (cd)") {
                            compPerformanceTest -= 1;
                            compPerformanceNames.push('AD');
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
            console.log(compPerformanceTest);
        });
        
    }


    function teslaAnnualCost (tesla) {
        if (tesla === "60") {
            for(i = 0; i < 5; i++) {
                $("#tesla-fuel" + (i + 1)).text('$' + tesla60Fuel[i]);
                teslaFuelTotal += tesla60Fuel[i];
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
                var total = tesla60TaxCredit[i] + tesla60Fuel[i] + teslaInsurance[i] + tesla60Maintenance[i] + tesla60Repairs[i] + tesla60Depreciation[i] + tesla60Tax[i]  + teslaFinancing[i];
                teslaGrandTotal += total;
                $("#tesla-total-year" + (i + 1)).text('$' + total);
            }
            
        } else if (tesla === "85") {
            for(i = 0; i < 5; i++) {
                $("#tesla-fuel" + (i + 1)).text('$' + tesla85Fuel[i]);
                teslaFuelTotal += tesla85Fuel[i];
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
                var total = tesla85TaxCredit[i] + tesla85Fuel[i] + teslaInsurance[i] + tesla85Maintenance[i] + tesla85Repairs[i] + tesla85Depreciation[i] + tesla85Tax[i]  + teslaFinancing[i];
                teslaGrandTotal += total;
                $("#tesla-total-year" + (i + 1)).text('$' + total);
            }
        } else if (tesla === "p85") {
            for(i = 0; i < 6; i++) {
                $("#tesla-fuel" + (i + 1)).text('$' + teslap85Fuel[i]);
                $("#tesla-insurance" + (i + 1)).text('$' + teslaInsurance[i]);
                $("#tesla-maintenance" + (i + 1)).text('$' + teslap85Maintenance[i]);
                $("#tesla-repairs" + (i + 1)).text('$' + teslap85Repairs[i]);
                $("#tesla-depreciation" + (i + 1)).text('$' + teslap85Depreciation[i]);
                $("#tesla-tax" + (i + 1)).text('$' + teslap85Tax[i]);
                $("#tesla-financing" + (i + 1)).text('$' + teslaFinancing[i]);
                $("#tesla-tax-credit" + (i + 1)).text('$' + teslap85TaxCredit[i]);
            }
        }
        $("#tesla-fuel-total").text('$' + teslaFuelTotal);
        $("#tesla-insurance-total").text('$' + teslaInsuranceTotal);
        $("#tesla-maintenance-total").text('$' + teslaMaintenanceTotal);
        $("#tesla-repairs-total").text('$' + teslaRepairsTotal);
        $("#tesla-depreciation-total").text('$' + teslaDepreciationTotal);
        $("#tesla-tax-total").text('$' + teslaTaxTotal);
        $("#tesla-financing-total").text('$' + teslaFinancingTotal);
        $("#tesla-tax-credit-total").text('$' + teslaTaxCreditTotal);
        $("#tesla-grand-total").text('$' + teslaGrandTotal);
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

function comparisonAlertify (id) {
    // $.getJSON('https://api.edmunds.com/api/vehicle/v2/styles/'+ id + '?view=full&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
    // alertify.log("Tesla " + teslaType + " VS. " + carMake + " " + json.model.name);
    // $("#comparison-title").text(carMake + " " + json.model.name);
    // });
}

function reset () {
    console.log("poop");
}

function populatePhoto (id) {
    $.getJSON('https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId=' + id + '&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
        for(j = 0; j < json.length; j++) {
            if (json[j].subType === "exterior" && json[j].shotTypeAbbreviation === "FQ") {
                for(i = 0; i < json[j].photoSrcs.length; i++) {
                    var photo = json[j].photoSrcs[i];
                    if (photo.indexOf(500) > -1) {
                        vehiclePhoto.push(json[j].photoSrcs[i]);
                    }
                }
            }
        }
        $("#comparison-photo").attr('src','http://media.ed.edmunds-media.com' + vehiclePhoto[0]);
        
    }).fail(function() {
        console.log("failed but worked");
            $.getJSON('https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId=' + id + '&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
        for(j = 0; j < json.length; j++) {
            if (json[j].subType === "exterior" && json[j].shotTypeAbbreviation === "FQ") {
                for(i = 0; i < json[j].photoSrcs.length; i++) {
                    var photo = json[j].photoSrcs[i];
                    if (photo.indexOf(500) > -1) {
                        vehiclePhoto.push(json[j].photoSrcs[i]);
                    }
                }
            }
        }
        $("#comparison-photo").attr('src','http://media.ed.edmunds-media.com' + vehiclePhoto[0]);
        
            });
        });
}

function fightAppear ( ) {
    $( ".car-photo" ).fadeIn( 1000 );
    $( ".car-photo-small" ).fadeIn( 1000 );
    $( ".car-display-title" ).fadeIn( 1000 );
    $( ".vs-icon" ).fadeIn( 1000 );
    $( ".fuel-economy-comparison" ).fadeIn( 1000 );
}


function submitFirebase () {
    var contact = $('#email').val();
    myDataRef.push({
        caryear: carYear,
        make: carMake,
        model: carModel,
        edmundsID: carID,
        state: state,
        zipcode: zip
        });
    // myDataRef.remove(); remove all data!!
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

function totalCarValue (zip, id) {
    $.getJSON('https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/' + id + '/' + zip + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
            
          
            console.log(json);
            });
}

function navLinks () {
    console.log(compPerformanceTest);
    console.log(compPerformanceNames);
    if (compPerformanceTest < 1 ) {
        console.log("les than 1");
    } else if (compPerformanceTest >= 1 && compPerformanceTest < 3) {
        console.log("between 1 and 3");
    } else {
        console.log("watever");
    }
}
