/// <reference path="_Items.js" />
/// <reference path="_Common.js" />

function addPayment_onClick(data) {
    if (!containItems()) {
        alert("Doklad musí obsahovat alespoň jedno zboží!");
        document.forms["MainForm"]["Item1_GUID"].focus();
    }
    else if (!validateItems())
    { }
    else {
        disableItemInputs();
        var table = document.getElementById("payments_table").firstElementChild;

        index = table.rows.length;
        var row = table.insertRow(index);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        var select = document.createElement('select');
        select.id = "Payments_" + index + "__Type";
        select.name = "Payments[" + index + "].Type";
        select.className = "type";
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
        input.className = "value";
        input.onchange = function () { paymentValue_onChange(this); };
        input.onfocus = function () { input_onFocus(this); };

        var inputCode = document.createElement('input');
        inputCode.id = "Payments_" + index + "__Code";
        inputCode.name = "Payments[" + index + "].Code";
        inputCode.className = "code";
        inputCode.placeholder = "Kontrolní kód";
        inputCode.style.display = "none";

        var button = document.createElement('button');
        button.id = "Payments_" + index + "__Delete";
        button.className = "delete";
        button.onclick = function () { deletePayment_onClick(this); };

        cell1.appendChild(select);
        cell2.appendChild(input);
        cell3.appendChild(inputCode);
        cell4.appendChild(button);
    }
}

function deleteAllPayments_onClick() {
    var table = document.getElementById("payments_table").firstElementChild;
    while (table.firstElementChild) {
        table.removeChild(table.firstElementChild);
    }
    document.getElementById('addPaymentButton').style.display = null;
    enableItemInputs();
    recalculateTotals();
}

function deletePayment_onClick(obj) {
    var rowToDelete = obj.parentElement.parentElement;
    var payments = rowToDelete.parentElement.children;
    rowToDelete.parentElement.removeChild(rowToDelete);
    if (payments.length == 0) enableItemInputs();

    else {
        for (var i = 0; i < payments.length; i++) {
            var select = payments[i].getElementsByClassName('type')[0];
            select.id = "Payments_" + i + "__Type";
            select.name = "Payments[" + i + "].Type";

            var input = payments[i].getElementsByClassName('value')[0];
            input.id = "Payments_" + i + "__Value";
            input.name = "Payments[" + i + "].Value";

            var inputCode = payments[i].getElementsByClassName('code')[0];
            inputCode.id = "Payments_" + i + "__Code";
            inputCode.name = "Payments[" + i + "].Code";

            var button = payments[i].getElementsByClassName('delete')[0];
            button.id = "Payments_" + i + "__Delete";
        }

        unselectedCardPayment();
        recalculateTotals();
    }
}

function paymentType_onChange(select, data) {
    var number = select.id.substring(9, select.id.indexOf("__"));
    var paymentType = data.paymentTypeList.filter(function (obj) { return obj.Type == select.value; })[0];
    var input = document.getElementById("Payments_" + number + "__Value");

    if (select.value != "" && paymentType != undefined) {
        select.isCashPayment = paymentType.IsCashPayment;
        //TODO
        //select.isCardPayment = paymentType.IsCardPayment; 
        //if (select.isCardPayment) selectedCardPayment(number);
        if (select.value == "1") selectedCardPayment(number);
        else unselectedCardPayment();

        var value = document.getElementById("Payments_" + number + "__Value");
        value.value = "0.00";

        recalculateTotals();

        value.value = document.getElementById("total_to_paid").value;
        value.focus();
    }
    else {
        select.isCashPayment = false;
        unselectedCardPayment();
        document.getElementById("Payments_" + number + "__Value") = "";
    }
    recalculateTotals();
}

function paymentValue_onChange(field) {
    if (!isNaN(field.value)) {
        field.value = Number(field.value).toFixed(2);
        field.setCustomValidity("");

        recalculateTotals();
    }
    else {
        field.setCustomValidity("Vložte platné číslo!");
        field.focus();
    }
}

function selectedCardPayment(selectNumber) {
    var typeArray = document.getElementsByClassName('type');

    for (var i = 0; i < typeArray.length; i++) {
        var number = typeArray[i].id.substring(9, typeArray[i].id.indexOf("__"));

        if (selectNumber != number) {
            var type = typeArray[i];
            var value = document.getElementById("Payments_" + number + "__Value");
            var deleteBtn = document.getElementById("Payments_" + number + "__Delete");

            type.disabled = "true";
            value.disabled = "true";
              deleteBtn.style.display = "none";
        }
        else {
            var value = document.getElementById("Payments_" + number + "__Value");
            var code = document.getElementById("Payments_" + number + "__Code");

            value.disabled = "true";
            //value.value = document.getElementById("total_to_paid").value;
            code.style.display = null;
            code.required = "true";
        }
    }

    document.getElementById('addPaymentButton').style.display = "none";
}

function unselectedCardPayment() {
    var typeArray = document.getElementsByClassName('type');

    for (var i = 0; i < typeArray.length; i++) {
        var number = typeArray[i].id.substring(9, typeArray[i].id.indexOf("__"));

        var type = typeArray[i];
        var value = document.getElementById("Payments_" + number + "__Value");
        var deleteBtn = document.getElementById("Payments_" + number + "__Delete");
        var code = document.getElementById("Payments_" + number + "__Code");

        type.disabled = null;
        value.disabled = type.value != "" ? null : "true";
        deleteBtn.style.display = null;
        code.style.display = "none";
        code.required = null;
    }

    document.getElementById('addPaymentButton').style.display = null;
}