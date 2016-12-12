/// <reference path="_Common.js" />

function containItems() {
    var containItems = false;

    for (var index = 1; index <= 4; index++) {
        var item = document.forms["MainForm"]["Item" + index + "_GUID"].value;
        if (item != "") { containItems = true; break; }
    }
    return containItems;
}

function validateItems() {
    var isValid = true;
    var inputs = document.getElementById("articles").getElementsByTagName("input");

    for (var i = 0; i < inputs.length; i++)
        if (!inputs[i].validity.valid) {
            isValid = false;
            alert(inputs[i].validationMessage);
            inputs[i].focus();
            break;
        }

    return isValid;
}

function number_onchange(field) {
    var valid = true;
    if (!isNaN(field.value)) field.value = Number(field.value).toFixed(2);

    var item = field.id.substring(0, field.id.indexOf("_"));

    var totalField = document.getElementById(item + "_Total");
    var quantityField = document.getElementById(item + "_Quantity");
    var priceField = document.getElementById(item + "_Price");

    if (isNaN(quantityField.value)) {
        quantityField.setCustomValidity("Vložte platné číslo!");
        quantityField.focus();
        valid = false;
    }
    else if (Number(quantityField.value) == 0) {
        quantityField.setCustomValidity("Množství nemůže být 0!");
        priceField.focus();
        valid = false;
    }
    else quantityField.setCustomValidity("");

    if (isNaN(priceField.value)) {
        priceField.setCustomValidity("Vložte platné číslo!");
        priceField.focus();
        valid = false;
    }
    else if (Number(priceField.value) < 0) {
        priceField.setCustomValidity("Cena nemůže být menší než 0!");
        priceField.focus();
        valid = false;
    }
    else priceField.setCustomValidity("");

    if (valid && !isNullOrEmpty(quantityField.value) && !isNullOrEmpty(priceField.value))
        totalField.value = (quantityField.value * priceField.value).toFixed(2);
    else
        totalField.value = "";

    recalculateTotals();
}

function article_onChange(value, number, data) {
    var item = data.articleList.filter(function (obj) { return obj.UID == value; })[0];

    if (item != undefined) {
        document.getElementById("Item" + number + "_Description").disabled = false;
        document.getElementById("Item" + number + "_Quantity").disabled = false;
        document.getElementById("Item" + number + "_Price").disabled = false;

        document.getElementById("Item" + number + "_Description").value = item.Decription;
        document.getElementById("Item" + number + "_Quantity").value = "1.00";
        document.getElementById("Item" + number + "_Price").value = "0.00";
        document.getElementById("Item" + number + "_VAT").value = "21%"; //TODO
        document.getElementById("Item" + number + "_Total").value = "0.00";
    }
    else {
        document.getElementById("Item" + number + "_Description").disabled = true;
        document.getElementById("Item" + number + "_Quantity").disabled = true;
        document.getElementById("Item" + number + "_Price").disabled = true;

        document.getElementById("Item" + number + "_Description").value = "";
        document.getElementById("Item" + number + "_Quantity").value = "";
        document.getElementById("Item" + number + "_Price").value = "";
        document.getElementById("Item" + number + "_VAT").value = "";
        document.getElementById("Item" + number + "_Total").value = "";

        recalculateTotals();
    }
}

function disableItemInputs() {
    for (var i = 1; i <= 4; i++) {
        document.getElementById("Item" + i + "_GUID").disabled = true;
        document.getElementById("Item" + i + "_Description").disabled = true;
        document.getElementById("Item" + i + "_Quantity").disabled = true;
        document.getElementById("Item" + i + "_Price").disabled = true;
    }
}

function enableItemInputs() {
    for (var i = 1; i <= 4; i++) {
        var guid = document.getElementById("Item" + i + "_GUID");
        guid.disabled = null;
        if (guid.value != "") {
            document.getElementById("Item" + i + "_Description").disabled = null;
            document.getElementById("Item" + i + "_Quantity").disabled = null;
            document.getElementById("Item" + i + "_Price").disabled = null;
        }
    }
}