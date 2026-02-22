/* LOAD DATA */
let patients = JSON.parse(localStorage.getItem("patients")) || [];

/* NAVIGATION */
function showSection(id,el){
  document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".sidebar li").forEach(li=>li.classList.remove("active"));
  if(el) el.classList.add("active");
}

/* MODAL */
function openModal(){
  document.getElementById("modal").style.display="flex";
}
function closeModal(){
  document.getElementById("modal").style.display="none";
}

/* SAVE PATIENT */
function savePatient(){

  const patient = {
    name: document.getElementById("name").value.trim(),
    age: Number(document.getElementById("age").value),
    gender: document.getElementById("gender").value,
    specialization: document.getElementById("specialization").value,
    risk: document.getElementById("risk").value
  };

  if(!patient.name || !patient.age){
    alert("Please enter name and age");
    return;
  }

  patients.push(patient);

  localStorage.setItem("patients", JSON.stringify(patients));

  clearForm();
  renderAll();
  closeModal();
}

/* CLEAR FORM */
function clearForm(){
  document.getElementById("name").value="";
  document.getElementById("age").value="";
  document.getElementById("gender").value="";
  document.getElementById("specialization").value="";
  document.getElementById("risk").value="";
}

/* DELETE PATIENT */
function deletePatient(i){
  patients.splice(i,1);
  localStorage.setItem("patients", JSON.stringify(patients));
  renderAll();
}

function renderTable(searchText = ""){
  const table = document.getElementById("patientTable");
  if(!table) return;

  table.innerHTML = "";

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchText)
  );

  if(filteredPatients.length === 0){
    table.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:20px;">
          No matching patient found 🔍
        </td>
      </tr>`;
    return;
  }

  filteredPatients.forEach((p,i)=>{
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.specialization}</td>
        <td>${p.risk}</td>
        <td><button onclick="deletePatient(${i})">Delete</button></td>
      </tr>`;
  });
}
function renderStats(){
  if(!document.getElementById("totalPatients")) return;

  const total = patients.length;

  const normal = patients.filter(
    p => p.risk === "Normal / Low Risk"
  ).length;

  const high = patients.filter(
    p => 
      p.risk == "High Blood Pressure (Hypertension)" ||
     p.risk == "Heart Disease Risk" ||
      p.risk == "High Cholesterol"
  ).length;

  document.getElementById("totalPatients").innerText = total;
  document.getElementById("highRiskCount").innerText = high;
  document.getElementById("normalCount").innerText = normal;
}



function makeChart(id, type, obj, label, colors){
  const ctx = document.getElementById(id);
  if(!ctx) return;

  if(ctx.chart) ctx.chart.destroy();

  ctx.chart = new Chart(ctx, {
    type: type,
    data: {
      labels: Object.keys(obj),
      datasets: [{
        label: label,                 // legend title fix
        data: Object.values(obj),
        backgroundColor: colors,      // color indicators
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top"
        }
      }
    }
  });
}

function renderCharts(){
  const ageG={"0-18":0,"19-35":0,"36-60":0,"60+":0};
  const spec={}, riskC={}, genderC={};

  patients.forEach(p=>{
    if(p.age<=18) ageG["0-18"]++;
    else if(p.age<=35) ageG["19-35"]++;
    else if(p.age<=60) ageG["36-60"]++;
    else ageG["60+"]++;

    spec[p.specialization]=(spec[p.specialization]||0)+1;
    riskC[p.risk]=(riskC[p.risk]||0)+1;
    genderC[p.gender]=(genderC[p.gender]||0)+1;
  });

  makeChart(
    "ageChart",
    "bar",
    ageG,
    "Age Group",
    ["#2196F3","#91ea94","#d9af6f","#E91E63"]
  );

  makeChart(
    "specializationChart",
    "doughnut",
    spec,
    "Specializations",
    ["#00BCD4","#c3ef92","#f9d772","#e570fa","#FF5722"]
  );

  makeChart(
    "riskChart",
    "pie",
    riskC,
    "Risk Level",
    ["#84f7e4","#28a9fa","#F44336"]
  );

  makeChart(
    "genderChart",
    "bar",
    genderC,
    "Gender Distribution",
    ["#52b1ff","#f4457f","#9E9E9E"]
  );
}


function renderAll(){
  renderTable();
  renderStats();
  renderCharts();
}


renderAll();
const quotes = [
  "- Strong body, steady mind. 🌱",
  "- Care today creates comfort tomorrow.",
  "- Breathe. Reset. Recover 🌿",
  "- Drink at least 8 glasses of water daily 💧",
  "- Small health steps today = big results tomorrow",
  "- Regular checkups save lives ❤️",
  "- Sleep is the best medicine",
  "- Move your body every day 🚶‍♂️",
  "- A healthy heart is a happy heart ❤️",
  "- Prevention is better than cure",
  "- Take a deep breath. Your body loves oxygen 💙"
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("healthQuote").innerText = quotes[randomIndex];
}

showRandomQuote();
showRandomQuote();
setInterval(showRandomQuote, 10000);
function revealFooterOnScroll() {
  const footer = document.querySelector(".reveal-footer");
  if (!footer) return;

  const triggerPoint = window.innerHeight * 0.9;
  const footerTop = footer.getBoundingClientRect().top;

  if (footerTop < triggerPoint) {
    footer.classList.add("active");
  }
}

window.addEventListener("scroll", revealFooterOnScroll);
window.addEventListener("load", revealFooterOnScroll);
