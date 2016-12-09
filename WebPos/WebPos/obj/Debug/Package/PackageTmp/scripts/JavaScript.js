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


function number_input(field) {
    field.value = field.value.replace(/[^\d.-]/g, '');
}

function number_onchange(field) {
    field.value = Number(field.value).toFixed(2);

    var article = field.id.substring(0, field.id.indexOf("_"));

    var totalField = document.getElementById(article + "_total");
    var quantityField = document.getElementById(article + "_quantity");
    var priceField = document.getElementById(article + "_price");

    if (!isNullOrEmpty(quantityField.value) && !isNullOrEmpty(priceField.value))
        totalField.value = (quantityField.value * priceField.value).toFixed(2);
    else
        totalField.value = "";

    recalculateTotals();
}

function recalculateTotals() {
    document.getElementById("total").innerText = (Number(document.getElementById("article1_total").value)
        + Number(document.getElementById("article2_total").value)
        + Number(document.getElementById("article3_total").value)
        + Number(document.getElementById("article4_total").value)).toFixed(2);

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
    var table = document.getElementById("payments_table");

    index = table.rows.length - 1;
    var row = table.insertRow(index);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    var select = document.createElement('select');
    var input = document.createElement('input');
    input.disabled = true;
    input.id = "payment" + (index + 1) + "_value";
    input.onchange = function () { recalculateTotals(); };

    select.appendChild(document.createElement('option'));
    for (var i = 0; i < data.paymentTypeList.length; i++) {
        var opt = document.createElement('option');
        opt.innerText = data.paymentTypeList[i].Description;
        opt.value = data.paymentTypeList[i].Type;
        select.appendChild(opt);
    }
    select.onchange = function () { paymentType_onChange(select, index + 1, data) };
    select.isCashPayment = false;

    cell1.appendChild(select);
    cell2.appendChild(input);
    cell3.innerText = " Kč";
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
        document.getElementById("shop_street").value = shop.Street;
        document.getElementById("shop_city").value = shop.City;
        document.getElementById("shop_zip").value = shop.ZIP;
        document.getElementById("shop_IC").value = shop.PhoneNumber;
        document.getElementById("shop_DIC").value = shop.TST;
    }
    else {
        document.getElementById("shop_street").value = "";
        document.getElementById("shop_city").value = "";
        document.getElementById("shop_zip").value = "";
        document.getElementById("shop_IC").value = "";
        document.getElementById("shop_DIC").value = "";
    }
}

function article_onChange(value, number, data){
    var article = data.articleList.filter(function (obj) { return obj.UID == value; })[0];

    if (article != undefined) {
        document.getElementById("article" + number + "_description").disabled = false;
        document.getElementById("article" + number + "_quantity").disabled = false;
        document.getElementById("article" + number + "_price").disabled = false;

        document.getElementById("article" + number + "_description").value = article.Decription;
        document.getElementById("article" + number + "_quantity").value = "1.00";
        document.getElementById("article" + number + "_price").value = "0.00";
        document.getElementById("article" + number + "_vat").value = "21%"; //TODO
        document.getElementById("article" + number + "_total").value = "0.00";
    }
    else {
        document.getElementById("article" + number + "_description").disabled = true;
        document.getElementById("article" + number + "_quantity").disabled = true;
        document.getElementById("article" + number + "_price").disabled = true;

        document.getElementById("article" + number + "_description").value = "";
        document.getElementById("article" + number + "_quantity").value = "";
        document.getElementById("article" + number + "_price").value = "";
        document.getElementById("article" + number + "_vat").value = "";
        document.getElementById("article" + number + "_total").value = "";

        recalculateTotals();
    }
}

function paymentType_onChange(select, number, data) {
    var paymentType = data.paymentTypeList.filter(function (obj) { return obj.Type == select.value; })[0];
    var input = document.getElementById("payment" + number +"_value");

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