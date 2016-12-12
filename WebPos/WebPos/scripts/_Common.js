//function getQueryString(name, url) {
//    if (!url) {
//        url = window.location.href;
//    }
//    name = name.replace(/[\[\]]/g, "\\$&");
//    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//        results = regex.exec(url);
//    if (!results) return null;
//    if (!results[2]) return '';
//    return decodeURIComponent(results[2].replace(/\+/g, " "));
//}

//$(document).ready(function () {
//    var token = getQueryString('token');
//    if (token != null) {
//        sessionStorage.setItem('token', token);
//        window.history.pushState("Sunseed", "Sunseed POS", "/secret" + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]);
//    }
//});

function validateForm() {
    var valid = true;

    if (!containItems()) {
        event.preventDefault();
        valid = false;
        alert("Doklad musí obsahovat alespoň jedno zboží!");
        document.forms["MainForm"]["Item1_GUID"].focus();
    }
    return valid;
}

function validation_IC() {
    var ic = document.forms["MainForm"]["Customer_IC"].value;

    if (ic != "") {
        var array = ic.split("");

        var sum = 0;
        for (var i = 0; i < 7; i++)
            sum += Number(array[i]) * (8 - i);

        sum = sum % 11;
        var lastDigit;

        if (sum == 0) lastDigit = 1;
        else if (sum == 1) lastDigit = 0;
        else lastDigit = 11 - sum;

        if (Number(array[7]) == lastDigit)
            document.forms["MainForm"]["Customer_IC"].setCustomValidity("");
        else {
            document.forms["MainForm"]["Customer_IC"].setCustomValidity("Neplatné IČ");
            document.forms["MainForm"]["Customer_IC"].focus();
        }
    }
    else document.forms["MainForm"]["Customer_IC"].setCustomValidity("");
}

function input_onFocus(obj) {
    obj.setSelectionRange(0, obj.value.length);
}

function number_input(field) {
    field.value = field.value.replace(/[^\d.-]/g, '');
}

function recalculateTotals() {
    document.getElementById("total").innerText = (Number(document.getElementById("Item1_Total").value)
        + Number(document.getElementById("Item2_Total").value)
        + Number(document.getElementById("Item3_Total").value)
        + Number(document.getElementById("Item4_Total").value)).toFixed(2);

    var table = document.getElementById("payments_table");
    payments = table.getElementsByTagName("select");
    payment_values = table.getElementsByTagName("input");

    var isCashOnly = true;
    for (var i = 0; i < payments.length; i++)
        if (payments[i].value != "" && payments[i].isCashPayment == false) {
            isCashOnly = false;
            break;
        }

    if (isCashOnly) document.getElementById("total_for_payment").innerText = Math.round(Number(document.getElementById("total").innerText)).toFixed(2);
    else document.getElementById("total_for_payment").innerText = document.getElementById("total").innerText;

    var total_paid = 0;
    for (var i = 0; i < payment_values.length; i++)
        total_paid += Number(payment_values[i].value);

    var total_to_paid = Number(document.getElementById("total_for_payment").innerText) - total_paid;

    document.getElementById("total_paid").value = total_paid.toFixed(2);
    document.getElementById("total_to_paid").value = total_to_paid >= 0 ? total_to_paid.toFixed(2) : "0.00";
    document.getElementById("total_to_return").value = total_to_paid <= 0 ? total_to_paid.toFixed(2) : "0.00";
}

function isNullOrEmpty(obj) {
    if ((!obj && obj !== false) || !(obj.length > 0)) {
        return true;
    }
    return false;
}

function shop_onChange(value, data) {
    var shop = data.shopList.filter(function (obj) { return obj.Number == value; })[0];

    if (shop != undefined) {
        document.getElementById("Store_Street").value = shop.Street;
        document.getElementById("Store_City").value = shop.City;
        document.getElementById("Store_ZIP").value = shop.ZIP;
        document.getElementById("Store_IC").value = shop.PhoneNumber;
        document.getElementById("Store_DIC").value = shop.TST;
    }
    else {
        document.getElementById("Store_Street").value = "";
        document.getElementById("Store_City").value = "";
        document.getElementById("Store_ZIP").value = "";
        document.getElementById("Store_IC").value = "";
        document.getElementById("Store_DIC").value = "";
    }
}
