document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // VARIABLES
    // ==========================================

    let wastedUnits = 0;
    let wastedMoney = 0;

    let savingTarget = 1000;

    // Initial wastage baseline
    let initialWastedMoney = 6;


    // ==========================================
    // TIME
    // ==========================================

    function updateTime() {

        const time = document.getElementById("currentTime");

        if (time) {
            time.textContent = new Date().toLocaleString();
        }
    }

    updateTime();
    setInterval(updateTime, 1000);


    // ==========================================
    // APPLIANCE POWER
    // ==========================================

    const power = {
        Fan: 0.075,
        Light: 0.040,
        AC: 1.200,
        TV: 0.100
    };


    // ==========================================
    // GET APPLIANCE CARD
    // ==========================================

    function getApplianceCard(name) {

        const cards =
            document.querySelectorAll(".appliance-card");

        for (const card of cards) {

            const title =
                card.querySelector("h3");

            if (
                title &&
                title.textContent.trim() === name
            ) {
                return card;
            }
        }

        return null;
    }


    // ==========================================
    // CHECK ON / OFF
    // ==========================================

    function isOn(name) {

        const card = getApplianceCard(name);

        if (!card) return false;

        const status =
            card.querySelector(".status-on, .status-off");

        return (
            status &&
            status.textContent.trim() === "ON"
        );
    }


    // ==========================================
    // APPLIANCE TOGGLE
    // ==========================================

    window.toggleAppliance = function (button) {

        const card =
            button.closest(".appliance-card");

        if (!card) return;

        const status =
            card.querySelector(".status-on, .status-off");

        const title =
            card.querySelector("h3");

        if (!status || !title) return;

        const currentlyOn =
            status.textContent.trim() === "ON";

        if (currentlyOn) {

            status.textContent = "OFF";

            status.classList.remove("status-on");
            status.classList.add("status-off");

            button.textContent = "Turn ON";

        } else {

            status.textContent = "ON";

            status.classList.remove("status-off");
            status.classList.add("status-on");

            button.textContent = "Turn OFF";
        }

        updateTable();
        updateWastage();
        updateCosts();
        updateCurrentUsage();
        updateGraph();
        updateAlert();
        updateWastageAlert();
        updateSavingProgress();
    };


    // ==========================================
    // TABLE UPDATE
    // ==========================================

    function updateTable() {

        const mapping = {
            Fan: "fanStatus",
            Light: "lightStatus",
            AC: "acStatus",
            TV: "tvStatus"
        };

        Object.keys(mapping).forEach(function (name) {

            const cell =
                document.getElementById(mapping[name]);

            if (!cell) return;

            cell.textContent =
                isOn(name) ? "ON" : "OFF";
        });
    }


    // ==========================================
    // CURRENT USAGE
    // ==========================================

    function updateCurrentUsage() {

        let currentPower = 0;

        if (isOn("Fan")) {
            currentPower += power.Fan;
        }

        if (isOn("Light")) {
            currentPower += power.Light;
        }

        if (isOn("AC")) {
            currentPower += power.AC;
        }

        if (isOn("TV")) {
            currentPower += power.TV;
        }

        const currentUsage =
            document.getElementById("currentUsage");

        if (currentUsage) {

            currentUsage.textContent =
                currentPower.toFixed(2) + " kW";
        }
    }


    // ==========================================
    // WASTAGE
    // ==========================================

    function updateWastage() {

        wastedUnits = 0;

        if (isOn("Fan")) {
            wastedUnits += 0.15;
        }

        if (isOn("Light")) {
            wastedUnits += 0.10;
        }

        if (isOn("AC")) {
            wastedUnits += 0.50;
        }

        if (isOn("TV")) {
            wastedUnits += 0.08;
        }

        wastedMoney =
            wastedUnits * 8;

        const wastedEnergy =
            document.getElementById("wastedEnergy");

        const moneyWasted =
            document.getElementById("moneyWasted");

        if (wastedEnergy) {

            wastedEnergy.textContent =
                wastedUnits.toFixed(2) + " kWh";
        }

        if (moneyWasted) {

            moneyWasted.textContent =
                "₹" + wastedMoney.toFixed(2);
        }
    }


    // ==========================================
    // COST
    // ==========================================

    function updateCosts() {

        const daily =
            document.getElementById("dailyCost");

        const monthly =
            document.getElementById("monthlyBill");

        const dailyValue =
            624 + wastedMoney;

        const monthlyValue =
            dailyValue * 30;

        if (daily) {

            daily.textContent =
                "₹" + dailyValue.toFixed(2);
        }

        if (monthly) {

            monthly.textContent =
                "₹" + monthlyValue.toFixed(2);
        }
    }


    // ==========================================
    // MONTHLY SAVING TARGET
    // ==========================================

    window.setSavingTarget = function () {

        const input =
            prompt(
                "Enter your monthly saving target in ₹:",
                savingTarget
            );

        if (input === null) {
            return;
        }

        const value =
            parseFloat(input);

        if (isNaN(value) || value <= 0) {

            alert(
                "Please enter a valid amount!"
            );

            return;
        }

        savingTarget = value;

        updateSavingTarget();

        updateSavingProgress();
    };


    // ==========================================
    // SHOW TARGET
    // ==========================================

    function updateSavingTarget() {

        const target =
            document.getElementById("savingTarget");

        if (target) {

            target.textContent =
                "₹" + savingTarget.toFixed(0);
        }
    }


    // ==========================================
    // SAVING PROGRESS
    // ==========================================

    function updateSavingProgress() {

        const target =
            savingTarget;

        if (target <= 0) return;

        // Money saved by reducing wastage
        let savedMoney =
            initialWastedMoney - wastedMoney;

        if (savedMoney < 0) {
            savedMoney = 0;
        }

        let percentage =
            (savedMoney / target) * 100;

        if (percentage > 100) {
            percentage = 100;
        }

        // Create progress area if needed
        const targetCard =
            document
                .getElementById("savingTarget")
                ?.closest(".summary-card");

        if (!targetCard) return;


        let progressLabel =
            targetCard.querySelector(".saving-progress-label");

        let progressBar =
            targetCard.querySelector(".saving-progress-bar");

        let progressText =
            targetCard.querySelector(".saving-progress-text");


        if (!progressLabel) {

            progressLabel =
                document.createElement("div");

            progressLabel.className =
                "saving-progress-label";

            progressLabel.style =
                "margin-top:15px;font-size:14px;color:#6b7280;";

            targetCard.appendChild(progressLabel);
        }


        if (!progressBar) {

            progressBar =
                document.createElement("div");

            progressBar.className =
                "saving-progress-bar";

            progressBar.style =
                "width:100%;height:10px;background:#e5e7eb;border-radius:10px;margin-top:8px;overflow:hidden;";

            const inner =
                document.createElement("div");

            inner.className =
                "saving-progress-inner";

            inner.style =
                "height:100%;width:0%;background:#16a34a;border-radius:10px;transition:width 0.4s ease;";

            progressBar.appendChild(inner);

            targetCard.appendChild(progressBar);
        }


        if (!progressText) {

            progressText =
                document.createElement("div");

            progressText.className =
                "saving-progress-text";

            progressText.style =
                "margin-top:8px;font-weight:bold;";

            targetCard.appendChild(progressText);
        }


        const inner =
            progressBar.querySelector(
                ".saving-progress-inner"
            );

        if (inner) {

            inner.style.width =
                percentage.toFixed(0) + "%";
        }


        progressLabel.textContent =
            "Saving Progress";

        progressText.textContent =
            percentage.toFixed(0) +
            "% Saved";
    }


    // ==========================================
    // GRAPH
    // ==========================================

    let chart;

    const canvas =
        document.getElementById("energyChart");

    if (
        canvas &&
        typeof Chart !== "undefined"
    ) {

        chart =
            new Chart(
                canvas.getContext("2d"),
                {

                    type: "line",

                    data: {

                        labels: [
                            "10 AM",
                            "11 AM",
                            "12 PM",
                            "1 PM",
                            "2 PM",
                            "3 PM"
                        ],

                        datasets: [{

                            label:
                                "Energy Consumption (kWh)",

                            data: [
                                2.4,
                                3.1,
                                2.8,
                                4.2,
                                3.6,
                                4.8
                            ],

                            borderWidth: 3,

                            tension: 0.4,

                            fill: false
                        }]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            );
    }


    // ==========================================
    // UPDATE GRAPH
    // ==========================================

    function updateGraph() {

        if (!chart) return;

        let currentPower = 0;

        if (isOn("Fan")) {
            currentPower += power.Fan;
        }

        if (isOn("Light")) {
            currentPower += power.Light;
        }

        if (isOn("AC")) {
            currentPower += power.AC;
        }

        if (isOn("TV")) {
            currentPower += power.TV;
        }

        const lastIndex =
            chart.data.datasets[0].data.length - 1;

        chart.data.datasets[0].data[lastIndex] =
            currentPower;

        chart.update();
    }


    // ==========================================
    // ROOM MONITORING
    // ==========================================

    window.toggleRoom102 = function () {

        const room =
            document.getElementById(
                "room102-occupancy"
            );

        const status =
            document.getElementById(
                "room102-status"
            );

        if (!room) return;

        if (
            room.textContent.trim() ===
            "Occupied"
        ) {

            room.textContent =
                "Empty";

            if (status) {

                status.textContent =
                    "⚠️ Monitoring";
            }

        } else {

            room.textContent =
                "Occupied";

            if (status) {

                status.textContent =
                    "✅ Normal";
            }
        }

        updateAlert();
        updateWastageAlert();
    };


    // ==========================================
    // ALERT
    // ==========================================

    function updateAlert() {

        const room =
            document.getElementById(
                "room102-occupancy"
            );

        const count =
            document.getElementById(
                "alertCount"
            );

        const message =
            document.getElementById(
                "alertMessage"
            );

        if (!room) return;

        const empty =
            room.textContent.trim() ===
            "Empty";

        const applianceOn =
            isOn("Fan") ||
            isOn("Light") ||
            isOn("AC") ||
            isOn("TV");

        if (empty && applianceOn) {

            if (count) {
                count.textContent = "1";
            }

            if (message) {

                message.textContent =
                    "⚠️ Room 102 is empty but appliances are ON. Electricity wastage detected!";
            }

            addAlertHistory(
                "Room 102 empty but appliances ON",
                "Active"
            );

        } else {

            if (count) {
                count.textContent = "0";
            }

            if (message) {

                message.textContent =
                    "✅ No active alerts. Electricity usage is normal.";
            }
        }
    }


    // ==========================================
    // WASTAGE ALERT
    // ==========================================

    function updateWastageAlert() {

        const alert =
            document.getElementById(
                "wastageAlert"
            );

        const room =
            document.getElementById(
                "room102-occupancy"
            );

        if (!alert || !room) return;

        const applianceOn =
            isOn("Fan") ||
            isOn("Light") ||
            isOn("AC") ||
            isOn("TV");

        if (
            room.textContent.trim() ===
            "Empty" &&
            applianceOn
        ) {

            alert.textContent =
                "⚠️ Room 102 is empty but appliances are running. Wastage detected!";

        } else {

            alert.textContent =
                "✅ Room 102 is occupied. No wastage detected.";
        }
    }


    // ==========================================
    // ALERT HISTORY
    // ==========================================

    const alertHistory = [];

    function addAlertHistory(message, status) {

        const table =
            document.getElementById(
                "alertHistoryBody"
            );

        if (!table) return;

        const time =
            new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        alertHistory.unshift({

            time: time,
            message: message,
            status: status
        });

        if (alertHistory.length > 10) {
            alertHistory.pop();
        }

        table.innerHTML = "";

        alertHistory.forEach(function (item) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${item.time}</td>
                <td>${item.message}</td>
                <td>${item.status}</td>
            `;

            table.appendChild(row);
        });
    }


    // ==========================================
    // DOWNLOAD REPORT
    // ==========================================

    const downloadButton =
        document.getElementById(
            "downloadReportBtn"
        );

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            function () {

                const room =
                    document.getElementById(
                        "room102-occupancy"
                    );

                const currentUsage =
                    document.getElementById(
                        "currentUsage"
                    );

                const wastedEnergy =
                    document.getElementById(
                        "wastedEnergy"
                    );

                const moneyWasted =
                    document.getElementById(
                        "moneyWasted"
                    );

                const dailyCost =
                    document.getElementById(
                        "dailyCost"
                    );

                const monthlyBill =
                    document.getElementById(
                        "monthlyBill"
                    );

                const report = `

========================================
       POWERGUARD ELECTRICITY REPORT
========================================

Generated On:
${new Date().toLocaleString()}

----------------------------------------
ENERGY DETAILS
----------------------------------------

Current Usage:
${currentUsage ? currentUsage.textContent : "N/A"}

Wasted Energy:
${wastedEnergy ? wastedEnergy.textContent : "N/A"}

Money Wasted:
${moneyWasted ? moneyWasted.textContent : "N/A"}

Daily Estimated Cost:
${dailyCost ? dailyCost.textContent : "N/A"}

Monthly Estimated Bill:
${monthlyBill ? monthlyBill.textContent : "N/A"}

Monthly Saving Target:
₹${savingTarget.toFixed(0)}

----------------------------------------
ROOM STATUS
----------------------------------------

Room 102:
${room ? room.textContent.trim() : "Unknown"}

----------------------------------------
APPLIANCE STATUS
----------------------------------------

Fan:
${isOn("Fan") ? "ON" : "OFF"}

Light:
${isOn("Light") ? "ON" : "OFF"}

AC:
${isOn("AC") ? "ON" : "OFF"}

TV:
${isOn("TV") ? "ON" : "OFF"}

========================================
     SMART ELECTRICITY MONITORING
========================================
`;

                const blob =
                    new Blob(
                        [report],
                        {
                            type:
                                "text/plain;charset=utf-8"
                        }
                    );

                const downloadURL =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href =
                    downloadURL;

                link.download =
                    "PowerGuard_Electricity_Report.txt";

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);

                setTimeout(function () {

                    URL.revokeObjectURL(
                        downloadURL
                    );

                }, 1000);
            }
        );
    }


    // ==========================================
    // INITIAL UPDATE
    // ==========================================

    updateTable();

    updateWastage();

    updateCosts();

    updateCurrentUsage();

    updateAlert();

    updateWastageAlert();

    updateSavingTarget();

    updateSavingProgress();

    updateGraph();

});