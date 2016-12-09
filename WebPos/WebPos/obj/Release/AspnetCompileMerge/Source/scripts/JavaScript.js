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

function Send() {
    return validateForm();
}

function validateForm() {
    var containsItems = false;

    for (var index = 1; index <= 4; index++) {
        var item = document.forms["MainForm"]["Item" + index + "_GUID"].value;
        if (item != "") { containsItems = true; break; }
    }

    if (!containsItems) {
        event.preventDefault();
        alert("Doklad musí obsahovat alespoň jedno zboží!");
        document.forms["MainForm"]["Item1_GUID"].focus();
    }
    return containsItems;
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

    document.getElementById("total_paid").value = total_paid.toFixed(2) + " Kč";
    document.getElementById("total_to_paid").value = total_to_paid >= 0 ? total_to_paid.toFixed(2) + " Kč" : "0.00 Kč";
    document.getElementById("total_to_return").value = total_to_paid <= 0 ? -total_to_paid.toFixed(2) + " Kč" : "0.00 Kč";
}

function addPayment_onClick(data) {
    var table = document.getElementById("payments_table").firstElementChild;

    index = table.rows.length;
    var row = table.insertRow(index);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    var select = document.createElement('select');
    select.id = "Payments_" + index + "__Type";
    select.name = "Payments[" + index + "].Type";
    select.appendChild(document.createElement('option'));
    for (var i = 0; i < data.paymentTypeList.length; i++) {
        var opt = document.createElement('option');
        opt.innerText = data.paymentTypeList[i].Description;
        opt.value = data.paymentTypeList[i].Type;
        select.appendChild(opt);
    }
    select.onchange = function () { paymentType_onChange(select, data) };
    select.isCashPayment = false;

    var input = document.createElement('input');
    input.disabled = true;
    input.id = "Payments_" + index + "__Value";
    input.name = "Payments[" + index + "].Value";
    input.onchange = function () { recalculateTotals(); };
    input.onfocus = function () { input_onFocus(this); };

    var button = document.createElement('button');
    button.onclick = function () { deletePayment_onClick(this); };

    cell1.appendChild(select);
    cell2.appendChild(input);
    cell3.appendChild(button);
}

function deletePayment_onClick(obj) {
    var rowToDelete = obj.parentElement.parentElement;
    var payments = rowToDelete.parentElement.children;
    rowToDelete.parentElement.removeChild(rowToDelete);

    for (var i = 0; i < payments.length; i++)
    {
        var select = payments[i].getElementsByTagName('select')[0];
        select.id = "Payments_" + i + "__Type";
        select.name = "Payments[" + i + "].Type";

        var input = payments[i].getElementsByTagName('input')[0];
        input.id = "Payments_" + i + "__Value";
        input.name = "Payments[" + i + "].Value";
    }
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

function paymentType_onChange(select, data) {
    var id1 = select.id.indexOf("_");
    var id2 = select.id.indexOf("__");

    var number = select.id.substring(9, select.id.indexOf("__"));
    var paymentType = data.paymentTypeList.filter(function (obj) { return obj.Type == select.value; })[0];
    var input = document.getElementById("Payments_" + number + "__Value");

    if (select.value != "" && paymentType != undefined) {
        select.isCashPayment = paymentType.IsCashPayment;
        input.disabled = false;
    }
    else {
        select.isCashPayment = false;
        input.disabled = true;
        input.value = "";
    }

    recalculateTotals();
}