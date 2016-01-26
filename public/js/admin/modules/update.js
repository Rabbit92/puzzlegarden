function isset(o) {
    return 'undefined' !== typeof(o);
}
function populateDefaults(dest, src) {
    for (var key in src) {
        if (! isset(dest[key])) {
            dest[key] = src[key];
        }
    }
    
    return dest;
}
/* 
 *  Unless otherwise specified, this is closed-source. Copying without permission is prohibited and may result in legal action with or without this license header
 */

/* global ajaxurl */

function plant_load(arr, callback, options, thisArg) {
    var args = populateDefaults({}, options);
    args = populateDefaults(args, {
        action: 'search_plants',
        ids: arr
    });
    jQuery.getJSON(ajaxurl, args).success(function(plants) {
        callback.call(thisArg, plants);
    });
}

function plant_search(str, callback, options, thisArg) {
    var args = populateDefaults({}, options);
    args = populateDefaults(args, {
        action: 'search_plants',
        search: str
    });
    jQuery.getJSON(ajaxurl, args).success(function(plants) {
        callback.call(thisArg, plants);
    });
}
/* 
 *  Unless otherwise specified, this is closed-source. Copying without permission is prohibited and may result in legal action with or without this license header
 */

jQuery(function ($) {
    var plantSearchIn = document.getElementById('plantSearchIn');
    var plantSearchOut = document.getElementById('plantSearchOut');
    var plantSearchSuggest = document.getElementById('plantSearchSuggest');
    var modulePrice = document.getElementById('modulePrice');
    var plantsByName = {};
    var plantsById = {};

    function getPlantName(plant) {
        return (plant.name) + '(' + (plant.scientific) + ')';
    }

    function recalc(ev) {
        var amounts = plantSearchOut.querySelectorAll('.amount');

        var total = 0;

        for (var i = 0; i < amounts.length; i++) {
            var domAmount = amounts[i];
            var plant_id = $(domAmount).data('plant');
            var plant = plantsById[plant_id]
            total += plant.price * domAmount.value;
        }
        ;

        modulePrice.value = total;
    }

    function parsePlants(plants) {
        plants.forEach(function (plant) {
            if (!isset(plantsById[plant.id])) {
                plant.uniqueName = getPlantName(plant);

                var optionName = document.createElement('option');
                optionName.innerHTML = plant.name;
                plantSearchSuggest.appendChild(optionName);
                plant.domOptionName = optionName;

                var optionScientific = document.createElement('option');
                optionScientific.innerHTML = plant.scientific;
                plantSearchSuggest.appendChild(optionScientific);
                plant.domOptionScientific = optionScientific;

                plantsByName[plant.name] = plant;
                plantsByName[plant.scientific] = plant;
                plantsById[plant.id] = plant;
            } else {
                var oldPlant = plantsById[plant.id];
                plantsById[plant.id] = populateDefaults(plant, oldPlant);
                plantsByName[oldPlant.name] = plantsById[plant.id];
                plantsByName[oldPlant.scientific] = plantsById[plant.id];

                oldPlant.domOptionName.innerHTML = oldPlant.name;
                oldPlant.domOptionScientific.innerHTML = oldPlant.scientific;
            }
        });
    }

    function searchPlant(ev) {
        ev.preventDefault();
        var search = plantSearchIn.value;

        if (isset(plantsByName[search])) {

            plantSearchIn.value = '';

            var plant = plantsByName[search];
            if (isset(plant.selectedListItem)) {
                return;
            }

            var li = document.createElement('li');
            var check = document.createElement('input');
            check.type = 'checkbox';
            check.checked = true;
            check.name = 'plant[' + (plant.id) + '][selected]';
            check.value = plant.id;
            check.classList.add('plant-check');
            li.appendChild(check);
            $(check).data('plant', plant.id);

            var amount = document.createElement('input');
            amount.type = 'number';
            amount.min = 0;
            amount.step = 1;
            amount.name = 'plant[' + (plant.id) + '][amount]';
            amount.value = 1;
            amount.classList.add('amount');
            li.appendChild(amount);
            $(amount).data('plant', plant.id);

            var desc = document.createElement('span');
            desc.innerHTML = plant.uniqueName + ' - ' + plant.price + 'RON';
            li.appendChild(desc);
            plantSearchOut.appendChild(li);

            plant.selectedListItem = li;

            recalc(ev);

            return;
        }

        plant_search(plantSearchIn.value, parsePlants);
    }

    function removePlant(ev) {
        var $check = $(ev.currentTarget).closest('li').find('.plant-check');

        var plant = plantsById[$check.val()];

        delete(plant.selectedListItem);

        $check.closest('li').remove();
        recalc(ev);

    }


    plantSearchIn.addEventListener('keyup', searchPlant);

    plantSearchIn.addEventListener('change', searchPlant);

    $(plantSearchOut).on('change', '.amount', function (ev) {
        recalc(ev);
        if (ev.currentTarget.value < 1) {
            removePlant(ev);
        }
    }).on('change', '.plant-check', function (ev) {
        removePlant(ev);
    });

    // Load Initial plants
    var oldPlantsDoms = plantSearchOut.querySelectorAll('.plant-check');
    var oldPlantsIds = {};
    for (var i = 0; i < oldPlantsDoms.length; i++) {
        var domPlant = oldPlantsDoms[i];
        oldPlantsIds[domPlant.value] = domPlant;
    }

    if (0 < Object.keys(oldPlantsIds).length) {
        plant_load(Object.keys(oldPlantsIds), function (plants) {
            plants.forEach(function(plant){
                plant.selectedListItem = $(oldPlantsIds[plant.id]).closest('li')[0];
            });
            parsePlants(plants);
        });
    }
});

//# sourceMappingURL=update.js.map
