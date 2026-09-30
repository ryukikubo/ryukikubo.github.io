const STORAGE_KEY = "accountingData";

let data = {
    items: [],
    journals: []
};

let pendingJournal = null;
const selectedItemTypes = new Set([
    "資産",
    "負債",
    "純資産",
    "費用",
    "収益"
]);
let itemSort = {
    key: "itemId",
    direction: "asc"
};

function saveStorage() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}

function loadStorage() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (saved) {
        data = JSON.parse(saved);
    }
}

function renderItems() {

    let html = "";
    const sortedItems = data.items
        .filter(item => selectedItemTypes.has(item.type))
        .sort((left, right) => {
        const comparison = itemSort.key === "itemId"
            ? left.itemId - right.itemId
            : left.type.localeCompare(right.type, "ja");

        return itemSort.direction === "asc"
            ? comparison
            : -comparison;
    });

    if (sortedItems.length === 0) {
        html = `
            <tr>
                <td class="item-empty-state" colspan="5">
                    該当する勘定科目がありません
                </td>
            </tr>
        `;
    }

    sortedItems.forEach(item => {

        html += `
        <tr>

            <td><span class="item-id">${item.itemId}</span></td>

            <td>${item.name}</td>

            <td>
                <span class="item-type" data-type="${item.type}">
                    ${item.type}
                </span>
            </td>

            <td>
                <span class="item-balance">
                    ${(item.balance || 0).toLocaleString()}
                </span>
            </td>

            <td>

                <button
                    class="delete-item"
                    type="button"
                    data-id="${item.itemId}">
                    <span aria-hidden="true">×</span>
                    <span class="visually-hidden">${item.name}を削除</span>
                </button>

            </td>

        </tr>
        `;
    });

    $("#itemTable").html(html);
    renderDailyItemOptions();

    $(".item-filter-button").each(function () {
        const active = selectedItemTypes.has(
            $(this).attr("data-filter-type")
        );
        $(this).attr("aria-pressed", active);
    });

    $(".item-sort-button").each(function () {
        const key = $(this).data("sortKey");
        const active = key === itemSort.key;
        const label = key === "itemId" ? "ID" : "区分";
        const nextDirection = active && itemSort.direction === "asc"
            ? "降順"
            : "昇順";

        $(this)
            .attr("aria-label", `${label}を${nextDirection}で並べ替え`)
            .find(".sort-indicator")
            .text(active
                ? itemSort.direction === "asc" ? "↑" : "↓"
                : "↕");

        $(this).closest("th").attr(
            "aria-sort",
            active
                ? itemSort.direction === "asc" ? "ascending" : "descending"
                : "none"
        );
    });
}

function renderDailyItemOptions() {

    const selectedItemId = $("#dailyItemFilter").val();
    let html = '<option value="">勘定科目を選択</option>';

    data.items.forEach(item => {
        html += `<option value="${item.itemId}">${item.name}</option>`;
    });

    $("#dailyItemFilter").html(html);

    if (data.items.some(item => String(item.itemId) === selectedItemId)) {
        $("#dailyItemFilter").val(selectedItemId);
    }

    renderDailyChanges();
}

function renderDailyChanges() {

    const selectedMonth = $("#dailyMonthFilter").val();
    const selectedItemId = Number($("#dailyItemFilter").val());
    const item = data.items.find(entry => entry.itemId === selectedItemId);

    if (!selectedMonth || !item) {
        $("#dailyChangeSummary").empty();
        $("#dailyChangeTable").html(`
            <div class="no-data">
                月と勘定科目を選択してください
            </div>
        `);
        return;
    }

    const dailyTotals = new Map();
    const debitIncreasesBalance = ["資産", "費用"].includes(item.type);

    data.journals.forEach(journal => {
        const eventDateTime = journal.eventDateTime || "";

        if (!eventDateTime.startsWith(selectedMonth)) {
            return;
        }

        const date = eventDateTime.slice(0, 10);

        const addEntries = (entries, isDebit) => {
            (entries || []).forEach(entry => {
                if (Number(entry.itemId) !== selectedItemId) {
                    return;
                }

                const totals = dailyTotals.get(date) || {
                    increase: 0,
                    decrease: 0
                };
                const increases = isDebit === debitIncreasesBalance;
                totals[increases ? "increase" : "decrease"] += Number(entry.amount);
                dailyTotals.set(date, totals);
            });
        };

        addEntries(journal.debits, true);
        addEntries(journal.credits, false);
    });

    const dailyRows = [...dailyTotals.entries()]
        .sort(([left], [right]) => left.localeCompare(right));
    const totalIncrease = dailyRows.reduce((sum, [, totals]) => sum + totals.increase, 0);
    const totalDecrease = dailyRows.reduce((sum, [, totals]) => sum + totals.decrease, 0);
    const netChange = totalIncrease - totalDecrease;
    const formatAmount = amount => amount.toLocaleString("ja-JP");
    const formatNet = amount => amount > 0
        ? `+${formatAmount(amount)}`
        : formatAmount(amount);

    $("#dailyChangeSummary").html(`
        <dl class="daily-summary-item">
            <dt>月間増加</dt>
            <dd class="amount-increase">${formatAmount(totalIncrease)}</dd>
        </dl>
        <dl class="daily-summary-item">
            <dt>月間減少</dt>
            <dd class="amount-decrease">${formatAmount(totalDecrease)}</dd>
        </dl>
        <dl class="daily-summary-item">
            <dt>月間差引</dt>
            <dd class="${netChange >= 0 ? "amount-increase" : "amount-decrease"}">
                ${formatNet(netChange)}
            </dd>
        </dl>
    `);

    if (dailyRows.length === 0) {
        $("#dailyChangeTable").html(`
            <div class="no-data">
                この月の仕訳データはありません
            </div>
        `);
        return;
    }

    let rowsHtml = "";

    dailyRows.forEach(([date, totals]) => {
        const day = Number(date.slice(8, 10));
        const net = totals.increase - totals.decrease;

        rowsHtml += `
            <tr>
                <th scope="row">${day}日</th>
                <td class="amount-increase">${formatAmount(totals.increase)}</td>
                <td class="amount-decrease">${formatAmount(totals.decrease)}</td>
                <td class="${net >= 0 ? "amount-increase" : "amount-decrease"}">
                    ${formatNet(net)}
                </td>
            </tr>
        `;
    });

    $("#dailyChangeTable").html(`
        <div class="daily-change-table-wrap">
            <table class="daily-change-table">
                <thead>
                    <tr>
                        <th scope="col">日付</th>
                        <th scope="col">増加</th>
                        <th scope="col">減少</th>
                        <th scope="col">差引</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `);
}

function createLine(container) {

    let options = "";

    data.items.forEach(item => {

        options += `
            <option value="${item.itemId}">
                ${item.name}
            </option>
        `;
    });

    const title =
        container === "#debits"
        ? "借方"
        : "貸方";

    $(container).append(`

        <div class="journal-card line">

            <div class="field">

                <div class="field-heading">
                    <label>勘定科目</label>
                    <button
                        type="button"
                        class="remove"
                        aria-label="仕訳行を削除"
                        title="仕訳行を削除">
                        ×
                    </button>
                </div>

                <select class="item">
                    ${options}
                </select>

            </div>

            <div class="field">

                <label>
                    金額
                </label>

                <input
                    type="number"
                    class="amount"
                    placeholder="金額">

            </div>

        </div>

    `);
}

function refreshJournalSelects() {

    $("#debits").empty();
    $("#credits").empty();

    createLine("#debits");
    createLine("#credits");
}

function collectRows(selector) {

    const result = [];

    $(`${selector} .line`).each(function () {

        const amount = Number(
            $(this)
                .find(".amount")
                .val()
        );

        if (amount <= 0) {
            return;
        }

        result.push({
            itemId: Number(
                $(this)
                    .find(".item")
                    .val()
            ),
            amount: amount
        });

    });

    return result;
}

function findItemName(itemId) {

    const item =
        data.items.find(
            x => x.itemId === itemId
        );

    return item
        ? item.name
        : "";
}

function renderJournalList() {

    const selectedDate =
        $("#journalDateFilter").val();

    let journals = [...data.journals];

    if (selectedDate) {

        journals = journals.filter(j => {

            const d = new Date(j.eventDateTime);

            const key =
                d.getFullYear() + "-" +
                String(d.getMonth() + 1).padStart(2, "0") + "-" +
                String(d.getDate()).padStart(2, "0");

            return key === selectedDate;
        });
    }

    journals.sort(
        (a,b) =>
            new Date(a.date) -
            new Date(b.date)
    );

    let html = "";

    journals.forEach(journal => {

        const debitTotal =
            journal.debits.reduce(
                (s,x)=>s+x.amount,
                0
            );

        const creditTotal =
            journal.credits.reduce(
                (s,x)=>s+x.amount,
                0
            );

        const rows =
            Math.max(
                journal.debits.length,
                journal.credits.length
            );

        let lineHtml = "";

        for(let i=0;i<rows;i++){

            const debit =
                journal.debits[i];

            const credit =
                journal.credits[i];

            const debitText =
                debit
                    ? `${findItemName(debit.itemId)} ${debit.amount.toLocaleString()}`
                    : "";

            const creditText =
                credit
                    ? `${findItemName(credit.itemId)} ${credit.amount.toLocaleString()}`
                    : "";

            lineHtml += `
                <div class="journal-row">

                    <div class="journal-left">
                        ${debitText}
                    </div>

                    <div class="journal-right">
                        ${creditText}
                    </div>

                </div>
            `;
        }

        const timeText =
            new Date(journal.eventDateTime)
            .toLocaleTimeString(
                "ja-JP",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        html += `
        <div class="journal-entry">

            <div class="journal-time">
                ${timeText}
            </div>

            <div class="journal-memo">
                ${journal.memo || ""}
            </div>

            <div class="journal-lines">

                ${lineHtml}

            </div>

            <div class="journal-total">

                <div>
                    ${debitTotal.toLocaleString()}
                </div>

                <div>
                    ${creditTotal.toLocaleString()}
                </div>

            </div>

            <div class="journal-separator">
            </div>

        </div>
        `;
    });

    if(html === ""){

        html = `
            <div class="no-data">
                該当データなし
            </div>
        `;
    }

    $("#journalTable").html(html);
}

function clearJournalForm() {

    $("#memo").val("");

    refreshJournalSelects();

    setCurrentDateTime();

}

/* タブ切替 */

$(document).on(
    "click",
    ".tab-button",
    function () {

        $(".tab-button")
            .removeClass("active");

        $(".tab-content")
            .removeClass("active");

        $(this)
            .addClass("active");

        $("#" + $(this).data("target"))
            .addClass("active");
    }
);

$(document).on(
    "click",
    ".item-sort-button",
    function () {
        const key = $(this).data("sortKey");

        if (itemSort.key === key) {
            itemSort.direction = itemSort.direction === "asc"
                ? "desc"
                : "asc";
        } else {
            itemSort = {
                key: key,
                direction: "asc"
            };
        }

        renderItems();
    }
);

$(document).on(
    "click",
    ".item-filter-button",
    function () {
        const type = $(this).attr("data-filter-type");

        if (selectedItemTypes.has(type)) {
            selectedItemTypes.delete(type);
        } else {
            selectedItemTypes.add(type);
        }

        renderItems();
    }
);

/* 借方追加 */

$("#addDebit").on(
    "click",
    function () {

        createLine("#debits");
    }
);

/* 貸方追加 */

$("#addCredit").on(
    "click",
    function () {

        createLine("#credits");
    }
);

/* 行削除 */

$(document).on(
    "click",
    ".remove",
    function () {

        const line = $(this).closest(".line");

        if (line.hasClass("is-removing")) {
            return;
        }

        line
            .addClass("is-removing")
            .one("animationend", function () {
                $(this).remove();
            });
    }
);

/* 勘定科目追加 */

$("#addItem").on(
    "click",
    function () {

        const name =
            $("#newItemName")
                .val()
                .trim();

        const type =
            $("#newItemType")
                .val();

        if (!name) {

            alert(
                "勘定科目名を入力してください"
            );

            return;
        }

        const maxId =
            data.items.reduce(
                (max, item) =>
                    Math.max(
                        max,
                        item.itemId
                    ),
                0
            );

        data.items.push({

            itemId: maxId + 1,

            name: name,

            type: type,

            balance: 0
        });

        saveStorage();

        renderItems();

        refreshJournalSelects();

        $("#newItemName").val("");

        alert(
            "勘定科目を追加しました"
        );

    }
);

/* 勘定科目削除 */

$(document).on(
    "click",
    ".delete-item",
    function () {

        const itemId =
            Number(
                $(this).data("id")
            );

        if (
            !confirm(
                "削除しますか？"
            )
        ) {
            return;
        }

        data.items =
            data.items.filter(
                item =>
                    item.itemId !== itemId
            );

        saveStorage();

        renderItems();

        refreshJournalSelects();
    }
);

/* 仕訳保存 */

$("#saveJournal").on(
    "click",
    function () {

        const debits =
            collectRows(
                "#debits"
            );

        const credits =
            collectRows(
                "#credits"
            );

        if (!debits.length || !credits.length) {

            alert(
                "借方・貸方それぞれに金額を入力してください"
            );

            return;
        }

        const debitTotal =
            debits.reduce(
                (s, x) =>
                    s + x.amount,
                0
            );

        const creditTotal =
            credits.reduce(
                (s, x) =>
                    s + x.amount,
                0
            );

        if (
            debitTotal !== creditTotal
        ) {

            alert(
                "借方・貸方が一致していません"
            );

            return;
        }

      pendingJournal = {

          memo:
              $("#memo").val(),

          debits:
              debits,

          credits:
              credits
      };

      buildConfirmModal(
          debits,
          credits,
          pendingJournal.memo
      );

    }
);

$("#confirmOk").on(
    "click",
    function(){

        const journal = {

            journalId:
                Date.now(),

            eventDateTime:
                $("#journalDatetime").val(),
            
          registerDateTime:
                new Date().toISOString(),

            memo:
                pendingJournal.memo,

            debits:
                pendingJournal.debits,

            credits:
                pendingJournal.credits
        };

        updateBalances(
            journal.debits,
            journal.credits
        );

        data.journals.push(
            journal
        );

        saveStorage();

        renderItems();

        renderJournalList();

        clearJournalForm();

        pendingJournal = null;

        $("#confirmModal")
            .hide();

        alert(
            "保存しました"
        );
    }
);

$("#confirmCancel").on(
    "click",
    function(){

        pendingJournal = null;

        $("#confirmModal")
            .hide();
    }
);

$("#resetStorageButton").on(
    "click",
    function(){

        const result = confirm(
            "LocalStorageを全て削除します。よろしいですか？"
        );

        if(!result){
            return;
        }

        localStorage.clear();

        alert(
            "LocalStorageを削除しました。画面を再読み込みします。"
        );

        location.reload();
    }
);

function findItem(itemId) {

    return data.items.find(
        item => item.itemId === itemId
    );
}

function updateBalances(debits, credits) {

    // 借方処理
    debits.forEach(entry => {

        const item =
            findItem(entry.itemId);

        if (!item) {
            return;
        }

        switch (item.type) {

            case "資産":
            case "費用":
                item.balance += entry.amount;
                break;

            case "負債":
            case "純資産":
            case "収益":
                item.balance -= entry.amount;
                break;
        }
    });

    // 貸方処理
    credits.forEach(entry => {

        const item =
            findItem(entry.itemId);

        if (!item) {
            return;
        }

        switch (item.type) {

            case "資産":
            case "費用":
                item.balance -= entry.amount;
                break;

            case "負債":
            case "純資産":
            case "収益":
                item.balance += entry.amount;
                break;
        }
    });
}

$("#journalDateFilter").on(
    "change",
    function () {

        renderJournalList();
    }
);

$("#dailyMonthFilter, #dailyItemFilter").on(
    "change",
    function () {
        renderDailyChanges();
    }
);

function buildConfirmModal(
    debits,
    credits,
    memo
){

    let debitHtml = "";

    debits.forEach(row => {

        debitHtml += `
            <tr>
                <td>
                    ${findItemName(
                        row.itemId
                    )}
                </td>

                <td>
                    ${row.amount
                        .toLocaleString()}
                </td>
            </tr>
        `;
    });

    let creditHtml = "";

    credits.forEach(row => {

        creditHtml += `
            <tr>
                <td>
                    ${findItemName(
                        row.itemId
                    )}
                </td>

                <td>
                    ${row.amount
                        .toLocaleString()}
                </td>
            </tr>
        `;
    });

    $("#confirmBody").html(`

        <p>
            メモ：
            ${memo || "(未入力)"}
        </p>

        <h3>借方</h3>

        <table class="confirm-table">

            ${debitHtml}

        </table>

        <h3>貸方</h3>

        <table class="confirm-table">

            ${creditHtml}

        </table>

    `);

    $("#confirmModal").css(
        "display",
        "flex"
    );
}

function setCurrentDateTime() {

    const now = new Date();

    const yyyy = now.getFullYear();

    const mm =
        String(now.getMonth() + 1)
            .padStart(2,"0");

    const dd =
        String(now.getDate())
            .padStart(2,"0");

    const hh =
        String(now.getHours())
            .padStart(2,"0");

    const mi =
        String(now.getMinutes())
            .padStart(2,"0");

    $("#journalDatetime").val(
        `${yyyy}-${mm}-${dd}T${hh}:${mi}`
    );
}

function setCurrentMonth() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    $("#dailyMonthFilter").val(`${now.getFullYear()}-${month}`);
}

$(function () {

const today = new Date()
    .toISOString()
    .split("T")[0];

$("#journalDateFilter").val(today);

    loadStorage();
    setCurrentMonth();

    renderItems();

    renderJournalList();
    
    setCurrentDateTime();

    createLine("#debits");

    createLine("#credits");
});