let today_date = new Date(Date.now());
let next_week = new Date(today_date);
next_week.setDate(next_week.getDate() + 7)
let weekDetails = document.getElementById("nweek_details");
let container = document.getElementById("nextWeekContainer");
let nextWeekContainer = document.getElementById("nextWeekGoalsUl");
let header = document.getElementById("nweek_header")
let weeks = [];
let past_weeks = [];
let constantGoals = [];

let goals = [];
let nextWeekGoals = [];
let nav_radios = document.querySelectorAll("nav input");
let sections = document.querySelectorAll("main > section");
let ninput = document.getElementById("nextWeekInput");
let cinput = document.getElementById("constantGoalsInput");
let ccinput = document.getElementById("currentWeekInput");
let days_tracker_days = document.querySelectorAll("#days_tracker li");
let nbutton = document.getElementById("nextWeekSubmit");
let ccbutton = document.getElementById("currentWeekGoalsSubmit");
let cbutton = document.getElementById("constantGoalsSubmit");
let historyContainer = document.getElementById("history_container");
let currentWeekContainer = document.getElementById("goals_container");

updatePastWeeks();




function init(){
  if(localStorage.getItem("AllWeeklyGoals")){
    goals=JSON.parse(localStorage.getItem("AllWeeklyGoals"))
    weeks=JSON.parse(localStorage.getItem("AllWeeklyGoalsWeek"))
    if(localStorage.getItem("ConstantGoals")){
      constantGoals = JSON.parse(localStorage.getItem("ConstantGoals"))
    }
    updatePastWeeks()
  }
  renderDaysTracker()
  renderHistory()
  renderStats()
  renderCurrentWeek()
  renderNextWeek()
}


nav_radios.forEach((radio, ind)=>{
  radio.onclick = ()=>{
    sections.forEach((section)=>{
      section.className = "page " + (section.id===radio.id?"active":"inactive")

      
    })
    if(ind != 1){
      document.querySelectorAll("#history .container").forEach((container)=>{
        if(container.classList.contains("expanded")){
          container.querySelector(".week-header").click()
        }
      })
    }
  }
})

function renderProgressbar() {
let checks = document.querySelectorAll("#goals_container input")
let filtered = Math.floor(Array.from(checks).filter((inp)=>{return inp.checked}).length *100/checks.length)

document.querySelector(".progress span").style.width = `${filtered}%`
document.querySelector(".progress p").innerHTML= `${filtered}%`
}

function renderDaysTracker(){

  document.getElementById("todays_date_indicator").innerHTML = today_date.toDateString();

  days_tracker_days.forEach((li, index)=>{

    li.className = index < today_date.getDay()? "past": index == today_date.getDay()? "present":null
  })

}

// STATIC SCRIPTS // 
let date = new Date("4-25-2026")




function getWeekStartAndEnd(date_string){
  let firstDay = new Date(`${date_string.toLocaleDateString()}`)
  firstDay.setDate(firstDay.getDate() - firstDay.getDay())
  firstDay.setHours(0,0,0,0)
  let lastDay = new Date(firstDay)
  lastDay.setDate(lastDay.getDate() + 6 )
  lastDay.setHours(23, 59, 59, 999)
  return [firstDay.toLocaleDateString(), lastDay.toLocaleDateString()]

}


nbutton.onclick = ()=>{
  let [goal_title, goal_level] = ninput.value.trim().split("#")
  let id = new Date(Date.now())
  id.setDate(id.getDate() + 7)

  let key = getWeekKey(id);
  let object = {
    title:goal_title.toLowerCase(),
    level:goal_level>3?3:goal_level<0?0:+goal_level,
    id:id.getTime(),
    checked:false,
    key:getWeekKey(next_week)
  };

  goals.push(object)

  ninput.value = ""

  if(nextWeekGoals.some(obj=>obj.special) == false && constantGoals.length > 0){
    constantGoals.forEach((goal, ind)=>{
      goal.id = id.getTime() + ind + 1
      goal.key = getWeekKey(next_week)
      goals.push(goal)
    })
  }

  weeks.push(key)
  weeks = [...new Set(weeks)]
  updatePastWeeks()
  save()
  renderNextWeek()
}

function renderCurrentWeek(){
  currentWeekContainer.innerHTML = "";
  document.getElementById("currentWeekNumber").innerHTML = past_weeks.length +1
  document.getElementById("nextWeekNumber").innerHTML = past_weeks.length +2
    goals.filter((goal)=> goal.key == getWeekKey(today_date)).forEach((goal)=>{
    let li = document.createElement("li")
    li.className = "goal"

    let mini_div = document.createElement("div")

    let inp = document.createElement("input")
    inp.type = "checkbox"
    inp.checked = goal.checked

    mini_div.appendChild(inp)
    
    let label = document.createElement("label")
    label.innerHTML = `${goal.title} ${goal.special? " ⟲":""}`;
    mini_div.appendChild(label)

    let level = document.createElement("div")
    level.className = "level"

    level.innerHTML += `<span class="active"></span>`.repeat(goal.level)
    level.innerHTML += `<span></span>`.repeat(3-goal.level)

    inp.addEventListener("click", ()=>{
      
      goal.checked = inp.checked
      save()
      renderProgressbar()
    })
    li.appendChild(mini_div)
    li.appendChild(level)
    currentWeekContainer.appendChild(li)
  })
  renderProgressbar()
}

header.addEventListener("click", ()=>{
  container.classList.toggle("expanded")

  
  if(container.classList.contains("expanded")){
    weekDetails.style.height = `${weekDetails.scrollHeight}px`;
  }else{
    weekDetails.style.height = `0px`;
  }
})
function renderNextWeek(){
        document.querySelector("#nextWeek_container h6").innerHTML = getWeekKey(next_week).split(" | ").join(" - ");

        nextWeekContainer.innerHTML = ""
        nextWeekGoals.forEach((goal)=>{
          let li = document.createElement("li")
          li.className = "goal-item";

          li.innerHTML= `
          <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
          <div class="goal-title">
                ${goal.title}
                <div class="level">
                  ${`<span class="active"></span>`.repeat(goal.level)}
                  ${`<span></span>`.repeat(3 - goal.level)}
                </div>
            </div>`

          li.querySelector("button").onclick = ()=>{
            console.log(goal)
            goals = goals.filter((goala)=>{return goala.id != goal.id})
            save()
            weekDetails.style.height = `calc(${weekDetails.scrollHeight - li.scrollHeight}px - 0.8rem)`
            li.remove()
            updatePastWeeks()
          }

          nextWeekContainer.appendChild(li);
        })

}


function renderHistory(){
  historyContainer.innerHTML = ""

  past_weeks.forEach((week, index)=>{
        let filteredGoals = goals.filter((goal)=>{return goal.key == week});
        let checked = filteredGoals.filter((goal)=>{return goal.checked == true}).length

        let container = document.createElement("div")
        container.className = "container history-week"

        let weekHeader = document.createElement("div")
        weekHeader.className = "week-header"

        let weekInfo = document.createElement("div")
        weekInfo.className = 'week-info'

        let week_index = document.createElement("h3")
        week_index.className = "sp_title"
        week_index.innerHTML = `Week ${index + 1}`

        let week_key = document.createElement("h6")
        week_key.innerHTML = week.split(" | ").join(" - ")
        weekInfo.appendChild(week_index)
        weekInfo.appendChild(week_key)

        let weekStats = document.createElement("div");
        weekStats.className = "week-stats";

        let miniProgress = document.createElement("div");
        miniProgress.className = "mini-progress";

        let span = document.createElement("span");
        let perc = Math.floor(checked * 100/filteredGoals.length)
        span.innerHTML = `${perc}%`;

        let bar = document.createElement("div")
        bar.className = "bar";
        let min = document.createElement("span")
        min.style.width = `${perc}%`
        bar.appendChild(min)

        miniProgress.appendChild(span)
        miniProgress.appendChild(bar)

        weekStats.appendChild(miniProgress)
        weekStats.innerHTML += `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><polyline points="6 9 12 15 18 9"/></svg>`

        weekHeader.appendChild(weekInfo)
        weekHeader.appendChild(weekStats)

        container.appendChild(weekHeader)
        historyContainer.appendChild(container)

        let weekDetails = document.createElement("div")
        weekDetails.className = "week-details"

        let weekGoals = document.createElement("ul")
        weekGoals.className = "history-goals"

        filteredGoals.forEach((goal)=>{
          let htmltag = `<li class="goal-item ${goal.checked==true?'done':'missed'}">
                        ${goal.checked==true?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="9"/><polyline points="8 12 11 15 16 9"/></svg>`:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`}
                        <p class="goal-title">${goal.title}</p>
                    </li>`
          weekGoals.innerHTML += htmltag;
        })
        
        weekDetails.appendChild(weekGoals)
        container.appendChild(weekDetails)

        container.addEventListener("click", ()=>{
          container.classList.toggle("expanded")
          if(container.classList.contains("expanded")){
            weekDetails.style.height = `${weekDetails.scrollHeight}px`;
          }else{
            weekDetails.style.height = `0px`
          }
        })
      }
  )
}

function renderStats(){
  // Trackers //
  let bars_container = document.getElementById("chart_bars");
  bars_container.innerHTML = ""

  let past_goals = goals.filter((goal)=>{
    return goal.key != getWeekKey(today_date) && goal.key != getWeekKey(next_week)
  })
  let checked = past_goals.filter((goal)=>{return goal.checked == true})
  let total_checked_levels = getTotalLevels(checked)
  let total_levels = getTotalLevels(past_goals);

  document.getElementById("descipline_rate").innerHTML = `<span>${Math.trunc(total_checked_levels*10000/total_levels)/100}</span>%`
  document.getElementById("total_weeks").innerHTML = `<span>${past_weeks.length}</span> weeks`;
  document.getElementById("average_goals").innerHTML = `<span>${Math.trunc(past_goals.length *100/past_weeks.length)/100}</span>/W`;
  document.getElementById("total_goals").innerHTML = `<span>${checked.length}</span> goals`;

  function getTotalLevels(goals){
    return goals.reduce(((a,b)=>a+b.level), 0)
  }

  // Chart //
  let highest = []
  past_weeks.forEach((week)=>{
    highest.push(checked.filter((goal)=>{return goal.key == week}).length)
  })
  highest = highest.sort((a,b)=> b-a)[0];
  past_weeks.forEach((week, index)=>{
    let num = checked.filter((goal)=>{return goal.key == week}).length;
    let perc = Math.floor(num*100/highest)
    bars_container.innerHTML +=`

    <div class="bar ${perc==100?'max':''}"><span style='height:${perc}%' title='${week.split(" | ").join(" - ")}' data-count="${num}" data-index="${index+1}"></span></div>`
  })
}


function getWeekKey(date){
  return getWeekStartAndEnd(date).join(" | ")
}


function save(){
  localStorage.setItem("AllWeeklyGoals", JSON.stringify(goals))
  localStorage.setItem("AllWeeklyGoalsWeek", JSON.stringify(weeks))
  localStorage.setItem("ConstantGoals", JSON.stringify(constantGoals))
}

function updatePastWeeks(){
  past_weeks = weeks.filter((week)=>{
  return week != getWeekKey(today_date) && week!= getWeekKey(next_week)
})
  nextWeekGoals = goals.filter((goal)=>{return goal.key == getWeekKey(next_week)})
}
init()

document.onkeydown = (e)=>{
  if(e.key == "Enter"){
    document.querySelector(".nextWeekContainer input:focus").nextElementSibling.click()
  }
}

cbutton.onclick = ()=>{
  let val = cinput.value.trim().split("#");
  console.log(val)
  console.log("HI")
  if (val[0].length > 0 && val.length == 2){
    let obj = {
      title:val[0],
      level:+val[1],
      special:true,
      checked:false
    }

    constantGoals.push(obj)
    save()
    cinput.value = ""
  }
}
ccbutton.onclick = ()=>{
   let [goal_title, goal_level] = ccinput.value.trim().split("#")
  let id = new Date(Date.now())
  let key = getWeekKey(id);
  let object = {
    title:goal_title.toLowerCase(),
    level:goal_level>3?3:goal_level<0?0:+goal_level,
    id:id.getTime(),
    checked:false,
    key:getWeekKey(today_date)
  };

  goals.push(object)

  ccinput.value = ""
  weeks.push(key)
  weeks = [...new Set(weeks)]
  updatePastWeeks()
  save()
  renderCurrentWeek()
}