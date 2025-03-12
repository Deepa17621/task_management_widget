const list_wrapper = document.querySelector(".task-list-wrapper");
const display_wrapper = document.querySelector(".detailed-view-wrapper");
const form_wrapper = document.querySelector(".task-create-form-wrapper");
const timeline_wrapper = document.querySelector(".timeline-wrapper");

// 1.List Page Script 
let list_tbl_header = document.querySelector(".tbl-header-list");
let list_tbl_body = document.querySelector(".tbl-body-list");

const createtaskBtn = document.querySelector(".create-task-btn");

function getListAndPopulateToTable() {
    ZOHO.CRM.API.getAllRecords({ Entity: "Tasks", sort_order: "asc", })
        .then(function (listOfArr) {
            display_wrapper.style.display = "none";
            form_wrapper.style.display = "none";
            list_wrapper.style.display = "flex";

            list_tbl_body.innerHTML = "";
            list_tbl_header.innerHTML = "";

            let trForHeader = document.createElement("tr");
            list_tbl_header.appendChild(trForHeader);
            trForHeader.innerHTML = `<th><div class="th-container"><span>Due Date</span> <span id="due-date-sort-bar"><i class="fa-solid fa-bars"></i></span></div>
                                        <ul class="lookup-menu">
                                            <li class="asc">asc <i class="fa-solid fa-arrow-up"></i></li>
                                            <li class="desc">desc <i class="fa-solid fa-arrow-down"></i></li>
                                            <li class="unsort">unsort</li>
                                        </ul>
                                     </th>
                                    <th><div class="th-container"><span>Status</span> <span id="status-sort-bar-string"><i class="fa-solid fa-bars"></i></span></div>
                                        <ul class="lookup-menu">
                                            <li class="asc">asc <i class="fa-solid fa-arrow-up"></i></li>
                                            <li class="desc">desc <i class="fa-solid fa-arrow-down"></i></li>
                                            <li class="unsort">unsort</li>
                                        </ul>      
                                    </th>
                                    <th><div class="th-container"><span>Priority</span> <span id="priority-sort-bar-string"><i class="fa-solid fa-bars"></i></span></div>
                                        <ul class="lookup-menu">
                                            <li class="asc">asc <i class="fa-solid fa-arrow-up"></i></li>
                                            <li class="desc">desc <i class="fa-solid fa-arrow-down"></i></li>
                                            <li class="unsort">unsort</li>
                                        </ul>
                                    </th>
                                    <th>RelatedTo</th>
                                    <th><div class="th-container"><span>task Owner</span> <span id="task-owner-sort-bar-string"><i class="fa-solid fa-bars"></i></span></div>
                                        <ul class="lookup-menu">
                                            <li class="asc">asc <i class="fa-solid fa-arrow-up"></i></li>
                                            <li class="desc">desc <i class="fa-solid fa-arrow-down"></i></li>
                                            <li class="unsort">unsort</li>
                                        </ul>
                                    </th>
                                    <th><div class="th-container"><span>Phone</span> <span id="phone-sort-bar-long"><i class="fa-solid fa-bars"></i></span></div>
                                        <ul class="lookup-menu">
                                            <li class="asc">asc 0-9<i class="fa-solid fa-arrow-up"></i></li>
                                            <li class="desc">desc 9-0<i class="fa-solid fa-arrow-down"></i></li>
                                            <li class="unsort">unsort</li>
                                        </ul>
                                    </th>
                          `;
            let phoneList = ["9876543210", "8765432190", "7654321890", "6543217890"];
            let n = 0;
            (listOfArr.data).forEach(taskObj => {
                if (n == 4) {
                    n = 0;
                }
                let trForBody = document.createElement("tr");
                list_tbl_body.appendChild(trForBody);
                trForBody.setAttribute("id", `${taskObj.id}`);
                let str = `<td class="dueDate">${taskObj.Due_Date ? taskObj.Due_Date : "-"}</td>
                 <td class="status" id="${taskObj.Status}">${taskObj.Status ? taskObj.Status : "-"}</td>
                 <td class="priority" id="${taskObj.Priority}">${taskObj.Priority ? taskObj.Priority : "-"}</td>
                 <td class="RelatedTo">${taskObj.RelatedTo ? taskObj.RelatedTo : "-"}</td>
                 <td class="taskOwner">${taskObj.Owner.name ? taskObj.Owner.name : "-"}</td>
                 <td class="phone">${phoneList[n++]}</td>
                 `;
                trForBody.innerHTML = str;
                trForBody.addEventListener("click", (e) => {
                    displayTask(taskObj.id);
                });
            });
            return;
        });
}

ZOHO.embeddedApp.on("PageLoad", function (listOfArr) {
    display_wrapper.style.display = "none";
    form_wrapper.style.display = "none";
    list_wrapper.style.display = "flex";
    getListAndPopulateToTable(listOfArr);
});
createtaskBtn.addEventListener("click", (e) => {
    display_wrapper.style.display = "none";
    list_wrapper.style.display = "none";
    form_wrapper.style.display = "flex";
    createTask(null);
});

// Event Listener For Sort DropDown - New Feature Need to Be Added - High Priority
list_tbl_header.addEventListener("click", (e) => {
    console.log(e.target);

    (e.target.closest("th").querySelector(".lookup-menu")).style.display = "flex";

    (document.querySelectorAll(".lookup-menu")).forEach(element => {
        if (element.style.display === "flex" && (element !== (e.target.closest("th").querySelector(".lookup-menu")))) {
            element.style.display = "none";
        }
    });

    let currentLookUp = e.target.closest("th").querySelector(".lookup-menu");
    let allTH = Array.from((list_tbl_header.querySelector("tr").children));
    currentLookUp.addEventListener("click", (event) => {
        let rows = Array.from(list_tbl_body.rows);
        let intialArr = rows;
        let order = allTH.indexOf(currentLookUp.closest("th"));

        rows.sort((rowA, rowB) => {
            let due_dateA = rowA.cells[order].innerText;
            let due_dateB = rowB.cells[order].innerText;
            if(order === 0){
                return (new Date(due_dateA)).getTime() - (new Date(due_dateB)).getTime();
            }
            else return due_dateA.localeCompare(due_dateB);
        });
        if (event.target.classList.contains("asc") || (event.target.classList.contains("fa-arrow-up"))) {
            rows.forEach(row => {
                list_tbl_body.appendChild(row);
            });
            event.stopPropagation();
        } else if (event.target.classList.contains("desc") || (event.target.classList.contains("fa-arrow-down"))) {
            for (let i = rows.length - 1; i >= 0; i--) { 
                list_tbl_body.appendChild(rows[i]);
            }
            event.stopPropagation();
        } else if (event.target.classList.contains("unsort")) {
            intialArr.forEach(element => {
                list_tbl_body.appendChild(element);
            });
            event.stopPropagation();
        }
        currentLookUp.style.display = "none";
    });
});

// Hide Lookup's When Lookup's are not focused
// document.addEventListener("click", function (event) {
//     console.log(event.target);

//     let lookups = document.querySelectorAll(".lookup-menu");
//     lookups.forEach(element => {
//         if(!element.contains(event.target)){
//             element.style.display = "none";
//         }
//     });
//     event.stopPropagation();
// });

// 2. Display Page Script
let display_tbl = document.querySelector(".display-tbl");
const updateBtn = document.querySelector(".update-task-btn");
const deleteBtn = document.querySelector(".delete-task-btn");
const backBtn = document.querySelector(".backBtn");

function deleteTask(taskId) {
    if (confirm("Are You Sure? delete task?")) {
        ZOHO.CRM.API.deleteRecord({ Entity: "Tasks", RecordID: `${taskId}` }).then(function (data) {
            console.log(data);
            list_wrapper.style.display = "flex";
            form_wrapper.style.display = "none";
            display_wrapper.style.display = "none";
            getListAndPopulateToTable();
            return;
        });
    }
}
function updateTask(taskId) {
    list_wrapper.style.display = "none";
    form_wrapper.style.display = "flex";
    display_wrapper.style.display = "none";
    createTask(taskId);
}

function displayTask(taskId) {
    list_wrapper.style.display = "none";
    form_wrapper.style.display = "none";
    display_wrapper.style.display = "flex";

    let primaryDetailContainer = document.querySelector(".primary-detail-container");
    let trackingContainer = document.querySelector(".tracking-container");
    let taskInfoContainer = document.querySelector(".task-information-container");
    if (taskId) {
        ZOHO.CRM.API.getRecord({
            Entity: "Tasks", approved: "both", RecordID: `${taskId}`
        })
            .then(function (res) {
                console.log((res.data)[0]);
                let obj = (res.data)[0];
                let trackingTable = trackingContainer.querySelector("table");
                let trackHtml = `<tr>
                                <td>Current Status</td>
                                <td>${obj.Status}</td>
                                </tr>
                                <tr>
                                <td>Transitions</td>
                                <td>${obj.transitions}</td>
                                </tr>` ;
                trackingTable.innerHTML = trackHtml;
                let primaryTable = primaryDetailContainer.querySelector("table");
                let primaryHtml = `<tr>
                                <td>Priority</td>
                                <td>${obj.Priority}</td>
                                </tr>
                                <tr>
                                <td>Due Date</td>
                                <td>${obj.Due_Date}</td>
                                </tr>
                                <tr>
                                <td>Status</td>
                                <td>${obj.Status}</td>
                                </tr>
                                <tr>
                                <td>Deal</td>
                                <td>${obj.deal}</td>
                                </tr>
                                <tr>
                                <td>Task Owner</td>
                                <td>${obj.Owner.name}</td>
                                </tr>`;
                primaryTable.innerHTML = primaryHtml;
                let taskInfoTable = taskInfoContainer.querySelector("table");
                let taskInfoTemplate = `<tr>
                                        <td>Task Owner -</td>
                                        <td>${obj.Owner.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Subject -</td>
                                        <td>${obj.Subject}</td>
                                    </tr>
                                    <tr>
                                        <td>Due Date -</td>
                                        <td>${obj.Due_Date}</td>
                                    </tr>
                                    <tr>
                                        <td>Contact Name -</td>
                                        <td>${""}</td>
                                    </tr>
                                    <tr>
                                        <td>Related To -</td>
                                        <td>${""}</td>
                                    </tr>
                                    <tr>
                                        <td>Status -</td>
                                        <td>${obj.Status}</td>
                                    </tr>
                                    <tr>
                                        <td>Priority -</td>
                                        <td>${obj.Priority}</td>
                                    </tr>
                                    <tr>
                                        <td>Created By -</td>
                                        <td>${obj.Created_By.name}</td>
                                        <td>${obj.Created_Time}</td>
                                    </tr>

                                    <tr>
                                        <td>Modified By -</td>
                                        <td>${obj.Modified_By.name}</td>
                                        <td>${obj.Modified_Time}</td>
                                    </tr>
                                    <tr>
                                        <td>Repeat -</td>
                                        <td>${""}</td>
                                    </tr>
                                    <tr>
                                        <td>Closed Time -</td>
                                        <td>${obj.Closed_Time}</td>
                                    </tr>
                                    <tr>
                                        <td>Reminder -</td>
                                        <td>${obj.Remind_At}</td>
                                    </tr>
                                    <tr>
                                        <td>Description -</td>
                                        <td>${obj.Description}</td>
                                    </tr>
                                    `
                taskInfoTable.innerHTML = taskInfoTemplate;
            });
    }
    updateBtn.addEventListener("click", (e) => {
        e.preventDefault();
        updateTask(taskId);
    });
    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        deleteTask(taskId);
    });
}

backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    list_wrapper.style.display = "flex";
    form_wrapper.style.display = "none";
    display_wrapper.style.display = "none";
    getListAndPopulateToTable();
});
function getTaskDetails(taskId) {
    ZOHO.CRM.API.getRecord({
        Entity: "Tasks", approved: "both", RecordID: `${taskId}`
    })
        .then(function (res) {
            console.log(res);
            console.log((res.data)[0]);
            let obj = (res.data)[0];
            return obj;
        });
}
// 3.Create And Edit Lead Data
function getDataAndSetToFields(id) {
    console.log("outside the get api-for edit! --Deepa");

    ZOHO.CRM.API.getRecord({
        Entity: "Tasks", approved: "both", RecordID: `${id}`
    })
        .then(function (tasksObj) {
            console.log("To Update Task Data");
            console.log(tasksObj.data);
            let taskOwner = (document.querySelector("#taskOwner"));
            let option = taskOwner.querySelector(`option[value="${(tasksObj.data)[0].Owner.id}"]`);
            console.log(option);
            if (option) {
                option.text = (tasksObj.data)[0].Owner.name;
                taskOwner.value = (tasksObj.data)[0].Owner.id;
            }
            let subject = (document.querySelector("#subject"));
            subject.value = (tasksObj.data)[0].Subject;
            let dueDate = (document.querySelector("#dueDate"));
            dueDate.value = (tasksObj.data)[0].Due_Date;
            //   let contact = document.querySelector("#cotacts");
            //   contact.value = (tasksObj.data)[0].Contact;
            //   let account = document.querySelector("#accounts");
            //   account.value = (tasksObj.data)[0].Account;
            let priority = document.querySelector("#priority");
            priority.value = (tasksObj.data)[0].Priority;
            let status = document.querySelector("#status");
            status.value = (tasksObj.data)[0].Status;
        });
    return;
}
function setLookUpToTaskOwner(userTag, contactTag, accountTag) {
    //users
    ZOHO.CRM.API.getAllUsers({ Type: "AllUsers" })
        .then(function (data) {
            console.log("Users");

            console.log(data);
            let options = `<option value="" disabled selected>Select user</option>`;
            (data.users).forEach(user => {
                options += `<option value="${(user).id}">${user["full_name"]}</option>`;
            });
            userTag.innerHTML = options;
            console.log(options);
        });
    //contacts
    ZOHO.CRM.API.getAllRecords({ Entity: "Contacts", sort_order: "asc" })
        .then(function (cotactResult) {
            let options = `<option value="" disabled selected>Select a Contact</option>`;
            (cotactResult.data).forEach(contact => {
                options += `<option value="${(contact).id}">${contact["Full_Name"]}</option>`;
            });
            contactTag.innerHTML = options;
        });
    //accounts
    ZOHO.CRM.API.getAllRecords({ Entity: "Accounts", sort_order: "asc" })
        .then(function (accountResult) {
            console.log(accountResult.data);
            let options = `<option value="" disabled selected>Select an Account</option>`;
            (accountResult.data).forEach(account => {
                options += `<option value="${(account).id}">${account["Account_Name"]}</option>`;
            });
            accountTag.innerHTML = options;
        });
}
function createTask(taskId) {
    list_wrapper.style.display = "none";
    display_wrapper.style.display = "none";
    form_wrapper.style.display = "flex";

    let taskOwner = document.querySelector("#taskOwner");
    let contact = document.querySelector("#contacts");
    let account = document.querySelector("#accounts");
    let backBtnForm = document.querySelector(".backBtn-form");
    backBtnForm.addEventListener("click", (e => {
        e.preventDefault();
        list_wrapper.style.display = "block";
        display_wrapper.style.display = "none";
        form_wrapper.style.display = "none";
        getListAndPopulateToTable();
    }))
    setLookUpToTaskOwner(taskOwner, contact, account);

    if (taskId) {
        getDataAndSetToFields(taskId);
    }

    function selectLeadOwner(name) {
        leadOwnerInput.value = name;
        lookupDropdown.style.display = "none";
    }
    // Form Validation
    document.getElementById("taskForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const fields = [
            { id: "taskOwner", message: "First Name is required" },
            { id: "subject", message: "Last Name is required" },
            // { id: "dueDate", message: "Enter a valid dueDate number", pattern: /^[0-9]{10}$/ },
            // { id: "email", message: "Enter a valid email", pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
            // { id: "contacts", message: "Contact is required" },
            // { id: "dueDate", message: "Due Date is required" },
            { id: "priority", message: "Priority" },
            { id: "status", message: "status is required" }
        ];

        let isValid = true;

        fields.forEach(field => {
            const errorSpan = input.nextElementSibling;
            if (!input.value.trim() || (field.pattern && !field.pattern.test(input.value))) {
                errorSpan.textContent = field.message;
                errorSpan.style.display = "block";
                isValid = false;
            } else {
                errorSpan.style.display = "none";
            }
        });
        if (isValid) {
            let ownerTaggg = (document.querySelector("#taskOwner"));
            let ownerId = ownerTaggg.value;
            let ownerName = ownerTaggg.options[ownerTaggg.selectedIndex].text;
            let recordData = {
                "Subject": `${(document.querySelector("#subject")).value}`,
                "Due_Date": `${(document.querySelector("#dueDate")).value}`,
                "Priority": `${(document.querySelector("#priority")).value}`,
                "Status": `${(document.querySelector("#status")).value}`,
                "Owner": {
                    "name": `${ownerName}`,
                    "id": `${ownerId}`,
                },
            }

            if (!taskId) {
                ZOHO.CRM.API.insertRecord({ Entity: "Tasks", APIData: recordData, Trigger: ["workflow"] }).then(function (data) {
                    display_wrapper.style.display = "none";
                    form_wrapper.style.display = "none";
                    list_wrapper.style.display = "flex";
                    getListAndPopulateToTable();
                    (document.querySelector("form")).reset();
                    return;
                });
            }
            else {
                recordData.id = taskId;
                let ownerTaggg = (document.querySelector("#taskOwner"));
                let ownerId = ownerTaggg.value;
                let ownerName = ownerTaggg.options[ownerTaggg.selectedIndex].text;
                var config = {
                    Entity: "Tasks",
                    APIData: {
                        "id": `${taskId}`,
                        "Subject": `${(document.querySelector("#subject")).value}`,
                        "Due_Date": `${(document.querySelector("#dueDate")).value}`,
                        "Priority": `${(document.querySelector("#priority")).value}`,
                        "Status": `${(document.querySelector("#status")).value}`,
                        "Owner": {
                            "name": `${ownerName}`,
                            "id": `${ownerId}`
                        },
                    },
                    Trigger: ["workflow"]
                }
                ZOHO.CRM.API.updateRecord(config)
                    .then(function (data) {
                        console.log(data);
                        display_wrapper.style.display = "none";
                        form_wrapper.style.display = "none";
                        list_wrapper.style.display = "flex";
                        (document.querySelector("form")).reset();
                        getListAndPopulateToTable();
                        return;
                    })
            }

        }
    });
}
// Filter Tasks By Status and Priority
let statusSelect = document.querySelector(".status");
let prioritySelect = document.querySelector(".priority");

statusSelect.addEventListener("change", (e) => {
    console.log(statusSelect.value);
    let allRows = list_tbl_body.querySelectorAll("tr");
    allRows.forEach(row => {
        let statusTd = row.querySelector(".status");
        let statusValueFromElementId = statusTd.id;
        console.log(statusValueFromElementId);
        row.style.display = statusSelect.value == "" ? "table-row" : (statusValueFromElementId === statusSelect.value) ? "table-row" : "none";
    });
    // ZOHO.CRM.API.searchRecord({ Entity: "Tasks", Type: "criteria", Query:`(Status:equals:${statusSelect.value})`, delay: false })
    //     .then(function (data) {
    //         console.log("Filter Records By Status- Status");
    //         console.log(data);
    //     });
})

prioritySelect.addEventListener("change", (e) => {
    console.log(prioritySelect.value);
    let allRows = list_tbl_body.querySelectorAll("tr");
    allRows.forEach(row => {
        let priorityTd = row.querySelector(".priority");
        let priorityValueFromElementId = priorityTd.id;
        console.log(priorityValueFromElementId);
        row.style.display = prioritySelect.value == "" ? "table-row" : (priorityValueFromElementId === prioritySelect.value) ? "table-row" : "none";
    });
    // ZOHO.CRM.API.searchRecord({ Entity: "Tasks", Type: "criteria", Query: `(Priority:equals:${prioritySelect.value})`, delay: false })
    //     .then(function (data) {
    //         console.log("Priority Filter - Filter Records By Priority");
    //         console.log(data);
    //     })
})

ZOHO.embeddedApp.init();

// Function to update UI with new task details
function updateTaskUI(task) {
    const taskElement = document.getElementById('timeline-wrapper');
    taskElement.innerHTML = `
        <h3>${task.Task_Name}</h3>
        <p>Status: ${task.Status}</p>
        <p>Due Date: ${task.Due_Date}</p>
    `;
}
export default { getTaskDetails };