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

 teslaFuelTotal = 0,

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
 teslap85TaxCredit = [-7500,0,0,0,0];

$(document).ready(function(){

    	$("#60kwh").mouseover(function() {
                $("#60kwh").css("border-color", "#fff");
    	});
    	$("#60kwh").mouseout(function() {
            if(teslaType === "60") {
                $("#60kwh").css("border-color", "#fff");
            } else {
                $("#60kwh").css("border-color", "#831c20");
            }
    	});

        
    	$("#85kwh").mouseover(function() {
    		$("#85kwh").css("border-color", "#fff");
    	});
    	$("#85kwh").mouseout(function() {
            if(teslaType === "85") {
                $("#85kwh").css("border-color", "#fff");
            } else {
                $("#85kwh").css("border-color", "#831c20");
            }
    	});
    	$("#p85kwh").mouseover(function() {
    		$("#p85kwh").css("border-color", "#fff");
    	});
    	$("#p85kwh").mouseout(function() {
            if(teslaType === "p85") {
                $("#p85kwh").css("border-color", "#fff");
            } else {
                $("#p85kwh").css("border-color", "#831c20");
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
        $("#comp-fuel-cost").text('$ ' + compFuelCost);
        $("#annualMiles").text(data.value + " Miles");
    });


});

        $("#60kwh").click(function () {
            teslaType = "60";
            $("#60kwh").css("border-color", "#fff");
            $("#85kwh").css("border-color", "#831c20");
            $("#p85kwh").css("border-color", "#831c20");
        });

        $("#85kwh").click(function () {
            teslaType = "85";
            $("#85kwh").css("border-color", "#fff");
            $("#60kwh").css("border-color", "#831c20");
            $("#p85kwh").css("border-color", "#831c20");
        });

         $("#p85kwh").click(function () {
            teslaType = "p85";
            $("#p85kwh").css("border-color", "#fff");
            $("#85kwh").css("border-color", "#831c20");
            $("#60kwh").css("border-color", "#831c20");
        });

		$("#yearSelect").change(function() {
			$("#makeSelect").prop('disabled', false);
			carYear = $("#yearSelect").val();
            populateMakeSelect(carYear);
		});


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
                compCost = json.fuel.values[0] + json.insurance.values[0] + json.maintenance.values[0] + json.repairs.values[0] + json.depreciation.values[0] + json.taxandfees.values[0] + json.financing.values[0];
                if (isNaN(json.fuel.values[0]) === true ) {
                    $("#comp-fuel").text("N/A");

                }
                $("#comp-fuel").text('$' + json.fuel.values[0]);
                $("#comp-insurance").text('$' + json.insurance.values[0]);
                $("#comp-maintenance").text('$' + json.maintenance.values[0]);
                $("#comp-repairs").text('$' + json.repairs.values[0]);
                $("#comp-depreciation").text('$' + json.depreciation.values[0]);
                $("#comp-tax").text('$' + json.taxandfees.values[0]);
                $("#comp-financing").text('$' + json.financing.values[0]);
                $("#comp-total").text('$' + compCost);
                for (j = 0; j < 6; j++) {
                    if (isNaN(json.fuel.values[j]) === true ) {
                        $("#comp-fuel" + (j + 1)).text("N/A");
                    } else {
                        $("#comp-fuel" + (j + 1)).text('$' + json.fuel.values[j]);
                    }
                    if (isNaN(json.insurance.values[j]) === true ) {
                        $("#comp-insurance" + (j + 1)).text("N/A");
                    } else {
                        $("#comp-insurance" + (j + 1)).text('$' + json.insurance.values[j]);
                    }
                   $("#comp-maintenance" + (j + 1)).text('$' + json.maintenance.values[j]);
                   $("#comp-repairs" + (j + 1)).text('$' + json.repairs.values[j]);
                   $("#comp-depreciation" + (j + 1)).text('$' + json.depreciation.values[j]);
                   $("#comp-tax" + (j + 1)).text('$' + json.taxandfees.values[j]);
                   $("#comp-financing" + (j + 1)).text('$' + json.financing.values[j]); 
                }
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
        }
    }

    function populatePerformanceData (id) {
        $.getJSON('https://api.edmunds.com/api/vehicle/v2/styles/' + id + '?view=full&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
            combinedMPG = Math.round((json.MPG.city * .55) + (json.MPG.highway * .45));
            $("#comp-MPG-combined").text(combinedMPG + ' MPG');
            $("#comp-MPG").text(json.MPG.city + ' / ' + json.MPG.highway);
            $("#comp-horsepower").text(json.engine.horsepower + ' hp');
            $("#comp-torque").text(json.engine.torque + ' lbs');
            alertify.log("Tesla " + teslaType + " VS. " + carMake + " " + json.model.name);
            $("#comparison-title").text(carMake + " " + json.model.name);
        });
        $.getJSON('https://api.edmunds.com/api/vehicle/v2/styles/' + id + '/equipment?availability=standard&equipmentType=OTHER&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
            for (j = 0; j < json.equipment.length; j++) {
                if (json.equipment[j].name === "Specifications") {
                    for (q = 0; q < json.equipment[j].attributes.length; q++) {
                        if (json.equipment[j].attributes[q].name === "Aerodynamic Drag (cd)") {
                            $("#comp-airdrag").text(json.equipment[j].attributes[q].value);
                        } else if (json.equipment[j].attributes[q].name === "Curb Weight") {
                            $("#comp-weight").text(json.equipment[j].attributes[q].value + ' lbs');
                        } else if (json.equipment[j].attributes[q].name === "Epa Combined Mpg") {
                            combinedMPG = json.equipment[j].attributes[q].value;
                        } else if (json.equipment[j].attributes[q].name === "Fuel Capacity") {
                            compFuelTankSize = json.equipment[j].attributes[q].value;
                            var totalMilesCapacity = (compFuelTankSize * combinedMPG).toFixed(0);
                            $("#comp-capacity").text(json.equipment[j].attributes[q].value + ' gal (' + totalMilesCapacity + ' miles)');
                        } else if (json.equipment[j].attributes[q].name === "Manufacturer 0 60mph Acceleration Time (seconds)") {
                            $("#comp-0-60").text(json.equipment[j].attributes[q].value + ' sec.');
                        } else if (json.equipment[j].attributes[q].name === "Turning Diameter") {
                            $("#comp-radius").text(json.equipment[j].attributes[q].value + ' ft.');
                        }
                    }
                }
            }
            
        });
    }


    function teslaAnnualCost (tesla) {
        if (tesla === "60") {
            for(i = 0; i < 6; i++) {
                $("#tesla-fuel" + (i + 1)).text('$' + tesla60Fuel[i]);
                $("#tesla-insurance" + (i + 1)).text('$' + teslaInsurance[i]);
                $("#tesla-maintenance" + (i + 1)).text('$' + tesla60Maintenance[i]);
                $("#tesla-repairs" + (i + 1)).text('$' + tesla60Repairs[i]);
                $("#tesla-depreciation" + (i + 1)).text('$' + tesla60Depreciation[i]);
                $("#tesla-tax" + (i + 1)).text('$' + tesla60Tax[i]);
                $("#tesla-financing" + (i + 1)).text('$' + teslaFinancing[i]);
                $("#tesla-tax-credit" + (i + 1)).text('$' + tesla60TaxCredit[i]);
            }
            
        } else if (tesla === "85") {
            for(i = 0; i < 6; i++) {
                $("#tesla-fuel" + (i + 1)).text('$' + tesla85Fuel[i]);
                $("#tesla-insurance" + (i + 1)).text('$' + teslaInsurance[i]);
                $("#tesla-maintenance" + (i + 1)).text('$' + tesla85Maintenance[i]);
                $("#tesla-repairs" + (i + 1)).text('$' + tesla85Repairs[i]);
                $("#tesla-depreciation" + (i + 1)).text('$' + tesla85Depreciation[i]);
                $("#tesla-tax" + (i + 1)).text('$' + tesla85Tax[i]);
                $("#tesla-financing" + (i + 1)).text('$' + teslaFinancing[i]);
                $("#tesla-tax-credit" + (i + 1)).text('$' + tesla85TaxCredit[i]);
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
    });

}


// vehiclePhoto[Math.floor(Math.random() * vehiclePhoto.length)]
