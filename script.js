$(document).ready(function(){

    // loads foundation for slider
    $(document).foundation();

    // grabs current nation average gas price to start
    eiaGov.getGasAverage();

    // grabs current nation average energy price
    eiaGov.getEnergyAverage();

    // firebase reference for database
    var myDataRef = new Firebase(firebaseUrl);

});

var eiaGov = {
    nationalGasAverage: "http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_NUS_DPG.W",
    nationalEnergyAverage: "http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=ELEC.PRICE.US-RES.M",
    getGasAverage: function() {
        $.getJSON(eiaGov.nationalGasAverage, function(json) {
            user.gasPrice = json.series[0].data[0][1];
            $("#currentgas").text("$" + user.gasPrice.toFixed(2));
        });
    },
    getEnergyAverage: function() {
        $.getJSON(eiaGov.nationalEnergyAverage, function(json) {
            user.energyPrice = (json.series[0].data[0][1] / 100).toFixed(2);
            $("#currentenergy").text('$' + user.energyPrice);
        });
    }
};

var edmundsApi = {
    tcoNewUrl: ["https://api.edmunds.com/api/tco/v1/details/allnewtcobystyleidzipandstate/", "?fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    tcoUsedUrl: ["https://api.edmunds.com/api/tco/v1/details/allusedtcobystyleidzipandstate/","?fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    makeNewUrl: ["https://api.edmunds.com/api/vehicle/v2/makes?state=new&year=","&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    makeUsedUrl: ["https://api.edmunds.com/api/vehicle/v2/makes?state=used&year=","&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    modelNewUrl: ["https://api.edmunds.com/api/vehicle/v2/makes?state=new&year=","&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw"]
    getTCOData: function(id, zip, state) {
        /* new or used? */
        if (compCar.year > 2014) {
            $.getJSON(this.tcoNewUrl[0] + id + '/' + zip + '/' + state + this.tcoNewUrl[1], function(json) {
                return json;
            });
        } else {
            $.getJSON(this.tcoUsedUrl[0] + id + '/' + zip + '/' + state + this.tcoUsedUrl[1], function(json) {
                return json;
            });
        }
    },
    getMakeNames: function() {
        View.makes = [];
        if (compCar.year > 2014) {
            $.getJSON(this.makeNewUrl[0] + compCar.year + this.makeNewUrl[1], function(json) {
                for (var i = 0; i < json.makes.length; i++){
                    View.makes.push(json.makes[i].name);
                }
            });
        } else {
            $.getJSON(this.makeUsedUrl[0] + compCar.year + this.makeUsedUrl[1], function(json) {
                for (var i = 0; i < json.makes.length; i++){
                    View.makes.push(json.makes[i].name);
                }
            });
        }
    },
    getModelNames: function() {
        View.models = [];
        if (compCar.year > 2014) {
            $.getJSON(this.modelNewUrl[0] + compCar.year + this.modelNewUrl[1], function(json) {
                for (j = 0; j < json.makes.length; j++) {
                    if (json.makes[j].name === make) {
                        for (m = 0; m < json.makes[j].models.length; m++){
                            /* json.makes.models.niceName for later */
                            View.models.push(json.makes[j].models[m].name);
                        }
                    }
                }
            });
        } else {
            $.getJSON('https://api.edmunds.com/api/vehicle/v2/makes?state=used&year=' + compCar.year + '&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
                for (j = 0; j < json.makes.length; j++) {
                    if (json.makes[j].name === make) {
                        for (m = 0; m < json.makes[j].models.length; m++){
                           View.models.push(json.makes[j].models[m].name);
                        }
                    } else {
                    }
                }
            });
        }
    }
};

var firebaseUrl = 'https://tesla-comparison.firebaseio.com/',
user = {
    zipCode: 0,
    state: "",
    gasPrice: 0,
    energyPrice: 0,
    annualMiles: 20000
},
compCar = {
    id: "",
    make: "",
    model: "",
    year: 0,
    photoUrls: [],
    tankSize: 0,
    combinedMPG: 0,
    fuelCost: 0,
    annualCosts: {
        fuel: [],
        insurance: [],
        maintenance: [],
        repairs: [],
        depreciation: [],
        taxandfees: [],
        financing: [],
        yearTotals: [0,0,0,0,0],
        grandTotal: 0
    },
    tests: {
        mpg: false,
        costs: 35,
        performance: 6
    },
    setFuelCosts: function() {
        this.fuelCost = ((20000 / this.combinedMPG) * user.gasPrice).toFixed(0);
    },
    parseTCOData: function(json) {
        this.annualCosts.grandTotal = 0;
        this.annualCosts.insurance[5] = 0;
        this.annualCosts.maintenance[5] = 0;
        this.annualCosts.repairs[5] = 0;
        this.annualCosts.depreciation[5] = 0;
        this.annualCosts.taxandfees[5] = 0;
        this.annualCosts.financing[5] = 0;
        /* check if doesn't exist first, then proceed to total and grand total */
        for (j = 0; j < 5; j++) {
            if (isNaN(json.fuel.values[j]) === true ) {
                this.annualCosts.fuel[j] = "unknown";
            } else {
                this.annualCosts.fuel[j] = this.fuelCost;
                this.annualCosts.yearTotals[j] += this.fuelCost;
                this.annualCosts.grandTotal += this.fuelCost;
            }
            if (isNaN(json.insurance.values[j]) === true ) {
                this.annualCosts.insurance[j] = "unknown";
            } else {
                this.annualCosts.insurance[j] = json.insurance.values[j];
                this.annualCosts.insurance[5] += json.insurance.values[j];
                this.annualCosts.yearTotals[j] += json.insurance.values[j];
                this.annualCosts.grandTotal += json.insurance.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(json.maintenance.values[j]) === true ) {
                this.annualCosts.maintenance[j] = "unknown";
            } else {
                this.annualCosts.maintenance[j] = json.maintenance.values[j];
                this.annualCosts.maintenance[5] += json.maintenance.values[j];
                this.annualCosts.yearTotals[j] += json.maintenance.values[j];
                this.annualCosts.grandTotal += json.maintenance.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(json.repairs.values[j]) === true ) {
                this.annualCosts.repairs[j] = "unknown";
            } else {
                this.annualCosts.repairs[j] = json.repairs.values[j];
                this.annualCosts.repairs[5] += json.repairs.values[j];
                this.annualCosts.yearTotals[j] += json.repairs.values[j];
                this.annualCosts.grandTotal += json.repairs.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(json.depreciation.values[j]) === true ) {
                this.annualCosts.depreciation[j] = "unknown";
            } else {
                this.annualCosts.depreciation[j] = json.depreciation.values[j];
                this.annualCosts.depreciation[5] += json.depreciation.values[j];
                this.annualCosts.yearTotals[j] += json.depreciation.values[j];
                this.annualCosts.grandTotal += json.depreciation.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(json.taxandfees.values[j]) === true ) {
                this.annualCosts.taxandfees[j] = "unknown";
            } else {
                this.annualCosts.taxandfees[j] = json.taxandfees.values[j];
                this.annualCosts.taxandfees[5] += json.taxandfees.values[j];
                this.annualCosts.yearTotals[j] += json.taxandfees.values[j];
                this.annualCosts.grandTotal += json.taxandfees.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(json.financing.values[j]) === true ) {
                this.annualCosts.financing[j] = "unknown";
            } else {
                this.annualCosts.financing[j] += json.financing.values[j];
                this.annualCosts.financing[5] += json.financing.values[j];
                this.annualCosts.yearTotals[j] += json.financing.values[j];
                this.annualCosts.grandTotal += json.financing.values[j];
                this.tests.costs -= 1;
            }
        }
    }
},
tesla = {
    selectedType: "",
    weight: 4647, /* teslamotors.com */
    aeroDrag: .24, /* teslamotors.com */
    turnRadius: 37, /* ft teslamotors.com */
    cargoCapacity: 31.6,  /* cubic feet. teslamotors.com */
    fuelCost: 0,
    fuelTotal: 0,
    totalCosts: {
        fuel: 0,
        insurance: 0,
        maintenance: 0,
        repairs: 0,
        depreciation: 0,
        taxandfees: 0,
        financing: 0,
        taxcredit: 0,
        grandTotal: 0
    },
    60: {
        cityMpg: 94,
        hwyMpg: 97,
        combinedMPG: 95,
        mileCapacity: 208,
        zeroSixty: 5.9,
        horsepower: 302,
        torque: 317,
        annualCosts: {
            insurance: [2274,2274,2274,2274,2274],
            financing: [2065,1635,1189,743,265],
            depreciation: [16699,6361,6228,6102,5983],
            taxandfees: [5960,18,18,18,18,6032],
            maintenance: [600,600,600,600,600,3000],
            repairs: [0,0,0,0,0,0],
            taxcredit: [-7500,0,0,0,0],
            yearTotals: [1000,2000,3000,4000,5000]
        }
    },
    85: {
        cityMpg: 88,
        hwyMpg: 90,
        combinedMPG: 89,
        mileCapacity: 265,
        zeroSixty: 5.4,
        horsepower: 362,
        torque: 325,
        annualCosts: {
            insurance: [2274,2274,2274,2274,2274],
            financing: [2065,1635,1189,743,265],
            depreciation: [19088,7271,7119,6975,6839],
            taxandfees: [6810,18,18,18,18],
            maintenance: [600,600,600,600,600],
            repairs: [0,0,0,0,0],
            taxcredit: [-7500,0,0,0,0],
            yearTotals: [1000,2000,3000,4000,5000]
        }
    },
    P85D: {
        cityMpg: 88,
        hwyMpg: 90,
        combinedMPG: 89,
        mileCapacity: 253,
        zeroSixty: 3.2,
        horsepower: 691, /* 221 hp front, 470 hp rear */
        annualCosts: {
            insurance: [2274,2274,2274,2274,2274],
            financing: [2065,1635,1189,743,265],
            depreciation: [22672,8636,8456,8285,8123],
            taxandfees: [8085,18,18,18,18],
            maintenance: [600,600,600,600,600],
            repairs: [0,0,0,0,0],
            taxcredit: [-7500,0,0,0,0],
            yearTotals: [1000,2000,3000,4000,5000]
        }
    },
    setFuelCosts: function() {
        this.fuelCost = ((20000 * .33) * user.energyPrice).toFixed(0);
        this.fuelTotal = tesla.fuelCost * 5;
    },
    setCostTotals: function(selectedTesla) {
        for(var year = 0; year < 5; year++) {
            this.totalCosts.insurance += selectedTesla.annualCosts.insurance[year];
            this.totalCosts.maintenance += selectedTesla.annualCosts.maintenance[year];
            this.totalCosts.repairs += selectedTesla.annualCosts.repairs[year];
            this.totalCosts.depreciation += selectedTesla.annualCosts.depreciation[year];
            this.totalCosts.taxandfees += selectedTesla.annualCosts.taxandfees[year];
            this.totalCosts.financing += selectedTesla.annualCosts.financing[year];
            this.totalCosts.taxcredit += selectedTesla.annualCosts.taxcredit[year];
            this.totalCosts.grandTotal += selectedTesla.annualCosts.insurance[year] + selectedTesla.annualCosts.maintenance[year] + selectedTesla.annualCosts.repairs[year] + selectedTesla.annualCosts.depreciation[year] + selectedTesla.annualCosts.taxandfees[year] + selectedTesla.annualCosts.financing[year]  + selectedTesla.annualCosts.taxcredit[year];
        }
    }
};


$(document).foundation({
    slider: {
        on_change: function(){
            user.annualMiles = $('#annual-milage-slider').attr('data-slider');
            tesla.fuelCost = ((user.annualMiles * .33) * user.energyPrice);
            tesla.fuelTotal = tesla.fuelCost * 5;
            compCar.fuelCost = ((user.annualMiles / compCar.combinedMPG) * user.gasPrice);
            compFuelTotal = compCar.fuelCost * 5;
            tesla.annualCosts.fuel = [];

            teslaAnnualCost(tesla.selectedType);
            
            View.renderAnnualMiles();
            View.renderTeslaAnnualFuel();
            View.renderCompAnnualFuel();
            View.renderCostDifference();
        }
    }
});

var View = {
    makes: [],
    models: [],
    renderMakeSelect: function() {
        $('#makeSelect').children('option').remove();
        $('#modelSelect').children('option').remove();
        $('#trimSelect').children('option').remove();
        $('#makeSelect').append($("<option></option>").attr("value",0).text('Make'));
        $('#modelSelect').append($("<option></option>").attr("value",0).text('Model'));
        $('#trimSelect').append($("<option></option>").attr("value",0).text('Trim'));
        $("#modelSelect").prop('disabled', true);
        $("#trimSelect").prop('disabled', true);
        $("#stateSelect").prop('disabled', true);
        edmundsApi.getMakeNames();
        for (var j = 0; j < this.makes.length; j++){
            $('#makeSelect').append('<option value="' + this.makes[j] + '">' + this.makes[j] + '</option>');
        }
    },
    renderModelSelect: function() {
        $('#modelSelect').children('option').remove();
        $('#trimSelect').children('option').remove();
        $('#modelSelect').append($("<option></option>").attr("value",0).text('Model'));
        $('#trimSelect').append($("<option></option>").attr("value",0).text('Trim'));
        $("#trimSelect").prop('disabled', true);
        $("#stateSelect").prop('disabled', true);
        for (var j = 0; j < this.models.length; j++){
            $('#modelSelect').append('<option value="' + this.models[j] + '">' + json.makes[j].models[m].name + '</option>');
        }
    }
    loadTest: false,
    renderAnnualMiles: function() {
        if (user.annualMiles < 5000) {
            $("#annual-miles").text("00000" + user.annualMiles);
        } else if (user.annualMiles < 10000) {
            $("#annual-miles").text("00" + user.annualMiles);
        } else if (user.annualMiles < 100000 & user.annualMiles >= 10000) {
            $("#annual-miles").text("0" + user.annualMiles);
        } else {
            $("#annual-miles").text(user.annualMiles);
        }
    },
    renderCostDifference: function() {
        $("#fuel-cost-difference").text('$ ' + (compCar.fuelCost - tesla.fuelCost).toFixed(0));
    },
    renderCompAnnualFuel: function() {
        for (var year = 0; year < 5; year++) {
            $("#comp-fuel" + (year + 1)).text('$' + compCar.fuelCost.toFixed(0));
        }
        $("#comp-fuel-cost").text('$ ' + compCar.fuelCost.toFixed(0));
        $("#comp-fuel-total").text('$' + compCar.fuelCost.toFixed(0) * 5);
    },
    renderTeslaAnnualFuel: function() {
        for(i = 0; i < 5; i++) {
            $("#tesla-fuel" + (i + 1)).text('$' + tesla.fuelCost);
        }
        $("#tesla-fuel-total").text('$' + tesla.fuelTotal);
        $('#tesla-fuel-cost').text('$ ' + tesla.fuelCost);  
    },
    renderTeslaAnnualCosts: function(selectedTesla) {
        for(var year = 0; year < 5; year++) {
            $("#tesla-fuel" + (year + 1)).text('$' + selectedTesla.fuelCost.toFixed(0));
            $("#tesla-insurance" + (year + 1)).text('$' + selectedTesla.annualCosts.insurance[year]);
            $("#tesla-maintenance" + (i + 1)).text('$' + selectedTesla.annualCosts.maintenance[year]);
            $("#tesla-repairs" + (i + 1)).text('$' + selectedTesla.annualCosts.repairs[year]);
            $("#tesla-depreciation" + (i + 1)).text('$' + selectedTesla.annualCosts.depreciation[year]);
            $("#tesla-tax" + (i + 1)).text('$' + selectedTesla.annualCosts.taxandfees[year]);
            $("#tesla-financing" + (i + 1)).text('$' + selectedTesla.annualCosts.financing[year]);
            $("#tesla-tax-credit" + (i + 1)).text('$' + selectedTesla.annualCosts.taxcredit[year]);
            $("#tesla-total-year" + (i + 1)).text('$' + total.toFixed(0));
        }
    },
    renderCompAnnualCosts: function() {
        $("#comp-depreciation" + (j + 1)).text('$' + compCar.annualCosts.depreciation[j]);
        // for loop here
        for (var index = 0; index < 5; index++) {
            $("#comp-year" + (index + 1) + "-total").text('$' + compCar.annualCosts.yearTotals[index]);
        }
        $("#comp-fuel-total").text('$' + compFuelTotal.toFixed(0));
        $("#comp-insurance-total").text('$' + compCar.annualCosts.insurance[5]);
        $("#comp-maintenance-total").text('$' + compCar.annualCosts.maintenance[5]);
        $("#comp-repairs-total").text('$' + compCar.annualCosts.repairs[5]);
        $("#comp-depreciation-total").text('$' + compCar.annualCosts.depreciation[5]);
        $("#comp-tax-total").text('$' + compCar.annualCosts.taxandfees[5]);
        $("#comp-financing-total").text('$' + compCar.annualCosts.financing[5]);
        $("#comp-tax-credit-total").text('$' + 0);
        $("#comp-grand-total").text('$' + compCar.annualCosts.grandTotal);
    }
};

// function populateCompFuel () {

// if (previousFuelCost == 0) {
//     for (j = 0; j < 5; j++) {
//     console.log("no previous");
//     $("#comp-fuel" + (j + 1)).text('$' + compCar.fuelCost.toFixed(0));
//     compAnnualCosts.yearTotals[j] += compCar.fuelCost;
//     }
// } else {
//     for (j = 0; j < 5; j++) {
//     console.log("pervoius");
//     $("#comp-fuel" + (j + 1)).text('$' + compCar.fuelCost.toFixed(0));
//     compAnnualCosts.yearTotals[j] -= previousFuelCost;
//     compAnnualCosts.yearTotals[j] += compCar.fuelCost;
//     previousFuelCost = compCar.fuelCost;
//     }
// }
// }

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



// Select box on change functions

	$("#yearSelect").change(function() {
        compCar.year = $("#yearSelect").val();
        View.renderMakeSelect(compCar.year);
        setTimeout(function(){
            $("#makeSelect").prop('disabled', false);
        }, 800);
	});

	$("#makeSelect").change(function() {
        compCar.make = $("#makeSelect").val();
        populateModelSelect(compCar.year,compCar.make);
        setTimeout(function(){
            $("#modelSelect").prop('disabled', false);
        }, 500);
	});

    $("#modelSelect").change(function() {
        compCar.model =  $("#modelSelect").val();
        populateTrimSelect(compCar.model, compCar.make, compCar.year);
        setTimeout(function(){
            $("#trimSelect").prop('disabled', false);
        }, 500);
    });

    $("#trimSelect").change(function() {
        $("#zipCode").prop('disabled', false);
        $("#stateSelect").prop('disabled', false);
    });


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



// Populate performance data from two separate JSON requests, second reqeust delayed by 1.5 sec
function populatePerformanceData (id) {
    $.getJSON('https://api.edmunds.com/api/vehicle/v2/styles/' + id + '?view=full&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
        if (isNaN(json.engine.horsepower) === false && isNaN(json.engine.horsepower) === false) {
            compCar.combinedMPG = Math.round((json.MPG.city * .55) + (json.MPG.highway * .45));
            $("#comp-MPG-combined").text(compCar.combinedMPG);
            $("#comp-MPG-city").text(json.MPG.city);
            $("#comp-MPG-highway").text(json.MPG.highway);
            compCar.tests.mpg = true;
        } else {
            compCar.tests.mpg = false;
        }

        if (isNaN(json.engine.horsepower) === true ) {
            $("#comp-horsepower").text('unknown');
        } else {
            $("#comp-horsepower").text(json.engine.horsepower + ' hp');
            compCar.tests.performance -= 1;
        }
        if (isNaN(json.engine.torque) === true ) {
            $("#comp-torque").text('unknown');
        } else {
            $("#comp-torque").text(json.engine.torque + ' lbs');
            compCar.tests.performance -= 1;
        }
        alertify.log("Tesla " + tesla.selectedType + " VS. " + compCar.make + " " + json.model.name);
        $("#comparison-title").text(compCar.make + " " + json.model.name);
        $("#comparison-title-performance").text(compCar.make + " " + json.model.name);
        $("#comp-annual-title").text(compCar.make + " " + json.model.name);
    });
    setTimeout(function(){
            $.getJSON('https://api.edmunds.com/api/vehicle/v2/styles/' + id + '/equipment?availability=standard&equipmentType=OTHER&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
        for (j = 0; j < json.equipment.length; j++) {
            if (json.equipment[j].name === "Specifications") {
                for (q = 0; q < json.equipment[j].attributes.length; q++) {
                    if (json.equipment[j].attributes[q].name === "Aerodynamic Drag (cd)") {
                        compCar.tests.performance -= 1;
                        $("#comp-airdrag").text(json.equipment[j].attributes[q].value);
                    } else if (json.equipment[j].attributes[q].name === "Curb Weight") {
                        compCar.tests.performance -= 1;
                        $("#comp-weight").text(json.equipment[j].attributes[q].value + ' lbs');
                    } else if (json.equipment[j].attributes[q].name === "Epa Combined Mpg") {
                        compCar.combinedMPG = json.equipment[j].attributes[q].value;
                    } else if (json.equipment[j].attributes[q].name === "Fuel Capacity") {
                        compCar.tankSize = json.equipment[j].attributes[q].value;
                        var totalMilesCapacity = (compCar.tankSize * compCar.combinedMPG).toFixed(0);
                        $("#comp-capacity").text(json.equipment[j].attributes[q].value + ' gal (' + totalMilesCapacity + ' miles)');
                    } else if (json.equipment[j].attributes[q].name === "Manufacturer 0 60mph Acceleration Time (seconds)") {
                        compCar.tests.performance -= 1;
                        $("#comp-0-60").text(json.equipment[j].attributes[q].value + ' sec.');
                    } else if (json.equipment[j].attributes[q].name === "Turning Diameter") {
                        compCar.tests.performance -= 1;
                        $("#comp-radius").text(json.equipment[j].attributes[q].value + ' ft.');
                    }
                }
            }
        }
    });
}, 1500);


}

// Populate tesla performance data (very repetitive)
function teslaData (tesla) {
    if (tesla === "60") {
        $("#tesla-horsepower").text(teslaHorsepower[0] + " hp");
        $("#tesla-torque").text(teslaTorque[0] + " lbs");
        $("#tesla-airdrag").text(tesla.aeroDrag);
        $("#tesla-cargo-capacity").text(teslaCargoCapacity);
        $("#tesla-weight").text(tesla.weight + ' lbs');
        $("#tesla-MPG-combined").text(teslaCombinedMPG[0]);
        $("#tesla-MPG-city").text(teslaCityMPG[0]);
        $("#tesla-MPG-highway").text(teslaHwyMPG[0]);
        $("#tesla-0-60").text(tesla60Sec[0] + ' sec.');
        $("#tesla-radius").text(tesla.turnRadius + ' ft.');
        $("#tesla-photo").attr('src','images/model-s-60.jpg');
        $("#tesla-title").text('Tesla Model S 60');
        $("#tesla-title-performance").text('Tesla Model S 60');
    } else if (tesla === "85") {
        $("#tesla-horsepower").text(teslaHorsepower[1] + " hp");
        $("#tesla-torque").text(teslaTorque[1] + " lbs");
        $("#tesla-airdrag").text(tesla.aeroDrag);
        $("#tesla-cargo-capacity").text(teslaCargoCapacity);
        $("#tesla-weight").text(tesla.weight + ' lbs');
        $("#tesla-MPG-combined").text(teslaCombinedMPG[1]);
        $("#tesla-MPG-city").text(teslaCityMPG[1]);
        $("#tesla-MPG-highway").text(teslaHwyMPG[1]);
        $("#tesla-0-60").text(tesla60Sec[1] + ' sec.');
        $("#tesla-radius").text(tesla.turnRadius + ' ft.');
        $("#tesla-photo").attr('src','images/model-s-85.jpg');
        $("#tesla-title").text('Tesla Model S 85');
        $("#tesla-title-performance").text('Tesla Model S 85');
    } else {
        $("#tesla-horsepower").text(teslaHorsepower[2] + " hp");
        $("#tesla-torque").text(teslaTorque[2] + " lbs");
        $("#tesla-airdrag").text(tesla.aeroDrag);
        $("#tesla-cargo-capacity").text(teslaCargoCapacity);
        $("#tesla-weight").text(tesla.weight + ' lbs');
        $("#tesla-MPG-combined").text(teslaCombinedMPG[2]);
        $("#tesla-MPG-city").text(teslaCityMPG[2]);
        $("#tesla-MPG-highway").text(teslaHwyMPG[2]);
        $("#tesla-0-60").text(tesla60Sec[2] + ' sec.');
        $("#tesla-radius").text(tesla.turnRadius + ' ft.');
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
            $("#tesla-fuel" + (i + 1)).text('$' + tesla.fuelCost.toFixed(0));
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
            var total = tesla.fuelCost + tesla60TaxCredit[i] + teslaInsurance[i] + tesla60Maintenance[i] + tesla60Repairs[i] + tesla60Depreciation[i] + tesla60Tax[i]  + teslaFinancing[i];
            teslaGrandTotal += total;
            $("#tesla-total-year" + (i + 1)).text('$' + total.toFixed(0));
        }

    } else if (tesla === "85") {
        for(i = 0; i < 5; i++) {
            $("#tesla-fuel" + (i + 1)).text('$' + tesla.fuelCost.toFixed(0));
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
            var total = tesla.fuelCost + tesla85TaxCredit[i] + teslaInsurance[i] + tesla85Maintenance[i] + tesla85Repairs[i] + tesla85Depreciation[i] + tesla85Tax[i]  + teslaFinancing[i];
            teslaGrandTotal += total;
            $("#tesla-total-year" + (i + 1)).text('$' + total.toFixed(0));
        }
    } else if (tesla === "p85") {
        for(i = 0; i < 5; i++) {
            $("#tesla-fuel" + (i + 1)).text('$' + tesla.fuelCost.toFixed(0));
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
            var total = tesla.fuelCost + teslap85TaxCredit[i] + teslaInsurance[i] + teslap85Maintenance[i] + teslap85Repairs[i] + teslap85Depreciation[i] + teslap85Tax[i]  + teslaFinancing[i];
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
        user.energyPrice = (json.series[0].data[0][1] / 100);
        $("#currentenergy").text(state + ' $' + user.energyPrice.toFixed(2));
        });
}

function populateGasPrices (state) {
    if (state === "ME" || state === "CT" || state === "NH" || state === "RI" || state === "VT") {
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R1X_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "DE" || state === "DC" || state === "MD" || state === "NJ" || state === "NY"|| state === "PA"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R1Y_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "GA" || state === "NC" || state === "SC" || state === "VA"|| state === "WV"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R1Z_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "IL" || state === "IN" || state === "IO" || state === "KS" || state === "KY"|| state === "MI" || state === "MO" || state === "NE" || state === "ND" || state === "SD" || state === "OH" || state === "OK" || state === "TN" || state === "WI"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R20_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "AL" || state === "AR" || state === "LA" || state === "MS" || state === "NM"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R30_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "ID" || state === "MT" || state === "UT" || state === "WY"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R40_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "AK" || state === "AZ" || state === "HI" || state === "NV" || state === "OR"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R50_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "CA"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMR_PTE_SCA_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "CO"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SCO_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "FL"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SFL_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "MA"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMR_PTE_SMA_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "MN"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SMN_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "NY"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SNY_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "OH"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SOH_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "TX"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_STX_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
        });
    } else if (state === "WA"){
        $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SWA_DPG.W', function(json) {

        user.gasPrice = (json.series[0].data[0][1]);
        $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
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
                    // compCar.photoUrls.push(json[j].photoSrcs[i]);
                    compCar.photoUrls[0] = json[j].photoSrcs[i];
                }
            }
        }
    }
    $("#comparison-photo").attr('src','http://media.ed.edmunds-media.com' + compCar.photoUrls[0]);

}).fail(function() {
    console.log("image load failed");
    });
}





function adjustEnergyPrice (adjust) {
    if (user.energyPrice <= .01) {
         alertify.alert("Energy must be more than .01");
    } else {
            if (adjust === "up") {
            user.energyPrice = (parseFloat(user.energyPrice) + .01).toFixed(2);
            $("#currentenergy").text('$' + user.energyPrice);
        } else if (adjust === "down") {
            user.energyPrice = (parseFloat(user.energyPrice) - .01).toFixed(2);
            $("#currentenergy").text('$' + user.energyPrice);
        }
    }
}

function adjustGasPrice (adjust) {
    if (user.gasPrice <= .01) {
         alertify.alert("Gas must be more than .01");
    } else {
            if (adjust === "up") {
            user.gasPrice = (parseFloat(user.gasPrice) + .01).toFixed(2);
            $("#currentgas").text('$' + user.gasPrice);
        } else if (adjust === "down") {
            user.gasPrice = (parseFloat(user.gasPrice) - .01).toFixed(2);
            $("#currentgas").text('$' + user.gasPrice);
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
    caryear: compCar.year,
    make: compCar.make,
    model: compCar.model,
    edmundsID: compCar.id,
    state: state,
    zipcode: user.zipCode,
    fiveyeartotal: compGrandTotal
    });
}


function navLinks () {
if (compCar.tests.mpg === true ) {
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
if (compCar.tests.performance < 2 ) {
    $(".performance-section-div").fadeIn( 3000 );
    $('#performance-nav-button').css('border-color','green');
    $('#performance-nav-button').removeAttr('disabled');
} else if (compCar.tests.performance >= 2 && compCar.tests.performance < 5) {
    $(".performance-section-div").fadeIn( 3000 );
    $('#performance-nav-button').css('border-color','yellow');
    $('#performance-nav-button').removeAttr('disabled');
} else {
    $('#performance-nav-button').css('border-color','red');
}
if (compCar.tests.costs < 10 ) {
    $(".comp-annual-div").fadeIn( 3000 );
    $('#comp-cost-nav-button').css('border-color','green');
    $('#comp-cost-nav-button').removeAttr('disabled');
} else if (compCar.tests.costs >= 10 && compCar.tests.costs < 25) {
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
View.loadTest = true;
teslaData(tesla.selectedType);
teslaAnnualCost(tesla.selectedType);
populatePerformanceData(carID);
populateEnergyPrices(state);
populateGasPrices(state);
setTimeout(function(){
    populateTCOData(carID,zip,state); //change to get
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


function submitCar () {
    compCar.id =  $("#trimSelect").val();
    user.zipCode = $("#zipCode").val();
    // zip = $("#zipCode").val();
    user.state = $("#stateSelect").val();
        if (user.zipCode.length === 5 & tesla.selectedType != "") {
            if(View.loadTest === false) {
                populateCar(compCar.id,user.zipCode,user.state);
            } else if(View.loadTest === true) {
                $(".fuel-section-div1").hide();
                $(".fuel-section-div2").hide();
                $('.mile-slider').css('visibility','hidden');
                $(".performance-section-div").hide();
                $(".comp-annual-div").hide();
                $(".tesla-annual-div").hide();
                $(".section-nav").hide();
                populateCar(compCar.id,user.zipCode,user.state);
            }
        } else if (user.zipCode.length === 5 & tesla.selectedType === "") {
           alertify.alert("Please select Tesla Type");
        } else if (user.zipCode.length != 5 & tesla.selectedType != "") {
            alertify.alert("Please select a Comparison Car");
        }  else {
            alertify.alert("Please select a Tesla and Comparison Car");
        }
    }
