const list_wrapper = document.querySelector(".task-list-wrapper");
const display_wrapper = document.querySelector(".detailed-view-wrapper");
const form_wrapper = document.querySelector(".task-create-form-wrapper");

// 1.List Page Script 
let list_tbl_header = document.querySelector(".tbl-header-list");
let list_tbl_body = document.querySelector(".tbl-body-list");

const createtaskBtn = document.querySelector(".create-task-btn");

function getListAndPopulateToTable() {
    ZOHO.CRM.API.getAllRecords({Entity:"Tasks",sort_order:"asc",})
.then(function(listOfArr){
   console.log("Deepa");
   console.log(listOfArr.data);
   
   display_wrapper.style.display = "none";
   form_wrapper.style.display = "none";
   list_wrapper.style.display = "flex";
   list_tbl_body.innerHTML = "";
   list_tbl_header.innerHTML = "";

   let trForHeader = document.createElement("tr");
   list_tbl_header.appendChild(trForHeader);
   trForHeader.innerHTML=`<th>Due Date</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>RelatedTo</th>
                          <th>task Owner</th>`;
    (listOfArr.data).forEach(taskObj => {
        let trForBody = document.createElement("tr");
        list_tbl_body.appendChild(trForBody);
        trForBody.setAttribute("id", `${taskObj.id}`);
        let str=`<td class="dueDate">${taskObj.Due_Date}</td>
                 <td class="status">${taskObj.Status}</td>
                 <td class="priority">${taskObj.Priority}</td>
                 <td class="RelatedTo">${taskObj.RelatedTo}</td>
                 <td class="taskOwner">${taskObj.Owner.name}</td>`;
        trForBody.innerHTML=str;
        trForBody.addEventListener("click",(e)=>{
            displayTask(taskObj.id);
        });
        });
});
}

ZOHO.embeddedApp.on("PageLoad",function(listOfArr){
    display_wrapper.style.display = "none";
    form_wrapper.style.display = "none";
    list_wrapper.style.display = "flex";
	getListAndPopulateToTable(listOfArr);
});
createtaskBtn.addEventListener("click", (e)=>{
    display_wrapper.style.display = "none";
    list_wrapper.style.display = "none";
    form_wrapper.style.display = "flex";
    createTask(null);
});

// 2. Display Page Script
let display_tbl=document.querySelector(".display-tbl");
const updateBtn = document.querySelector(".update-task-btn");
const deleteBtn = document.querySelector(".delete-task-btn");
const backBtn = document.querySelector(".backBtn");

function deleteTask(taskId) {
    if(confirm("Are You Sure? delete task?")){
        ZOHO.CRM.API.deleteRecord({Entity:"Tasks",RecordID: `${taskId}`}).then(function(data){
            console.log(data);
            list_wrapper.style.display = "flex";
            form_wrapper.style.display = "none";
            display_wrapper.style.display = "none";
            getListAndPopulateToTable();
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
    if(taskId){
        ZOHO.CRM.API.getRecord({
            Entity: "Tasks", approved: "both", RecordID:`${taskId}`
           })
           .then(function(res){
               console.log(res);
               console.log((res.data)[0]);
               let obj = (res.data)[0];
               for (const key in obj) {
                    let tr = document.createElement("tr");
                    display_tbl.appendChild(tr);
                    tr.innerHTML = `<td>${key}</td>
                                    <td>${obj[key]}</td>`;
               }
           });
    }
    updateBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        updateTask(taskId);
    });
    deleteBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        deleteTask(taskId);
    });
}
backBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    list_wrapper.style.display = "flex";
    form_wrapper.style.display = "none";
    display_wrapper.style.display = "none";
    getListAndPopulateToTable();
});

// 3.Create And Edit Lead Data
function getDataAndSetToFields(id) {
    console.log("outside the get api-for edit! --Deepa");
    
   ZOHO.CRM.API.getRecord({
       Entity: "Tasks", approved: "both", RecordID:`${id}`
      })
      .then(function(tasksObj){
        console.log("To Update Task Data");
        console.log(tasksObj.data);
          let taskOwner = (document.querySelector("#taskOwner"));
          let option = taskOwner.querySelector(`option[value="${(tasksObj.data)[0].Owner.id}"]`);
          console.log(option);
          if(option){
            console.log(option);
            
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
}
function setLookUpToTaskOwner(userTag, contactTag, accountTag) {
    //users
    ZOHO.CRM.API.getAllUsers({Type:"AllUsers"})
.then(function(data){
    let options = `<option value="" disabled selected>Select user</option>`;
    (data.users).forEach(user => {
        options += `<option value="${(user.created_by).id}">${user["full_name"]}</option>`;
    });
    userTag.innerHTML = options; 
});
    //contacts
    ZOHO.CRM.API.getAllRecords({Entity:"Contacts",sort_order:"asc"})
.then(function(cotactResult){
   console.log("Contact Result");
   console.log(cotactResult);
   let options = `<option value="" disabled selected>Select a Contact</option>`;
    (cotactResult.data).forEach(contact => {
        options += `<option value="${(contact).id}">${contact["Full_Name"]}</option>`;
    });
    contactTag.innerHTML = options; 
});
    //accounts
    ZOHO.CRM.API.getAllRecords({Entity:"Accounts",sort_order:"asc"})
.then(function(accountResult){
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
    form_wrapper.style.display= "flex";

    let taskOwner = document.querySelector("#taskOwner");
    let contact = document.querySelector("#contacts");
    let account = document.querySelector("#accounts");
    setLookUpToTaskOwner(taskOwner, contact, account);

if(taskId){
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
        { id: "status", message : "status is required"}
    ];

    let isValid = true;

    fields.forEach(field => {
        const input = document.getElementById(field.id);
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
       let recordData = {
           "Owner":{
                "name": `${(document.querySelector("#taskOwner")).textContent}`,
                "id":`${document.querySelector("#taskOwner").value}`,
            },
            "Subject": `${(document.querySelector("#subject")).value}`,
            "Due_Date": `${(document.querySelector("#dueDate")).value}`,
            "Priority":`${(document.querySelector("#priority")).value}`,
            "Status":`${(document.querySelector("#status")).value}`
       }
       console.log(recordData);
       
       if(!taskId){
           ZOHO.CRM.API.insertRecord({Entity:"Tasks",APIData:recordData,Trigger:["workflow"]}).then(function(data){
               console.log(data);
               alert("Task Created/Inserted!");
               display_wrapper.style.display = "none";
               form_wrapper.style.display = "none";
               list_wrapper.style.display = "flex";
               getListAndPopulateToTable();
               this.reset();
           });
       }
       else{
        console.log("entered into ");
        recordData.id = taskId;
           var config = {
            Entity:"Tasks",
            APIData:{
                  "id": `${taskId}`,
                  "Owner":{
                    "name": `${(document.querySelector("#taskOwner")).value}`,
                    "id":`${document.querySelector("#taskOwner").id}`,
                  },
                   "Subject": `${(document.querySelector("#subject")).value}`,
                   "Due_Date": `${(document.querySelector("#dueDate")).value}`,
                   "Priority":`${(document.querySelector("#priority")).value}`,
                   "Status":`${(document.querySelector("#status")).value}`,
            },
            Trigger:["workflow"]
          }
           ZOHO.CRM.API.updateRecord(config)
.then(function(data){
    console.log(data);
    display_wrapper.style.display = "none";
    form_wrapper.style.display = "none";
    list_wrapper.style.display = "flex";
    this.reset();
	getListAndPopulateToTable();
})
       }
           
    }
});
}
ZOHO.embeddedApp.init();