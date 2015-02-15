$(document).ready(function(){

    // loads foundation for slider
    $(document).foundation();

    // grabs current nation average gas price to start
    eiaGov.getGasAverage();

    // grabs current nation average energy price
    eiaGov.getEnergyAverage();

    // firebase reference for database
    var myDataRef = new Firebase(firebase.url);

    $(document).foundation({
        slider: {
            on_change: function(){
                if (isCarLoaded === true) {
                    user.annualMiles = $('#annual-milage-slider').attr('data-slider');
                    tesla.setFuelCosts();
                    compCar.setFuelCosts();
                    View.renderAnnualMiles();
                    View.renderTeslaAnnualFuel(tesla.selectedType);
                    View.renderCompAnnualFuel();
                    View.renderCostDifference();
                    View.renderCompAnnualCosts();
                    View.renderTeslaAnnualCosts(tesla.selectedType);
                }
            }
        }
    });
});

var isCarLoaded = false;
var eiaGov = {
    nationalGasAverage: "http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_NUS_DPG.W",
    nationalEnergyAverage: "http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=ELEC.PRICE.US-RES.M",
    gasPriceBaseUrl: "http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.",
    gasPriceUrls: [["ME,CT,NH,RI,VT", "EMM_EPMMU_PTE_R1X_DPG.W"],["DE,DC,MD,NJ,NY,PA","EMM_EPMMU_PTE_R1Y_DPG.W"],["GA,NC,SC,VA,WV","EMM_EPMMU_PTE_R1Z_DPG.W"],["IL,IN,IO,KS,KY,MI,MO,NE,ND,SD,OH,OK,TN,WI","EMM_EPMMU_PTE_R20_DPG.W"],["AL,AR,LA,MS,NM","EMM_EPMMU_PTE_R30_DPG.W"],["ID,MT,UT,WY","EMM_EPMMU_PTE_R40_DPG.W"],["AK,AZ,HI,NV,OR","EMM_EPMMU_PTE_R50_DPG.W"],["CA","EMM_EPMMR_PTE_SCA_DPG.W"],["CO","EMM_EPMMU_PTE_SCO_DPG.W"],["FL","EMM_EPMMU_PTE_SFL_DPG.W"],["MA","EMM_EPMMR_PTE_SMA_DPG.W"],["MN","EMM_EPMMU_PTE_SMN_DPG.W"],["NY","EMM_EPMMU_PTE_SNY_DPG.W"],["OH","EMM_EPMMU_PTE_SOH_DPG.W"],["TX","EMM_EPMMU_PTE_STX_DPG.W"],["WA","EMM_EPMMU_PTE_SWA_DPG.W"]],
    energyPriceUrl: ["http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=ELEC.PRICE.","-RES.M"],
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
    },
    getGasPrice: function() {
        for (var i = 0; i < this.gasPriceUrls.length; i++) {
            if (user.state.indexOf(this.gasPriceUrls[i][0]) != -1) {
                $.getJSON(this.gasPriceBaseUrl + this.gasPriceUrls[i][1], function(json) {
                    user.gasPrice = json.series[0].data[0][1];
                });
            }
        }
    },
    getEnergyPrice: function() {
        $.getJSON(this.energyPriceUrl[0] + user.state + this.energyPriceUrl[1], function(json) {
            user.energyPrice = json.series[0].data[0][1] / 100;
        });
    }
};

var edmundsApi = {
    tcoNewUrl: ["https://api.edmunds.com/api/tco/v1/details/allnewtcobystyleidzipandstate/", "?fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    tcoUsedUrl: ["https://api.edmunds.com/api/tco/v1/details/allusedtcobystyleidzipandstate/","?fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    performance1Url: ["https://api.edmunds.com/api/vehicle/v2/styles/","?view=full&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    performance2Url: ["https://api.edmunds.com/api/vehicle/v2/styles/","/equipment?availability=standard&equipmentType=OTHER&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    makeNewUrl: ["https://api.edmunds.com/api/vehicle/v2/makes?state=new&year=","&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    makeUsedUrl: ["https://api.edmunds.com/api/vehicle/v2/makes?state=used&year=","&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    modelNewUrl: ["https://api.edmunds.com/api/vehicle/v2/makes?state=new&year=","&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    modelUsedUrl: ["https://api.edmunds.com/api/vehicle/v2/makes?state=used&year=","&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    trimNewUrl: ["https://api.edmunds.com/api/vehicle/v2/","?state=new&year=","&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    trimUsedUrl: ["https://api.edmunds.com/api/vehicle/v2/","?state=used&year=","&view=basic&fmt=json&api_key=s65k59axsr9w63js5dbespvw"],
    getTCOData: function() {
        /* new or used? */
        if (compCar.year > 2014) {
            $.getJSON(this.tcoNewUrl[0] + compCar.id + '/' + user.zipCode + '/' + user.state + this.tcoNewUrl[1], function(json) {
                compCar.jsonTcoData[0] = json;
            });
        } else {
            $.getJSON(this.tcoUsedUrl[0] + compCar.id + '/' + user.zipCode + '/' + user.state + this.tcoUsedUrl[1], function(json) {
                compCar.jsonTcoData[0] = json;
            });
        }
    },
    getPerformanceData: function() {
        compCar.jsonPerformanceData = [];
        $.getJSON(this.performance1Url[0] + compCar.id + this.performance1Url[1], function(json) {
            compCar.jsonPerformanceData.push(json);
        });
        setTimeout(function(){
            $.getJSON(edmundsApi.performance2Url[0] + compCar.id + edmundsApi.performance2Url[1], function(json) {
                compCar.jsonPerformanceData.push(json);
            });
        }, 1500);
    },
    getMakeNames: function() {
        View.makes = [];
        if (compCar.year > 2013) {
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
        if (compCar.year > 2013) {
            $.getJSON(this.modelNewUrl[0] + compCar.year + this.modelNewUrl[1], function(json) {
                for (j = 0; j < json.makes.length; j++) {
                    if (json.makes[j].name === compCar.make) {
                        for (m = 0; m < json.makes[j].models.length; m++){
                            /* json.makes.models.niceName for later */
                            View.models.push(json.makes[j].models[m].name);
                        }
                    }
                }
            });
        } else {
            $.getJSON(this.modelUsedUrl[0] + compCar.year + this.modelUsedUrl[1], function(json) {
                for (j = 0; j < json.makes.length; j++) {
                    if (json.makes[j].name === compCar.make) {
                        for (m = 0; m < json.makes[j].models.length; m++){
                           View.models.push(json.makes[j].models[m].name);
                        }
                    } 
                }
            });
        }
    },
    getTrimNames: function() {
        View.trims = [];
        if (compCar.year > 2013){
            $.getJSON(this.trimNewUrl[0] + compCar.make.toLowerCase() + '/' + compCar.model + this.trimNewUrl[1] + compCar.year + this.trimNewUrl[2], function(json) {
                for (j = 0; j < json.years[0].styles.length; j++) {
                   View.trims.push([json.years[0].styles[j].id, json.years[0].styles[j].name]);
                }
            });
        } else {
            $.getJSON(this.trimUsedUrl[0] + compCar.make.toLowerCase() + '/' + compCar.model + this.trimUsedUrl[1] + compCar.year + this.trimUsedUrl[2], function(json) {
                for (j = 0; j < json.years[0].styles.length; j++) {
                    View.trims.push([json.years[0].styles[j].id, json.years[0].styles[j].name]);
                }
            });
        }
    },
    getPhotoUrls: function() {
        $.getJSON('https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId=' + compCar.id + '&fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
            for(j = 0; j < json.length; j++) {
                if (json[j].subType === "exterior" && json[j].shotTypeAbbreviation === "FQ") {
                    for(i = 0; i < json[j].photoSrcs.length; i++) {
                        var photo = json[j].photoSrcs[i];
                        if (photo.indexOf(500) > -1) {
                            compCar.photoUrls[0] = json[j].photoSrcs[i];
                        }
                    }
                }
            }
        }).fail(function() {
            console.log("image load failed");
        });
    }
};

var firebase = {
    url: "https://tesla-comparison.firebaseio.com/",
    submitFirebase: function() {
        myDataRef.push({
            caryear: compCar.year,
            make: compCar.make,
            model: compCar.model,
            edmundsID: compCar.id,
            state: user.state,
            zipcode: user.zipCode,
            fiveyeartotal: compCar.annualCosts.grandTotal
        });
    }
}

var user = {
    zipCode: 0,
    state: "",
    gasPrice: 0,
    energyPrice: 0,
    annualMiles: 20000,
    setGasPrice: function() {
        this.gasPrice = 0;
        eiaGov.getGasPrice();
        View.renderGasPrice();
    },
    setEnergyPrice: function() {
        this.energyPrice = 0;
        eiaGov.getEnergyPrice();
        View.renderEnergyPrice();
    },
    adjustEnergyPrice: function(adjust) {
        if (user.energyPrice <= .01) {
             alertify.alert("Energy must be more than .01");
        } else {
            if (adjust === "up") {
                user.energyPrice = (parseFloat(user.energyPrice) + .01).toFixed(2);
            } else if (adjust === "down") {
                user.energyPrice = (parseFloat(user.energyPrice) - .01).toFixed(2);
            }
        }
        View.renderEnergyPrice();
    },
    adjustGasPrice: function(adjust) {
        if (user.gasPrice <= .01) {
             alertify.alert("Gas must be more than .01");
        } else {
            if (adjust === "up") {
                user.gasPrice = (parseFloat(user.gasPrice) + .01).toFixed(2);
            } else if (adjust === "down") {
                user.gasPrice = (parseFloat(user.gasPrice) - .01).toFixed(2);
            }
        }
        View.renderGasPrice();
    }
};

var compCar = {
    jsonTcoData: [],
    jsonPerformanceData: [],
    id: "",
    make: "",
    model: "",
    year: 0,
    photoUrls: [],
    tankSize: 0,
    combinedMPG: 0,
    cityMpg: 0,
    hwyMpg: 0,
    horsepower: 0,
    torque: 0,
    aeroDrag: 0,
    weight: 0,
    fuelCapacity: 0,
    zeroSixty: 0,
    turnRadius: 0,
    fuelCost: 0,
    annualCosts: {
        fuel: [],
        insurance: [],
        maintenance: [],
        repairs: [],
        depreciation: [],
        taxandfees: [],
        financing: [],
        taxcredit: 0,
        yearTotals: [0,0,0,0,0],
        grandTotal: 0
    },
    tests: {
        mpg: false,
        costs: 35,
        performance: 6
    },
    setFuelCosts: function() {
        this.fuelCost = ((user.annualMiles / this.combinedMPG) * user.gasPrice);
        this.annualCosts.fuel[5] = 0;
        for (i = 0; i < 5; i++) {
            this.annualCosts.fuel[i] = this.fuelCost;
            this.annualCosts.fuel[5] += this.fuelCost;
        }
    },
    parseTCOData: function() {
        var tcoData = compCar.jsonTcoData[0];
        this.annualCosts.grandTotal = 0;
        this.annualCosts.insurance[5] = 0;
        this.annualCosts.maintenance[5] = 0;
        this.annualCosts.repairs[5] = 0;
        this.annualCosts.depreciation[5] = 0;
        this.annualCosts.taxandfees[5] = 0;
        this.annualCosts.financing[5] = 0;
        this.annualCosts.fuel[5] = 0;
        /* check if doesn't exist first, then proceed to total and grand total */
        for (j = 0; j < 5; j++) {
            if (isNaN(tcoData.fuel.values[j]) === true ) {
                this.annualCosts.fuel[j] = "unknown";
            } else {
                this.annualCosts.fuel[j] = this.fuelCost;
                this.annualCosts.fuel[5] += this.fuelCost;
                this.annualCosts.yearTotals[j] += this.fuelCost;
                this.annualCosts.grandTotal += this.fuelCost;
            }
            if (isNaN(tcoData.insurance.values[j]) === true ) {
                this.annualCosts.insurance[j] = "unknown";
            } else {
                this.annualCosts.insurance[j] = tcoData.insurance.values[j];
                this.annualCosts.insurance[5] += tcoData.insurance.values[j];
                this.annualCosts.yearTotals[j] += tcoData.insurance.values[j];
                this.annualCosts.grandTotal += tcoData.insurance.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(tcoData.maintenance.values[j]) === true ) {
                this.annualCosts.maintenance[j] = "unknown";
            } else {
                this.annualCosts.maintenance[j] = tcoData.maintenance.values[j];
                this.annualCosts.maintenance[5] += tcoData.maintenance.values[j];
                this.annualCosts.yearTotals[j] += tcoData.maintenance.values[j];
                this.annualCosts.grandTotal += tcoData.maintenance.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(tcoData.repairs.values[j]) === true ) {
                this.annualCosts.repairs[j] = "unknown";
            } else {
                this.annualCosts.repairs[j] = tcoData.repairs.values[j];
                this.annualCosts.repairs[5] += tcoData.repairs.values[j];
                this.annualCosts.yearTotals[j] += tcoData.repairs.values[j];
                this.annualCosts.grandTotal += tcoData.repairs.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(tcoData.depreciation.values[j]) === true ) {
                this.annualCosts.depreciation[j] = "unknown";
            } else {
                this.annualCosts.depreciation[j] = tcoData.depreciation.values[j];
                this.annualCosts.depreciation[5] += tcoData.depreciation.values[j];
                this.annualCosts.yearTotals[j] += tcoData.depreciation.values[j];
                this.annualCosts.grandTotal += tcoData.depreciation.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(tcoData.taxandfees.values[j]) === true ) {
                this.annualCosts.taxandfees[j] = "unknown";
            } else {
                this.annualCosts.taxandfees[j] = tcoData.taxandfees.values[j];
                this.annualCosts.taxandfees[5] += tcoData.taxandfees.values[j];
                this.annualCosts.yearTotals[j] += tcoData.taxandfees.values[j];
                this.annualCosts.grandTotal += tcoData.taxandfees.values[j];
                this.tests.costs -= 1;
            }
            if (isNaN(tcoData.financing.values[j]) === true ) {
                this.annualCosts.financing[j] = "unknown";
            } else {
                this.annualCosts.financing[j] = tcoData.financing.values[j];
                this.annualCosts.financing[5] += tcoData.financing.values[j];
                this.annualCosts.yearTotals[j] += tcoData.financing.values[j];
                this.annualCosts.grandTotal += tcoData.financing.values[j];
                this.tests.costs -= 1;
            }
        }
    },
    parsePerformanceData: function() {
        var performanceData = compCar.jsonPerformanceData;
        if (isNaN(performanceData[0].engine.horsepower) === false && isNaN(performanceData[0].engine.horsepower) === false) {
            compCar.combinedMPG = Math.round((performanceData[0].MPG.city * .55) + (performanceData[0].MPG.highway * .45));
            compCar.cityMpg = performanceData[0].MPG.city;
            compCar.hwyMpg = performanceData[0].MPG.highway;
            compCar.tests.mpg = true;
        } else {
            compCar.tests.mpg = false;
        }
        if (isNaN(performanceData[0].engine.horsepower) === true ) {
            compCar.horsepower = "unknown";
        } else {
            compCar.horsepower = performanceData[0].engine.horsepower
            compCar.tests.performance -= 1;
        }
        if (isNaN(performanceData[0].engine.torque) === true ) {
            compCar.torque = "unknown";
        } else {
            compCar.torque = performanceData[0].engine.torque;
            compCar.tests.performance -= 1;
        }
        /* second data query for certain statistics */
        for (j = 0; j < performanceData[1].equipment.length; j++) {
            if (performanceData[1].equipment[j].name === "Specifications") {
                for (q = 0; q < performanceData[1].equipment[j].attributes.length; q++) {
                    if (performanceData[1].equipment[j].attributes[q].name === "Aerodynamic Drag (cd)") {
                        compCar.aeroDrag = performanceData[1].equipment[j].attributes[q].value
                        compCar.tests.performance -= 1;
                    } else if (performanceData[1].equipment[j].attributes[q].name === "Curb Weight") {
                        compCar.weight = performanceData[1].equipment[j].attributes[q].value;
                        compCar.tests.performance -= 1;
                    } else if (performanceData[1].equipment[j].attributes[q].name === "Epa Combined Mpg") {
                        compCar.combinedMPG = performanceData[1].equipment[j].attributes[q].value;
                    } else if (performanceData[1].equipment[j].attributes[q].name === "Fuel Capacity") {
                        compCar.tankSize = performanceData[1].equipment[j].attributes[q].value;
                        compCar.fuelCapacity = (compCar.tankSize * compCar.combinedMPG).toFixed(0);
                    } else if (performanceData[1].equipment[j].attributes[q].name === "Manufacturer 0 60mph Acceleration Time (seconds)") {
                        compCar.tests.performance -= 1;
                        compCar.zeroSixty = performanceData[1].equipment[j].attributes[q].value;
                    } else if (performanceData[1].equipment[j].attributes[q].name === "Turning Diameter") {
                        compCar.tests.performance -= 1;
                        compCar.turnRadius = performanceData[1].equipment[j].attributes[q].value;
                    }
                }
            }
        }
    }
};
var tesla = {
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
        grandTotal: 0,
        yearTotals: []
    },
    sixty: {
        cityMpg: 94,
        hwyMpg: 97,
        combinedMPG: 95,
        mileCapacity: 208,
        zeroSixty: 5.9,
        horsepower: 302,
        torque: 317,
        imageUrl: "images/model-s-60.jpg",
        title: "Tesla Model S 60",
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
    eightyFive: {
        cityMpg: 88,
        hwyMpg: 90,
        combinedMPG: 89,
        mileCapacity: 265,
        zeroSixty: 5.4,
        horsepower: 362,
        torque: 325,
        imageUrl: "images/model-s-85.jpg",
        title: "Tesla Model S 85",
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
        imageUrl: "images/model-s-p85.jpg",
        title: "Tesla Model S p85D",
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
        this.fuelCost = ((user.annualMiles * .33) * user.energyPrice).toFixed(0);
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
            this.totalCosts.yearTotals[year] = selectedTesla.annualCosts.insurance[year] + selectedTesla.annualCosts.maintenance[year] + selectedTesla.annualCosts.repairs[year] + selectedTesla.annualCosts.depreciation[year] + selectedTesla.annualCosts.taxandfees[year] + selectedTesla.annualCosts.financing[year]  + selectedTesla.annualCosts.taxcredit[year];
            this.totalCosts.grandTotal += selectedTesla.annualCosts.insurance[year] + selectedTesla.annualCosts.maintenance[year] + selectedTesla.annualCosts.repairs[year] + selectedTesla.annualCosts.depreciation[year] + selectedTesla.annualCosts.taxandfees[year] + selectedTesla.annualCosts.financing[year]  + selectedTesla.annualCosts.taxcredit[year];
        }
    }
};

var View = {
    makes: [],
    models: [],
    trims: [],
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
        for (var j = 0; j < this.makes.length; j++){
            $('#makeSelect').append('<option value="' + this.makes[j] + '">' + this.makes[j] + '</option>');
        }
        $("#makeSelect").prop('disabled', false);
    },
    renderModelSelect: function() {
        $('#modelSelect').children('option').remove();
        $('#trimSelect').children('option').remove();
        $('#modelSelect').append($("<option></option>").attr("value",0).text('Model'));
        $('#trimSelect').append($("<option></option>").attr("value",0).text('Trim'));
        $("#trimSelect").prop('disabled', true);
        $("#stateSelect").prop('disabled', true);
        for (var j = 0; j < this.models.length; j++){
            $('#modelSelect').append('<option value="' + this.models[j] + '">' + this.models[j] + '</option>');
        }
        $("#modelSelect").prop('disabled', false);
    },
    renderTrimSelect: function() {
        $('#trimSelect').children('option').remove();
        $('#trimSelect').append($("<option></option>").attr("value",0).text('Trim'));
        $("#stateSelect").prop('disabled', true);
        $('#zipCode').prop('disabled', true);
        for (var j = 0; j < this.trims.length; j++){
            $('#trimSelect').append('<option value="' + this.trims[j][0] + '">' + this.trims[j][1] + '</option>');
        }
        $("#trimSelect").prop('disabled', false);
    },
    loadTest: false,
    renderPhoto: function(selectedTesla) {
        $("#comparison-photo").attr('src','http://media.ed.edmunds-media.com' + compCar.photoUrls[0]);
        $("#tesla-photo").attr('src', selectedTesla.imageUrl);
    },
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
        $("#comparison-title").text(compCar.make + " " + compCar.model);
        $("#comp-MPG-combined").text(compCar.combinedMPG);
        $("#comp-MPG-city").text(compCar.cityMpg);
        $("#comp-MPG-highway").text(compCar.hwyMpg);
        $("#comp-fuel-cost").text('$ ' + compCar.fuelCost.toFixed(0));
    },
    renderTeslaAnnualFuel: function(selectedTesla) {
        $("#tesla-title").text(selectedTesla.title);
        $("#tesla-MPG-combined").text(selectedTesla.combinedMPG);
        $("#tesla-MPG-city").text(selectedTesla.cityMpg);
        $("#tesla-MPG-highway").text(selectedTesla.hwyMpg);
        $('#tesla-fuel-cost').text('$ ' + tesla.fuelCost);  
    },
    renderGasPrice: function() {
        $("#currentgas").text(user.state + ' $' + user.gasPrice);
    },
    renderEnergyPrice: function() {
        $("#currentenergy").text(user.state + ' $' + user.energyPrice);
    },
    renderTeslaPerformanceData: function(selectedTesla) {
        $("#tesla-title-performance").text(selectedTesla.title);
        $("#tesla-horsepower").text(selectedTesla.horsepower + " hp");
        $("#tesla-torque").text(selectedTesla.torque + " lbs");
        $("#tesla-0-60").text(selectedTesla.zeroSixty + ' sec.');
        $("#tesla-radius").text(tesla.turnRadius + ' ft.');
        $("#tesla-airdrag").text(tesla.aeroDrag);
        $("#tesla-weight").text(tesla.weight + ' lbs');
    },
    renderCompPerformanceData: function() {
        alertify.log("Tesla " + tesla.selectedType + " VS. " + compCar.make + " " + compCar.model); 
        $("#comparison-title-performance").text(compCar.make + " " + compCar.model);
        $("#comp-annual-title").text(compCar.make + " " + compCar.model);
        $("#comp-horsepower").text(compCar.horsepower + " hp");
        $("#comp-torque").text(compCar.torque + " lbs");
        $("#comp-0-60").text(compCar.zeroSixty + ' sec.');
        $("#comp-radius").text(compCar.turnRadius + ' ft.');
        $("#comp-airdrag").text(compCar.aeroDrag);
        $("#comp-weight").text(compCar.weight + ' lbs');
    },
    renderTeslaAnnualCosts: function(selectedTesla) {
        for(var year = 0; year < 5; year++) {
            $("#tesla-fuel" + (year + 1)).text('$' + tesla.fuelCost);
            $("#tesla-insurance" + (year + 1)).text('$' + selectedTesla.annualCosts.insurance[year]);
            $("#tesla-maintenance" + (year + 1)).text('$' + selectedTesla.annualCosts.maintenance[year]);
            $("#tesla-repairs" + (year + 1)).text('$' + selectedTesla.annualCosts.repairs[year]);
            $("#tesla-depreciation" + (year + 1)).text('$' + selectedTesla.annualCosts.depreciation[year]);
            $("#tesla-tax" + (year + 1)).text('$' + selectedTesla.annualCosts.taxandfees[year]);
            $("#tesla-financing" + (year + 1)).text('$' + selectedTesla.annualCosts.financing[year]);
            $("#tesla-tax-credit" + (year + 1)).text('$' + selectedTesla.annualCosts.taxcredit[year]);
            $("#tesla-total-year" + (year + 1)).text('$' + selectedTesla.annualCosts.yearTotals[year]);
        }
        $("#tesla-insurance-total").text('$' + tesla.totalCosts.insurance);
        $("#tesla-fuel-total").text('$' + tesla.fuelTotal);
        $("#tesla-maintenance-total").text('$' + tesla.totalCosts.maintenance);
        $("#tesla-repairs-total").text('$' + tesla.totalCosts.repairs);
        $("#tesla-depreciation-total").text('$' + tesla.totalCosts.depreciation);
        $("#tesla-tax-total").text('$' + tesla.totalCosts.taxandfees);
        $("#tesla-financing-total").text('$' + tesla.totalCosts.financing);
        $("#tesla-tax-credit-total").text('$' + tesla.totalCosts.taxcredit);
        $("#tesla-grand-total").text('$' + tesla.totalCosts.grandTotal);
    },
    renderCompAnnualCosts: function() {
        for (var year = 0; year < 5; year++) {
            $("#comp-fuel" + (year + 1)).text('$' + compCar.fuelCost.toFixed(0));
            $("#comp-insurance" + (year + 1)).text('$' + compCar.annualCosts.insurance[year]);
            $("#comp-maintenance" + (year + 1)).text('$' + compCar.annualCosts.maintenance[year]);
            $("#comp-repairs" + (year + 1)).text('$' + compCar.annualCosts.repairs[year]);
            $("#comp-depreciation" + (year + 1)).text('$' + compCar.annualCosts.depreciation[year]);
            $("#comp-tax" + (year + 1)).text('$' + compCar.annualCosts.taxandfees[year]);
            $("#comp-financing" + (year + 1)).text('$' + compCar.annualCosts.financing[year]);
            $("#comp-tax-credit" + (year + 1)).text('$' + compCar.annualCosts.taxcredit);
            $("#comp-total-year" + (year + 1)).text('$' + compCar.annualCosts.yearTotals[year]);
        }
        $("#comp-fuel-total").text('$' + compCar.annualCosts.fuel[5].toFixed(0));
        $("#comp-insurance-total").text('$' + compCar.annualCosts.insurance[5]);
        $("#comp-maintenance-total").text('$' + compCar.annualCosts.maintenance[5]);
        $("#comp-repairs-total").text('$' + compCar.annualCosts.repairs[5]);
        $("#comp-depreciation-total").text('$' + compCar.annualCosts.depreciation[5]);
        $("#comp-tax-total").text('$' + compCar.annualCosts.taxandfees[5]);
        $("#comp-financing-total").text('$' + compCar.annualCosts.financing[5]);
        $("#comp-tax-credit-total").text('$' + compCar.annualCosts.taxcredit);
        $("#comp-grand-total").text('$' + compCar.annualCosts.grandTotal);
    }
};


// Select box on change functions

	$("#yearSelect").change(function() {
        compCar.year = $("#yearSelect").val();
        edmundsApi.getMakeNames();
        setTimeout(function(){
            View.renderMakeSelect();
        }, 800);
        
	});

	$("#makeSelect").change(function() {
        compCar.make = $("#makeSelect").val();
        edmundsApi.getModelNames();
        setTimeout(function(){
            View.renderModelSelect();
        }, 800);
	});

    $("#modelSelect").change(function() {
        compCar.model =  $("#modelSelect").val();
        edmundsApi.getTrimNames();
        setTimeout(function(){
            View.renderTrimSelect();
        }, 500);
    });

    $("#trimSelect").change(function() {
        $("#zipCode").prop('disabled', false);
        $("#stateSelect").prop('disabled', false);
    });

    $("#60kwh").click(function () {
        tesla.selectedType = tesla.sixty;
        $("#60kwh").css("border-color", "#FFB426");
        $("#85kwh").css("border-color", "#bf0021");
        $("#p85kwh").css("border-color", "#bf0021");
    });

    $("#85kwh").click(function () {
        tesla.selectedType = tesla.eightyFive;
        $("#85kwh").css("border-color", "#FFB426");
        $("#60kwh").css("border-color", "#bf0021");
        $("#p85kwh").css("border-color", "#bf0021");
    });

    $("#p85kwh").click(function () {
        tesla.selectedType = tesla.P85D;
        $("#p85kwh").css("border-color", "#FFB426");
        $("#85kwh").css("border-color", "#bf0021");
        $("#60kwh").css("border-color", "#bf0021");
        $("#60kwh-description").css("border-color", "#bf0021");
        $("#85kwh-description").css("border-color", "#bf0021");
        $("#p85kwh-description").css("border-color", "#FFB426");
    });

function reset() {
location.reload();
}

function showSections() {
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

function submitController() {
    edmundsApi.getPerformanceData();
    tesla.setCostTotals(tesla.selectedType);

    user.setGasPrice();
    user.setEnergyPrice();

    setTimeout(function(){
        tesla.setFuelCosts();
        
        compCar.parsePerformanceData();
        edmundsApi.getTCOData()
    }, 2000);
    setTimeout(function(){
        compCar.parseTCOData();
        edmundsApi.getPhotoUrls();
    }, 4000);
    setTimeout(function(){
        compCar.setFuelCosts();
        View.renderPhoto(tesla.selectedType);
        View.renderAnnualMiles();
        View.renderCostDifference();
        View.renderCompAnnualFuel();
        View.renderTeslaAnnualFuel(tesla.selectedType);
        View.renderGasPrice();
        View.renderEnergyPrice();
        View.renderTeslaPerformanceData(tesla.selectedType);
        View.renderCompPerformanceData();
        View.renderTeslaAnnualCosts(tesla.selectedType);
        View.renderCompAnnualCosts();
    }, 5000);
    setTimeout(function(){
        //all view stuff
        showSections();
    }, 5500);
    setTimeout(function(){
        // submitFirebase();
    }, 7000);
}

function submitCar() {
    isCarLoaded = true;
    compCar.id =  $("#trimSelect").val();
    user.zipCode = $("#zipCode").val();
    user.state = $("#stateSelect").val();
        if (user.zipCode.length === 5 & tesla.selectedType != "") {
            if(View.loadTest === false) {
                View.loadTest = true;
                submitController();
            } else if(View.loadTest === true) {
                $(".fuel-section-div1").hide();
                $(".fuel-section-div2").hide();
                $('.mile-slider').css('visibility','hidden');
                $(".performance-section-div").hide();
                $(".comp-annual-div").hide();
                $(".tesla-annual-div").hide();
                $(".section-nav").hide();
                submitController();
            }
        } else if (user.zipCode.length === 5 & tesla.selectedType === "") {
           alertify.alert("Please select Tesla Type");
        } else if (user.zipCode.length != 5 & tesla.selectedType != "") {
            alertify.alert("Please select a Comparison Car");
        }  else {
            alertify.alert("Please select a Tesla and Comparison Car");
        }
    }

// function totalCarValue (zip, id, tesla) {
// $.getJSON('https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/' + id + '/' + zip + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
//     $("#comp-value").text('$' + json.value);
// });
// setTimeout(function(){
//             if (tesla === "60") {
//     $.getJSON('https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/200691966/' + zip + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
//     $("#tesla-value").text('$' + json.value);
//     });
// } else if (tesla === "85") {
//     $.getJSON('https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/200692320/' + zip + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
//     $("#tesla-value").text('$' + json.value);
//     });
// } else if (tesla === "p85") {
//     $.getJSON('https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/200691967/' + zip + '?fmt=json&api_key=s65k59axsr9w63js5dbespvw', function(json) {
//     $("#tesla-value").text('$' + json.value);
//     });
// }
//         }, 3500);
// }


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

// function populateGasPrices (state) {
//     if (state === "ME" || state === "CT" || state === "NH" || state === "RI" || state === "VT") {
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R1X_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "DE" || state === "DC" || state === "MD" || state === "NJ" || state === "NY"|| state === "PA"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R1Y_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "GA" || state === "NC" || state === "SC" || state === "VA"|| state === "WV"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R1Z_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "IL" || state === "IN" || state === "IO" || state === "KS" || state === "KY"|| state === "MI" || state === "MO" || state === "NE" || state === "ND" || state === "SD" || state === "OH" || state === "OK" || state === "TN" || state === "WI"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R20_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "AL" || state === "AR" || state === "LA" || state === "MS" || state === "NM"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R30_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "ID" || state === "MT" || state === "UT" || state === "WY"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R40_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "AK" || state === "AZ" || state === "HI" || state === "NV" || state === "OR"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_R50_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "CA"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMR_PTE_SCA_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "CO"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SCO_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "FL"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SFL_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "MA"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMR_PTE_SMA_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "MN"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SMN_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "NY"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SNY_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "OH"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SOH_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "TX"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_STX_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     } else if (state === "WA"){
//         $.getJSON('http://api.eia.gov/series/?api_key=A6B96A76EB253D25661793034E944760&series_id=PET.EMM_EPMMU_PTE_SWA_DPG.W', function(json) {

//         user.gasPrice = (json.series[0].data[0][1]);
//         $("#currentgas").text(state + ' $' + user.gasPrice.toFixed(2));
//         });
//     }
// }


// function teslaAnnualCost (tesla) {
//     teslaInsuranceTotal = 0, teslaMaintenanceTotal = 0, teslaRepairsTotal = 0,
//     teslaDepreciationTotal = 0, teslaTaxTotal = 0, teslaFinancingTotal = 0, teslaTaxCreditTotal = 0, teslaGrandTotal = 0;
//     if (tesla === "60") {
//         for(i = 0; i < 5; i++) {
//             $("#tesla-fuel" + (i + 1)).text('$' + tesla.fuelCost.toFixed(0));
//             $("#tesla-insurance" + (i + 1)).text('$' + teslaInsurance[i]);
//             teslaInsuranceTotal += teslaInsurance[i];
//             $("#tesla-maintenance" + (i + 1)).text('$' + tesla60Maintenance[i]);
//             teslaMaintenanceTotal += tesla60Maintenance[i];
//             $("#tesla-repairs" + (i + 1)).text('$' + tesla60Repairs[i]);
//             teslaRepairsTotal += tesla60Repairs[i];
//             $("#tesla-depreciation" + (i + 1)).text('$' + tesla60Depreciation[i]);
//             teslaDepreciationTotal += tesla60Depreciation[i];
//             $("#tesla-tax" + (i + 1)).text('$' + tesla60Tax[i]);
//             teslaTaxTotal += tesla60Tax[i];
//             $("#tesla-financing" + (i + 1)).text('$' + teslaFinancing[i]);
//             teslaFinancingTotal += teslaFinancing[i];
//             $("#tesla-tax-credit" + (i + 1)).text('$' + tesla60TaxCredit[i]);
//             teslaTaxCreditTotal += tesla60TaxCredit[i];
//             var total = tesla.fuelCost + tesla60TaxCredit[i] + teslaInsurance[i] + tesla60Maintenance[i] + tesla60Repairs[i] + tesla60Depreciation[i] + tesla60Tax[i]  + teslaFinancing[i];
//             teslaGrandTotal += total;
//             $("#tesla-total-year" + (i + 1)).text('$' + total.toFixed(0));
//         }

//     } else if (tesla === "85") {
//         for(i = 0; i < 5; i++) {
//             $("#tesla-fuel" + (i + 1)).text('$' + tesla.fuelCost.toFixed(0));
//             $("#tesla-insurance" + (i + 1)).text('$' + teslaInsurance[i]);
//             teslaInsuranceTotal += teslaInsurance[i];
//             $("#tesla-maintenance" + (i + 1)).text('$' + tesla85Maintenance[i]);
//             teslaMaintenanceTotal += tesla85Maintenance[i];
//             $("#tesla-repairs" + (i + 1)).text('$' + tesla85Repairs[i]);
//             teslaRepairsTotal += tesla85Repairs[i];
//             $("#tesla-depreciation" + (i + 1)).text('$' + tesla85Depreciation[i]);
//             teslaDepreciationTotal += tesla85Depreciation[i];
//             $("#tesla-tax" + (i + 1)).text('$' + tesla85Tax[i]);
//             teslaTaxTotal += tesla85Tax[i];
//             $("#tesla-financing" + (i + 1)).text('$' + teslaFinancing[i]);
//             teslaFinancingTotal += teslaFinancing[i];
//             $("#tesla-tax-credit" + (i + 1)).text('$' + tesla85TaxCredit[i]);
//             teslaTaxCreditTotal += tesla85TaxCredit[i];
//             var total = tesla.fuelCost + tesla85TaxCredit[i] + teslaInsurance[i] + tesla85Maintenance[i] + tesla85Repairs[i] + tesla85Depreciation[i] + tesla85Tax[i]  + teslaFinancing[i];
//             teslaGrandTotal += total;
//             $("#tesla-total-year" + (i + 1)).text('$' + total.toFixed(0));
//         }
//     } else if (tesla === "p85") {
//         for(i = 0; i < 5; i++) {
//             $("#tesla-fuel" + (i + 1)).text('$' + tesla.fuelCost.toFixed(0));
//             $("#tesla-insurance" + (i + 1)).text('$' + teslaInsurance[i]);
//             teslaInsuranceTotal += teslaInsurance[i];
//             $("#tesla-maintenance" + (i + 1)).text('$' + teslap85Maintenance[i]);
//             teslaMaintenanceTotal += teslap85Maintenance[i];
//             $("#tesla-repairs" + (i + 1)).text('$' + teslap85Repairs[i]);
//             teslaRepairsTotal += teslap85Repairs[i];
//             $("#tesla-depreciation" + (i + 1)).text('$' + teslap85Depreciation[i]);
//             teslaDepreciationTotal += teslap85Depreciation[i];
//             $("#tesla-tax" + (i + 1)).text('$' + teslap85Tax[i]);
//             teslaTaxTotal += teslap85Tax[i];
//             $("#tesla-financing" + (i + 1)).text('$' + teslaFinancing[i]);
//             teslaFinancingTotal += teslaFinancing[i];
//             $("#tesla-tax-credit" + (i + 1)).text('$' + teslap85TaxCredit[i]);
//             teslaTaxCreditTotal += teslap85TaxCredit[i];
//             var total = tesla.fuelCost + teslap85TaxCredit[i] + teslaInsurance[i] + teslap85Maintenance[i] + teslap85Repairs[i] + teslap85Depreciation[i] + teslap85Tax[i]  + teslaFinancing[i];
//             teslaGrandTotal += total;
//             $("#tesla-total-year" + (i + 1)).text('$' + total.toFixed(0));
//         }
//     }
//     $("#tesla-insurance-total").text('$' + teslaInsuranceTotal);
//     $("#tesla-maintenance-total").text('$' + teslaMaintenanceTotal);
//     $("#tesla-repairs-total").text('$' + teslaRepairsTotal);
//     $("#tesla-depreciation-total").text('$' + teslaDepreciationTotal);
//     $("#tesla-tax-total").text('$' + teslaTaxTotal);
//     $("#tesla-financing-total").text('$' + teslaFinancingTotal);
//     $("#tesla-tax-credit-total").text('$' + teslaTaxCreditTotal);
//     $("#tesla-grand-total").text('$' + teslaGrandTotal.toFixed(0));
// }
