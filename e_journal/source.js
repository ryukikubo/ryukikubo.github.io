const STORAGE_KEY = "accountingData";

let data = {
    items: [
      {
          itemId: 1,
          name: "現金",
          type: "資産",
          balance: 100000
      },
      {
          itemId: 2,
          name: "普通預金",
          type: "資産",
          balance: 500000
      },
      {
          itemId: 3,
          name: "買掛金",
          type: "負債",
          balance: 20000
      },
      {
          itemId: 4,
          name: "資本金",
          type: "純資産",
          balance: 300000
      },
      {
          itemId: 5,
          name: "消耗品費",
          type: "費用",
          balance: 0
      },
      {
          itemId: 6,
          name: "売上高",
          type: "収益",
          balance: 0
      }
    ],
    journals: []
};

let pendingJournal = null;

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

    data.items.forEach(item => {

        html += `
        <tr>

            <td>${item.itemId}</td>

            <td>${item.name}</td>

            <td>${item.type}</td>

            <td>
                ${(item.balance || 0).toLocaleString()}
            </td>

            <td>

                <button
                    class="delete-item"
                    data-id="${item.itemId}">
                    削除
                </button>

            </td>

        </tr>
        `;
    });

    $("#itemTable").html(html);
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

                <label>
                    勘定科目
                </label>

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

            <button
                type="button"
                class="remove">

                削除

            </button>

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

        $(this)
            .closest(".line")
            .remove();
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
        
      updateBalances(
        debits,
        credits
      );

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

$(function () {

const today = new Date()
    .toISOString()
    .split("T")[0];

$("#journalDateFilter").val(today);

    loadStorage();

    renderItems();

    renderJournalList();
    
    setCurrentDateTime();

    createLine("#debits");

    createLine("#credits");
});