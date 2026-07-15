import './styles.css';
import { createFitnessSync } from './sync';

(function(){
  "use strict";
  var KEY="reforge.state.v3", START=255, GOAL=174;

  var SOURCES=[
    {n:"Chicken 6oz",g:38},{n:"Salmon 6oz",g:34},{n:"Shake",g:30},{n:"Tuna can",g:26},
    {n:"Cottage cheese",g:24},{n:"Greek yogurt",g:20},{n:"Tofu / tempeh",g:20},{n:"Eggs ×2",g:12}
  ];

  // muscle: legs|push|pull|full|none ; kind: strength|conditioning|cardio|recovery
  var MENU=[
    {id:"legs", name:"Legs & Glutes", sub:"Squat · hinge · lunge", muscle:"legs", kind:"strength", met:5, min:40, items:[
      {n:"Goblet or back squat — 3×8–10", d:"Hold one dumbbell vertically against your chest (a “goblet”), or rest a barbell across your upper back. Feet shoulder-width, toes turned slightly out. Sit your hips down and back like lowering into a chair until your thighs are about parallel to the floor, chest tall, then drive through your heels to stand. Do 10 reps, rest ~90 seconds, repeat for 3 sets."},
      {n:"Romanian deadlift — 3×10", d:"Hold dumbbells or a barbell in front of your thighs. With just a soft bend in your knees, push your hips straight back and let the weight slide down your shins — keep your back flat. You'll feel a stretch in the back of your thighs (hamstrings). Squeeze your glutes to stand tall. It's a hip hinge, not a squat. 3 sets of 10."},
      {n:"DB walking lunge — 3×10 / leg", d:"A dumbbell in each hand. Step forward and lower until both knees are bent about 90°, back knee near the floor, front knee over your ankle. Push off and step the back foot through into the next lunge, “walking” forward. 10 steps per leg. No space? Step backward into a reverse lunge in place instead."},
      {n:"Rower finisher — 5 min", d:"End on the rowing machine for a steady 5 minutes at a moderate effort — breathing hard but not all-out. Each stroke: push with your legs first, then lean back slightly, then pull the handle to your lower ribs; reverse the order on the way back."}
    ]},
    {id:"push", name:"Push · Chest & Shoulders", sub:"Press · delts · triceps", muscle:"push", kind:"strength", met:4.5, min:35, items:[
      {n:"DB or barbell bench / floor press — 3×8–10", d:"Lying on a bench (or flat on the floor if you don't have one), press dumbbells or a barbell from chest height straight up until your arms are extended, then lower under control. On the floor your elbows stop when they touch the ground — a safe, shoulder-friendly version. 3 sets of 8–10."},
      {n:"Overhead press — 3×8", d:"Standing, hold dumbbells or a barbell at shoulder height. Tighten your core and press the weight straight overhead until your arms lock out, then lower back to your shoulders. Don't arch your lower back — squeeze your glutes to stay tall. 3 sets of 8."},
      {n:"Lateral raise — 3×12", d:"A light dumbbell in each hand at your sides. With a slight bend in your elbows, raise your arms out to the sides like wings until they're level with your shoulders, then lower slowly. Go light and controlled — this shapes the shoulders. 3 sets of 12."}
    ]},
    {id:"pull", name:"Pull · Back & Biceps", sub:"Row · pull · curl", muscle:"pull", kind:"strength", met:4.5, min:35, items:[
      {n:"Bent-over barbell row — 3×8", d:"Hold a barbell with hands just outside your legs. Hinge at your hips until your torso is about 45°, back flat. Pull the bar up to your belly button, squeezing your shoulder blades together, then lower under control. 3 sets of 8. Dumbbells work fine too."},
      {n:"DB row — 3×10 / arm", d:"Put one hand and the same-side knee on a bench (or hand on a sturdy chair), other foot on the floor, a dumbbell hanging in your free hand. Pull it up toward your side like starting a lawnmower, keeping your elbow close to your body, then lower. 10 per arm."},
      {n:"DB curl — 3×12", d:"A dumbbell in each hand at your sides, palms facing forward. Bend at the elbows to curl the weights up toward your shoulders, keeping your elbows pinned to your sides, then lower slowly. 3 sets of 12."}
    ]},
    {id:"full", name:"Full Body", sub:"One of everything", muscle:"full", kind:"strength", met:5, min:40, items:[
      {n:"Goblet squat — 3×10", d:"Hold one dumbbell vertically against your chest. Feet shoulder-width, sit your hips down and back until your thighs are about parallel, chest tall, then stand up through your heels. 3 sets of 10."},
      {n:"DB bench / floor press — 3×10", d:"On a bench or flat on the floor, press dumbbells from chest height up to locked-out arms, then lower under control. On the floor your elbows rest on the ground each rep. 3 sets of 10."},
      {n:"DB row — 3×10 / arm", d:"One hand and knee on a bench or chair, a dumbbell in the free hand. Pull it up to your side, elbow close to your body, then lower. 10 per arm — this works your back and biceps."},
      {n:"Romanian deadlift — 3×10", d:"Weight in front of your thighs, soft knees. Push your hips straight back, letting the weight lower down your shins with a flat back until you feel a hamstring stretch, then squeeze your glutes to stand. A hip hinge, not a squat. 3 sets of 10."}
    ]},
    {id:"bag", name:"Heavy Bag Conditioning", sub:"Cardio + stress relief", muscle:"none", kind:"conditioning", met:7.5, min:30, items:[
      {n:"Shadow warm-up — 2 rounds", d:"“Shadowboxing” means throwing punches at the air — no bag — to warm up. Stay light on your feet and throw easy jabs, crosses and hooks to raise your heart rate and loosen your shoulders. Do 2 rounds. A “round” is a timed block of work, like in boxing — here, about 2–3 minutes of movement with ~1 minute of rest between rounds."},
      {n:"Heavy bag — 6×2 min rounds", d:"Six rounds on the heavy bag. Each round is 2 minutes of throwing combinations (jab-cross, hooks) with about 1 minute of rest between — so 6 rounds is roughly 18 minutes total. Keep your hands up by your face, breathe out sharply on each punch, and pace yourself so you can last all six."},
      {n:"Core finisher — 5 min", d:"Five minutes of core work to finish. Pick 2–3 moves — planks, dead bugs, or bicycle crunches — and rotate through them for the 5 minutes."}
    ]},
    {id:"cardio", name:"Steady Cardio", sub:"Rower or elliptical, easy", muscle:"none", kind:"cardio", met:6, min:35, items:[
      {n:"Rower or elliptical — 25–40 min", d:"A steady 25–40 minutes on the rower or elliptical at an easy, sustainable pace. The win here is time and consistency, not speed — settle into a rhythm you could keep up."},
      {n:"Zone 2 · conversational pace", d:"“Zone 2” is easy-effort cardio: you're working, but you could still talk in full sentences. If you're gasping for breath, slow down. This gentle pace burns fat and builds your aerobic base without wearing you out — ideal on a GLP-1 when energy can run low."},
      {n:"Cool-down walk — 5 min", d:"Finish with 5 easy minutes on the walking pad to bring your heart rate back down gradually."}
    ]},
    {id:"yoga", name:"Somatic Yoga & Mobility", sub:"Recovery & downregulate", muscle:"none", kind:"recovery", met:2.8, min:30, items:[
      {n:"Guided somatic yoga — 20–30 min", d:"Somatic yoga is slow, gentle movement focused on how your body feels — releasing tension rather than stretching hard or building strength. Follow a guided 20–30 minute session from an app or video. It's for recovery and calming your nervous system after a stressful day."},
      {n:"Easy walking pad — 15 min", d:"Fifteen relaxed minutes on the walking pad at recovery pace — just keeping the body gently moving, no effort target."}
    ]}
  ];

  var PHASE={
    menstrual:{label:"Menstrual",color:"#C4553C",
      tip:"Energy and iron run low. Be kind to yourself — gentle movement, walking, easy cardio or yoga. Light lifting only if you feel good.",
      food:"Iron + vitamin C: lentils, beans, spinach, peppers, citrus. Omega-3s (salmon, walnuts) ease cramps.",
      foodLong:"You lose iron with your period, so lean on iron-rich plants — lentils, beans, tofu, spinach, pumpkin seeds — paired with vitamin C (peppers, citrus, broccoli) to absorb it. Omega-3 fats (salmon, walnuts, chia) and magnesium (leafy greens, nuts, dark chocolate) can ease cramps. Warm, hydrating foods feel best.",
      rec:["cardio","recovery"]},
    follicular:{label:"Follicular",color:"#2E9E6B",
      tip:"Estrogen's rising — strength, recovery, and pain tolerance climb with it. Best window to push: heavier lifts and progress.",
      food:"Fresh veg, lean protein, lighter whole-grain carbs, fermented foods.",
      foodLong:"Energy and insulin sensitivity are good — a great time for fresh vegetables, lean protein and lighter whole-grain carbs. Fermented foods (yogurt, kimchi, sauerkraut) and cruciferous veg help your body process estrogen as it climbs.",
      rec:["strength"]},
    ovulation:{label:"Ovulation",color:"#C98A2E",
      tip:"Peak strength — great for your heaviest lifts. One caution: ligaments are a touch looser now, so keep form tight and don't ego-load.",
      food:"Fiber & cruciferous veg — broccoli, cauliflower, cabbage; colorful antioxidants.",
      foodLong:"Estrogen peaks, so prioritize fiber and cruciferous vegetables (broccoli, cauliflower, cabbage, Brussels sprouts) that help clear excess estrogen, plus colorful antioxidant-rich produce. Lighter, fresher meals tend to sit well.",
      rec:["strength"]},
    luteal:{label:"Luteal",color:"#6C6FBF",
      tip:"Energy tapers and core temp is up. Early on you're still strong; later, favor steady cardio, moderate lifting and recovery. Cravings peak — protein first really helps.",
      food:"Complex carbs + magnesium: squash, oats, quinoa, leafy greens, nuts, dark chocolate — steadies cravings.",
      foodLong:"Progesterone rises and cravings kick in. Complex carbs (sweet potato, squash, oats, quinoa) support serotonin and curb sugar cravings; magnesium and B-vitamins (leafy greens, nuts, seeds, beans) ease PMS. Keep protein and fiber steady to hold blood sugar, and go easy on salt and caffeine to reduce bloating.",
      rec:["cardio","conditioning","recovery"]}
  };
  var MUS_LABEL={legs:"legs & glutes",push:"push (chest & shoulders)",pull:"pull (back & biceps)",full:"full body"};

  function pad(n){return(n<10?"0":"")+n;}
  function iso(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());}
  function fmt(n){return n.toLocaleString("en-US");}
  var today=iso(new Date());
  function shiftKey(days){var d=new Date(today+"T00:00:00");d.setDate(d.getDate()+days);return iso(d);}

  function seedWeights(){
    var series=[255,250,246,243,240,237,234,231,229,227,225,223,221,219,216,214];
    var arr=[],n=series.length,base=new Date();
    for(var i=0;i<n;i++){var d=new Date(base.getFullYear(),base.getMonth()-(n-1-i),Math.min(base.getDate(),28));arr.push({date:iso(d),lbs:series[i]});}
    return arr;
  }

  // Local cache: instant boot + offline. Cloud sync (Supabase) is the source of
  // truth across devices when configured; otherwise the cache is all there is.
  var cacheOK=false;
  try{localStorage.setItem("__probe","1");cacheOK=localStorage.getItem("__probe")==="1";localStorage.removeItem("__probe");}catch(e){cacheOK=false;}
  function cacheLoad(){if(!cacheOK)return null;try{return JSON.parse(localStorage.getItem(KEY));}catch(e){return null;}}
  function cacheSave(){if(!cacheOK)return;try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}

  var sync=createFitnessSync();      // null when Supabase keys are not configured
  var cloudTimer=null,lastSaved="";
  function save(){
    cacheSave();
    if(sync){
      if(cloudTimer)clearTimeout(cloudTimer);
      cloudTimer=setTimeout(function(){lastSaved=JSON.stringify(state);sync.save(state).catch(function(){});},600);
    }
  }

  // Fill in any missing shape + run one-time migrations. Safe to run on any doc,
  // including one arriving from another device.
  function normalize(s){
    if(!s.weights)s.weights=seedWeights();
    if(s.pTarget==null)s.pTarget=150;
    if(s.sTarget==null)s.sTarget=8000;
    if(!s.days)s.days={};
    if(!s.cycle)s.cycle={mode:null,phase:null,start:null,length:28};
    if(!s.lifts)s.lifts={};
    if(!s.nutri)s.nutri={start:(s.veg&&s.veg.start)||today,tgt:{veg:(s.veg&&s.veg.target)||5,fruit:2,fish:2,beans:3}};
    if(!s.nutri.tgt)s.nutri.tgt={veg:5,fruit:2,fish:2,beans:3};
    if(s.stepsPerKm==null)s.stepsPerKm=1513;  // ~0.66 m stride, calibrated to a 5'3" gait
    if(s.kmTarget==null)s.kmTarget=25;         // weekly walking-distance goal (km)
    delete s.veg;
    for(var mk in s.days){var mr=s.days[mk];if(!mr.food)mr.food={};if(mr.veg!=null){if(mr.food.veg==null)mr.food.veg=mr.veg;delete mr.veg;}
      // distance logged before per-walk tracking: represent it as one entry with unknown incline
      if(!mr.walks)mr.walks=[];
      if(!mr.walks.length&&mr.km>0)mr.walks.push({km:mr.km,inc:null,steps:Math.round(mr.km*(s.stepsPerKm||1513)),kcal:mr.kcal||0});}
    return s;
  }

  var state=cacheLoad(),fresh=!state;
  if(!state)state={weights:seedWeights(),pTarget:150,sTarget:8000,cycle:{mode:null,phase:null,start:null,length:28},days:{},lifts:{},nutri:{start:today,tgt:{veg:5,fruit:2,fish:2,beans:3}}};
  normalize(state);
  if(fresh)save();

  function dayRec(k){k=k||today;if(!state.days[k])state.days[k]={pLog:[],steps:0,pick:null,done:{},food:{},km:0,kcal:0,walks:[]};
    var r=state.days[k];if(!r.pLog)r.pLog=[];if(!r.done)r.done={};if(r.steps==null)r.steps=0;if(!r.food)r.food={};if(r.km==null)r.km=0;if(r.kcal==null)r.kcal=0;if(!r.walks)r.walks=[];return r;}
  function curWeight(){var w=state.weights;return w.length?w[w.length-1].lbs:START;}
  function optById(id){for(var i=0;i<MENU.length;i++)if(MENU[i].id===id)return MENU[i];return null;}

  // ---- HERO ----
  var ringFill=document.getElementById("ringFill"),C=2*Math.PI*56;
  ringFill.setAttribute("stroke-dasharray",C.toFixed(1));
  function renderHero(){
    var cur=curWeight(),lost=Math.max(0,START-cur),toGo=Math.max(0,cur-GOAL);
    var pct=Math.max(0,Math.min(1,(START-cur)/(START-GOAL)));
    document.getElementById("curW").textContent=Math.round(cur*10)/10;
    document.getElementById("stLost").textContent=Math.round(lost);
    document.getElementById("stToGo").textContent=Math.round(toGo);
    document.getElementById("ringPct").textContent=Math.round(pct*100)+"%";
    ringFill.style.transition="stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)";
    ringFill.setAttribute("stroke-dashoffset",(C*(1-pct)).toFixed(1));
  }

  // ---- CHART ----
  var canvas=document.getElementById("chart"),ctx=canvas.getContext("2d");
  function cssv(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}
  function hexA(hex,a){hex=hex.replace("#","");if(hex.length===3)hex=hex.split("").map(function(c){return c+c;}).join("");
    var r=parseInt(hex.substr(0,2),16),g=parseInt(hex.substr(2,2),16),b=parseInt(hex.substr(4,2),16);
    if(isNaN(r))return"rgba(14,157,107,"+a+")";return"rgba("+r+","+g+","+b+","+a+")";}
  function drawChart(){
    var w=state.weights;if(!w.length)return;
    var dpr=window.devicePixelRatio||1,W=canvas.clientWidth,H=180;
    canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    var padL=8,padR=44,padT=14,padB=18,accent=cssv("--accent"),line=cssv("--line"),ink3=cssv("--ink-3");
    var yMax=258,yMin=170;
    function Y(v){return padT+(yMax-v)/(yMax-yMin)*(H-padT-padB);}
    function X(i){return padL+i/(w.length-1)*(W-padL-padR);}
    ctx.font="11px "+cssv("--font-ui").split(",")[0];ctx.textBaseline="middle";
    [250,230,210,190].forEach(function(g){var y=Y(g);ctx.strokeStyle=line;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(W-padR,y);ctx.stroke();
      ctx.fillStyle=ink3;ctx.textAlign="left";ctx.fillText(g,W-padR+6,y);});
    var gy=Y(GOAL);ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(padL,gy);ctx.lineTo(W-padR,gy);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=accent;ctx.fillText("Goal",W-padR+6,gy);
    var grad=ctx.createLinearGradient(0,padT,0,H-padB);grad.addColorStop(0,hexA(accent,.28));grad.addColorStop(1,hexA(accent,0));
    ctx.beginPath();ctx.moveTo(X(0),Y(w[0].lbs));for(var i=1;i<w.length;i++)ctx.lineTo(X(i),Y(w[i].lbs));
    ctx.lineTo(X(w.length-1),H-padB);ctx.lineTo(X(0),H-padB);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
    ctx.beginPath();ctx.moveTo(X(0),Y(w[0].lbs));for(var j=1;j<w.length;j++)ctx.lineTo(X(j),Y(w[j].lbs));
    ctx.strokeStyle=accent;ctx.lineWidth=2.5;ctx.lineJoin="round";ctx.stroke();
    var ex=X(w.length-1),ey=Y(w[w.length-1].lbs);
    ctx.beginPath();ctx.arc(ex,ey,5,0,7);ctx.fillStyle=accent;ctx.fill();
    ctx.beginPath();ctx.arc(ex,ey,9,0,7);ctx.strokeStyle=hexA(accent,.3);ctx.lineWidth=3;ctx.stroke();
  }

  // ---- WEIGHT LOG ----
  document.getElementById("wDate").value=today;
  document.getElementById("wLog").addEventListener("click",function(){
    var d=document.getElementById("wDate").value||today,v=parseFloat(document.getElementById("wVal").value);
    if(!v||v<80||v>500){document.getElementById("wVal").focus();return;}
    var w=state.weights,found=false;
    for(var i=0;i<w.length;i++){if(w[i].date===d){w[i].lbs=v;found=true;break;}}
    if(!found)w.push({date:d,lbs:v});
    w.sort(function(a,b){return a.date<b.date?-1:1;});
    document.getElementById("wVal").value="";save();renderHero();drawChart();
  });

  // ---- PROTEIN ----
  function renderProtein(){
    var r=dayRec(),tot=r.pLog.reduce(function(a,b){return a+b;},0);
    document.getElementById("pNow").textContent=tot;
    document.getElementById("pTgt").textContent=state.pTarget;
    document.getElementById("pBar").style.width=Math.min(100,tot/state.pTarget*100)+"%";
  }
  var pChips=document.getElementById("pChips");
  SOURCES.forEach(function(s){var b=document.createElement("button");b.className="chip";
    b.innerHTML=s.n+' <span class="g">+'+s.g+'</span>';
    b.addEventListener("click",function(){dayRec().pLog.push(s.g);save();renderProtein();});pChips.appendChild(b);});
  function toggle(id,show){var el=document.getElementById(id);el.classList[show?"remove":"add"]("hide");}
  document.getElementById("pUndo").addEventListener("click",function(){var r=dayRec();if(r.pLog.length){r.pLog.pop();save();renderProtein();}});
  // custom protein (inline)
  document.getElementById("pCustom").addEventListener("click",function(){toggle("pCustomRow",true);document.getElementById("pCustomVal").focus();});
  document.getElementById("pCustomCancel").addEventListener("click",function(){toggle("pCustomRow",false);});
  function addCustom(){var el=document.getElementById("pCustomVal"),v=parseInt(el.value,10);if(v>0){dayRec().pLog.push(v);save();renderProtein();}el.value="";toggle("pCustomRow",false);}
  document.getElementById("pCustomAdd").addEventListener("click",addCustom);
  document.getElementById("pCustomVal").addEventListener("keydown",function(e){if(e.key==="Enter")addCustom();});
  // protein target (inline)
  document.getElementById("pTgt").addEventListener("click",function(){var el=document.getElementById("pTgtVal");el.value=state.pTarget;toggle("pTgtRow",true);el.focus();});
  document.getElementById("pTgtCancel").addEventListener("click",function(){toggle("pTgtRow",false);});
  function saveTgt(){var v=parseInt(document.getElementById("pTgtVal").value,10);if(v>0){state.pTarget=v;save();renderProtein();}toggle("pTgtRow",false);}
  document.getElementById("pTgtSave").addEventListener("click",saveTgt);
  document.getElementById("pTgtVal").addEventListener("keydown",function(e){if(e.key==="Enter")saveTgt();});

  // ---- STEPS ----
  function round2(n){return Math.round(n*100)/100;}
  // Uphill shortens the stride, so the same km is more steps: +1% per 1% incline.
  function kmToSteps(km,inc){return Math.round(km*state.stepsPerKm*(1+inc/100));}
  // Net calories (speed-independent, ACSM-derived): kg × km × (0.5 + 0.09·incline%).
  function latestWeightLbs(){var w=state.weights;return w.length?w[w.length-1].lbs:200;}
  function kmKcal(km,inc){return Math.round(latestWeightLbs()*0.453592*km*(0.5+0.09*inc));}
  function weekKm(back){var m=mondayOf(TODAY_D);m.setDate(m.getDate()-7*(back||0));var t=0;
    for(var i=0;i<7;i++){var d=new Date(m);d.setDate(d.getDate()+i);var r=getDay(iso(d));if(r&&r.km)t+=r.km;}return round2(t);}
  function weekKcal(back){var m=mondayOf(TODAY_D);m.setDate(m.getDate()-7*(back||0));var t=0;
    for(var i=0;i<7;i++){var d=new Date(m);d.setDate(d.getDate()+i);t+=dayWalkKcal(getDay(iso(d)));}return Math.round(t);}
  function flatKcal(km){return Math.round(latestWeightLbs()*0.453592*km*0.5);}  // 0% incline
  // Calories for a day's walking. Distance logged before calorie tracking has
  // no stored kcal — fall back to a flat estimate so it never reads as 0.
  function dayWalkKcal(r){if(!r)return 0;var floor=r.km>0?flatKcal(r.km):0;return Math.max(r.kcal||0,floor);}
  // Completed workout calories for a day: METs × kg × hours.
  function workoutKcalForDay(k){var r=getDay(k);if(!dayDone(r)||!r.pick)return 0;var o=optById(r.pick);
    if(!o||!o.met)return 0;return Math.round(latestWeightLbs()*0.453592*o.met*(o.min/60));}
  function renderActivity(){
    var el=document.getElementById("activityLine");if(!el)return;
    var r=dayRec(),walk=dayWalkKcal(r),wo=workoutKcalForDay(today),total=walk+wo;
    el.innerHTML=total>0
      ? "Today’s activity ≈ <b>"+fmt(total)+"</b> kcal · "+fmt(walk)+" walking + "+fmt(wo)+" workout"
      : "Today’s activity ≈ <b>0</b> kcal — log a walk or check off a workout.";
  }
  function renderSteps(){
    var r=dayRec();
    document.getElementById("sNow").textContent=fmt(r.steps);
    document.getElementById("sTgt").textContent=fmt(state.sTarget);
    document.getElementById("sBar").style.width=Math.min(100,r.steps/state.sTarget*100)+"%";
    document.getElementById("kmNote").innerHTML=r.km>0?("Pad today: <b>"+round2(r.km)+" km</b> · ~<b>"+fmt(dayWalkKcal(r))+" kcal</b>"):"";
    // today's individual walks (removable)
    var wl=document.getElementById("walkList");
    if(r.walks&&r.walks.length){
      wl.innerHTML=r.walks.map(function(w,i){
        var kc=w.kcal>0?w.kcal:flatKcal(w.km),inc=(w.inc==null)?"incline n/a":(w.inc+"% incline");
        return '<div class="walk"><span>'+round2(w.km)+' km · '+inc+' · '+fmt(w.steps)+' steps · ~'+fmt(kc)+' kcal</span>'+
          '<button class="walk-x" data-i="'+i+'" aria-label="Remove this walk">×</button></div>';
      }).join("");
      Array.prototype.forEach.call(wl.querySelectorAll(".walk-x"),function(btn){btn.addEventListener("click",function(){removeWalk(parseInt(btn.dataset.i,10));});});
    }else wl.innerHTML="";
    // weekly km goal
    var wk=weekKm(0);
    document.getElementById("kmWeek").textContent=round2(wk);
    document.getElementById("kmTgt").textContent=state.kmTarget;
    document.getElementById("kmBar").style.width=Math.min(100,state.kmTarget?wk/state.kmTarget*100:0)+"%";
    document.getElementById("kmWeekNote").innerHTML="Last week: <b>"+weekKm(1)+"</b> km";
    // calorie comparison: actual vs flat
    var kcalWk=weekKcal(0),flatSame=flatKcal(wk),bonus=Math.max(0,kcalWk-flatSame),flatGoal=flatKcal(state.kmTarget);
    var pct=flatSame>0?Math.round(bonus/flatSame*100):0;
    document.getElementById("kmCalNote").innerHTML=kcalWk>0
      ? "Burned this week: ~<b>"+fmt(kcalWk)+"</b> kcal over "+round2(wk)+" km<br>"+
        "· same distance flat ≈ "+fmt(flatSame)+" kcal — <b>incline earned +"+fmt(bonus)+" (+"+pct+"%)</b><br>"+
        "· walking the "+state.kmTarget+" km goal flat ≈ "+fmt(flatGoal)+" kcal"
      : "Walking the "+state.kmTarget+" km goal flat would burn ≈ <b>"+fmt(flatGoal)+"</b> kcal.";
    renderActivity();
    var g=document.getElementById("gaitLine");
    g.innerHTML="≈ <b>"+fmt(state.stepsPerKm)+"</b> steps/km · tuned to a 5′3″ gait · <button class=\"mini\" id=\"gaitEdit\">change</button>";
    document.getElementById("gaitEdit").addEventListener("click",function(){var el=document.getElementById("gaitVal");el.value=state.stepsPerKm;toggle("gaitRow",true);el.focus();});
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-step]"),function(b){b.addEventListener("click",function(){dayRec().steps+=parseInt(b.dataset.step,10);save();renderSteps();});});
  // Walking pad: log km + incline → steps (personal gait) + calories, added to today.
  document.getElementById("kmAdd").addEventListener("click",function(){
    var km=parseFloat(document.getElementById("kmVal").value),inc=parseInt(document.getElementById("inclineSel").value,10)||0;
    if(!(km>0)){document.getElementById("kmVal").focus();return;}
    var steps=kmToSteps(km,inc),kcal=kmKcal(km,inc),r=dayRec();
    r.steps+=steps;r.km=round2(r.km+km);r.kcal+=kcal;r.walks.push({km:round2(km),inc:inc,steps:steps,kcal:kcal});save();
    document.getElementById("kmVal").value="";renderSteps();
    document.getElementById("kmNote").innerHTML="Added <b>"+fmt(steps)+"</b> steps · ~<b>"+fmt(kcal)+" kcal</b> — "+round2(km)+" km @ "+inc+"%. Pad today: <b>"+round2(r.km)+" km</b> · ~<b>"+fmt(r.kcal)+" kcal</b>";
  });
  document.getElementById("kmVal").addEventListener("keydown",function(e){if(e.key==="Enter")document.getElementById("kmAdd").click();});
  document.getElementById("sSet").addEventListener("click",function(){var el=document.getElementById("sSetVal");el.value=dayRec().steps||"";toggle("sSetRow",true);el.focus();});
  document.getElementById("sSetCancel").addEventListener("click",function(){toggle("sSetRow",false);});
  function saveSteps(){var v=parseInt(document.getElementById("sSetVal").value,10);if(v>=0){dayRec().steps=v;save();renderSteps();}toggle("sSetRow",false);}
  document.getElementById("sSetSave").addEventListener("click",saveSteps);
  document.getElementById("sSetVal").addEventListener("keydown",function(e){if(e.key==="Enter")saveSteps();});
  document.getElementById("sReset").addEventListener("click",function(){var r=dayRec();r.steps=0;r.km=0;r.kcal=0;r.walks=[];save();renderSteps();});
  function removeWalk(i){var r=dayRec();if(!r.walks||i<0||i>=r.walks.length)return;var w=r.walks[i];
    r.steps=Math.max(0,r.steps-(w.steps||0));r.km=round2(Math.max(0,r.km-(w.km||0)));r.kcal=Math.max(0,r.kcal-(w.kcal||0));
    r.walks.splice(i,1);save();renderSteps();}
  // Gait (steps per km) — personal calibration.
  document.getElementById("gaitCancel").addEventListener("click",function(){toggle("gaitRow",false);});
  function saveGait(){var v=parseInt(document.getElementById("gaitVal").value,10);if(v>0){state.stepsPerKm=v;save();renderSteps();}toggle("gaitRow",false);}
  document.getElementById("gaitSave").addEventListener("click",saveGait);
  document.getElementById("gaitVal").addEventListener("keydown",function(e){if(e.key==="Enter")saveGait();});
  // Weekly km goal.
  document.getElementById("kmTgt").addEventListener("click",function(){var el=document.getElementById("kmTgtVal");el.value=state.kmTarget;toggle("kmTgtRow",true);el.focus();});
  document.getElementById("kmTgtCancel").addEventListener("click",function(){toggle("kmTgtRow",false);});
  function saveKmTgt(){var v=parseFloat(document.getElementById("kmTgtVal").value);if(v>0){state.kmTarget=v;save();renderSteps();}toggle("kmTgtRow",false);}
  document.getElementById("kmTgtSave").addEventListener("click",saveKmTgt);
  document.getElementById("kmTgtVal").addEventListener("keydown",function(e){if(e.key==="Enter")saveKmTgt();});

  // ---- NUTRITION GOALS (veg / fruit / fish / beans) ----
  function fmtShort(k){var d=new Date(k+"T00:00:00");return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});}
  var FOODS=[
    {id:"veg",  label:"Vegetables", color:"#5AAB3A", cad:"day",  note:"1 serving ≈ 1 cup raw leafy greens or ½ cup other vegetables.", challenge:true},
    {id:"fruit",label:"Fruit",      color:"#D46A9F", cad:"day",  note:"1 serving ≈ 1 medium fruit, or ½ cup chopped fruit or berries."},
    {id:"fish", label:"Fish",       color:"#3E8FB0", cad:"week", note:"Aim for 2 servings a week, ideally some oily fish (salmon, sardines, mackerel). 1 serving ≈ 3–4 oz."},
    {id:"beans",label:"Beans & legumes", color:"#B0803C", cad:"week", note:"Aim for ~3 servings a week. 1 serving ≈ ½ cup cooked beans, lentils or chickpeas."}
  ];
  function foodTgt(id){return state.nutri.tgt[id];}
  function foodCount(id,k){var r=state.days[k];return (r&&r.food&&r.food[id])||0;}
  function weekTotal(id,back){var m=mondayOf(TODAY_D);m.setDate(m.getDate()-7*back);var t=0;for(var i=0;i<7;i++){var d=new Date(m);d.setDate(d.getDate()+i);t+=foodCount(id,iso(d));}return Math.round(t*10)/10;}
  function daysElapsedThisWeek(){return ((TODAY_D.getDay()+6)%7)+1;}
  function daysHitThisWeek(id){var m=mondayOf(TODAY_D),c=0,tgt=foodTgt(id);for(var i=0;i<7;i++){var d=new Date(m);d.setDate(d.getDate()+i);if(d>TODAY_D)break;if(foodCount(id,iso(d))>=tgt)c++;}return c;}
  function nutriChallenge(id){var start=state.nutri.start,tgt=foodTgt(id),total=0,hit=0;
    for(var k in state.days){if(k<start)continue;var v=foodCount(id,k);total+=v;if(v>=tgt)hit++;}
    return {total:Math.round(total*10)/10,hit:hit};}
  function foodSubstat(f){
    var tgt=foodTgt(f.id);
    if(f.challenge){var s=nutriChallenge(f.id);return "Since "+fmtShort(state.nutri.start)+" · <b>"+s.total+"</b> servings · <b>"+s.hit+"</b> day"+(s.hit===1?"":"s")+" hit "+tgt+"+";}
    if(f.cad==="day")return "This week: <b>"+daysHitThisWeek(f.id)+"</b>/"+daysElapsedThisWeek()+" days at goal";
    return "Last week: <b>"+weekTotal(f.id,1)+"</b>/"+tgt;
  }
  function renderFoods(){
    var host=document.getElementById("foods");host.innerHTML="";
    FOODS.forEach(function(f){
      var tgt=foodTgt(f.id),cur=f.cad==="week"?weekTotal(f.id,0):foodCount(f.id,today);
      var pct=Math.min(100,tgt?cur/tgt*100:0),badge=f.cad==="week"?(tgt+"×/week"):"Daily";
      var row=document.createElement("div");row.className="food";
      row.innerHTML='<div class="food-h"><div class="food-l"><span class="fdot" style="background:'+f.color+'"></span>'+f.label+
          ' <span class="fbadge">'+badge+'</span>'+(f.challenge?' <span class="chal">work challenge</span>':'')+'</div>'+
          '<div class="amt"><b class="num">'+(Math.round(cur*10)/10)+'</b> / <span class="ftgt num tgt-edit" title="Tap to change target">'+tgt+'</span> '+(f.cad==="week"?"this wk":"today")+'</div></div>'+
        '<div class="fbar"><i style="width:'+pct+'%;background:'+f.color+'"></i></div>'+
        '<div class="inline hide ftgt-row"><input type="number" class="ftgt-val" inputmode="numeric" placeholder="target"><button class="btn ftgt-save" type="button">Save</button><button class="mini ftgt-cancel" type="button">cancel</button></div>'+
        '<div class="fchips"><button class="chip" data-add="1">+1</button><button class="chip" data-add="0.5">+½</button>'+
          '<button class="mini" data-undo>−1</button><button class="mini" data-info>what counts?</button></div>'+
        '<div class="fnote hide">'+f.note+'</div>'+
        '<div class="fstat">'+foodSubstat(f)+'</div>';
      Array.prototype.forEach.call(row.querySelectorAll("[data-add]"),function(b){b.addEventListener("click",function(){var r=dayRec();r.food[f.id]=(r.food[f.id]||0)+parseFloat(b.dataset.add);save();renderFoods();});});
      row.querySelector("[data-undo]").addEventListener("click",function(){var r=dayRec();r.food[f.id]=Math.max(0,(r.food[f.id]||0)-1);save();renderFoods();});
      row.querySelector("[data-info]").addEventListener("click",function(){row.querySelector(".fnote").classList.toggle("hide");});
      var trow=row.querySelector(".ftgt-row"),tval=row.querySelector(".ftgt-val");
      row.querySelector(".ftgt").addEventListener("click",function(){tval.value=tgt;trow.classList.remove("hide");tval.focus();});
      row.querySelector(".ftgt-cancel").addEventListener("click",function(){trow.classList.add("hide");});
      function saveT(){var v=parseFloat(tval.value);if(v>0){state.nutri.tgt[f.id]=v;save();renderFoods();}else trow.classList.add("hide");}
      row.querySelector(".ftgt-save").addEventListener("click",saveT);
      tval.addEventListener("keydown",function(e){if(e.key==="Enter")saveT();});
      host.appendChild(row);
    });
  }

  // ---- CYCLE ----
  function cyclePhase(){
    var c=state.cycle;if(!c||!c.mode)return null;
    if(c.mode==="direct")return c.phase?{name:c.phase,direct:true}:null;
    if(!c.start)return null;
    var len=c.length||28,start=new Date(c.start+"T00:00:00"),now=new Date(today+"T00:00:00");
    var diff=Math.floor((now-start)/86400000);if(diff<0)return null;
    var day=(diff%len+len)%len+1,ov=Math.max(11,len-14),name;
    if(day<=5)name="menstrual";
    else if(day>=ov-1&&day<=ov+1)name="ovulation";
    else if(day<ov-1)name="follicular";
    else name="luteal";
    return{day:day,len:len,name:name};
  }
  function isRec(opt,ph){if(!ph)return false;var rec=PHASE[ph.name].rec;return rec.indexOf(opt.kind)>=0;}

  var cycleEditing=false;
  var PHASE_ORDER=["menstrual","follicular","ovulation","luteal"];
  var PHASE_SHORT={menstrual:"Period · low energy",follicular:"Rising energy · build",ovulation:"Peak strength",luteal:"Winding down · recover"};

  function renderCycle(){
    var bar=document.getElementById("cycleBar"),ph=cyclePhase();
    if(ph && !cycleEditing){
      var info=PHASE[ph.name],meta=ph.direct?'<span>· you set this</span>':'<span>· day '+ph.day+' of ~'+ph.len+'</span>';
      bar.innerHTML='<div class="cyclebar" style="--phase:'+info.color+'"><span class="cdot" style="background:'+info.color+'"></span>'+
        '<div class="cbody"><div class="cph">'+info.label+' phase '+meta+'</div>'+
        '<div class="ctip">'+info.tip+'</div>'+
        '<div class="cfood"><b>Eat:</b> '+info.food+'</div>'+
        '<button class="cedit" id="cEdit">change</button></div></div>';
      document.getElementById("cEdit").addEventListener("click",function(){cycleEditing=true;renderCycle();});
      return;
    }
    var cur=(state.cycle.mode==="direct")?state.cycle.phase:null;
    var btns=PHASE_ORDER.map(function(k){var p=PHASE[k];
      return '<button data-phase="'+k+'" aria-pressed="'+(cur===k?"true":"false")+'" style="--pc:'+p.color+'">'+
        '<div class="pp-n"><i></i>'+p.label+'</div><div class="pp-d">'+PHASE_SHORT[k]+'</div></button>';}).join("");
    var canCancel=!!state.cycle.mode;
    bar.innerHTML='<div class="cyclepanel">'+
      '<h5>What’s your cycle phase today?</h5>'+
      '<p class="ph-help">Tap your phase and the menu tunes its suggestions to it. Not sure? Use “track by date” and it works it out for you.</p>'+
      '<div class="phasepick">'+btns+'</div>'+
      '<button class="mini" id="byDateToggle" style="margin-top:12px">Track by date instead ›</button>'+
      '<div class="bydate hide" id="byDate">'+
        '<label for="cStart">First day of your last period</label>'+
        '<div class="drow"><input type="date" id="cStart"><input type="number" id="cLen" min="20" max="45" placeholder="len (28)"></div>'+
        '<div class="arow"><button class="btn" id="cSave">Save</button><button class="mini" id="cCancelDate">cancel</button></div>'+
        '<div class="cerr hide" id="cErr">Pick the first day of your last period to track by date.</div>'+
      '</div>'+
      (canCancel?'<button class="mini" id="cClose" style="margin-top:12px">close</button>':'')+
    '</div>';
    Array.prototype.forEach.call(bar.querySelectorAll(".phasepick button"),function(b){
      b.addEventListener("click",function(){state.cycle={mode:"direct",phase:b.dataset.phase,start:null,length:state.cycle.length||28};cycleEditing=false;save();renderCycle();renderMenu();});
    });
    document.getElementById("byDateToggle").addEventListener("click",function(){
      var bd=document.getElementById("byDate");bd.classList.toggle("hide");
      if(state.cycle.mode==="date"&&state.cycle.start){document.getElementById("cStart").value=state.cycle.start;document.getElementById("cLen").value=state.cycle.length||28;}
    });
    document.getElementById("cSave").addEventListener("click",function(){
      var s=document.getElementById("cStart").value,l=parseInt(document.getElementById("cLen").value,10);
      if(!s){document.getElementById("cErr").classList.remove("hide");return;}
      state.cycle={mode:"date",phase:null,start:s,length:(l>=20&&l<=45)?l:28};cycleEditing=false;save();renderCycle();renderMenu();
    });
    document.getElementById("cCancelDate").addEventListener("click",function(){document.getElementById("byDate").classList.add("hide");});
    if(canCancel)document.getElementById("cClose").addEventListener("click",function(){cycleEditing=false;renderCycle();});
  }

  // ---- MENU / WORKOUT ----
  var STRENGTH={legs:1,push:1,pull:1,full:1};
  function getDay(k){return state.days[k]||null;}
  function dayDone(r){return !!(r&&r.done&&Object.keys(r.done).length);}

  // Monday-anchored 2-week window (this week + last week)
  var TODAY_D=new Date(today+"T00:00:00");
  function mondayOf(d){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x;}
  function winStartDate(){var m=mondayOf(TODAY_D);m.setDate(m.getDate()-7);return m;}  // last week's Monday
  function winKeys(){var out=[],d=new Date(winStartDate());while(d<=TODAY_D){out.push(iso(d));d.setDate(d.getDate()+1);}return out;}

  // back-to-back same-group warning (yesterday, by date)
  function clashLabel(){
    var r=getDay(today);if(!r||!r.pick)return null;var t=optById(r.pick);if(!t||!STRENGTH[t.muscle])return null;
    var y=getDay(shiftKey(-1));if(!dayDone(y)||!y.pick)return null;var yo=optById(y.pick);if(!yo||!STRENGTH[yo.muscle])return null;
    var a=t.muscle,b=yo.muscle;
    if(a===b||a==="full"||b==="full")return MUS_LABEL[b];
    return null;
  }

  // muscle-group balance over the Monday-anchored 2-week window
  function balanceCounts(){
    var c={legs:0,push:0,pull:0},keys=winKeys();
    keys.forEach(function(k){
      var r=getDay(k);if(!dayDone(r)||!r.pick)return;
      var o=optById(r.pick);if(!o)return;
      if(o.muscle==="full"){c.legs++;c.push++;c.pull++;}
      else if(c[o.muscle]!=null)c[o.muscle]++;
    });
    return c;
  }
  function computeBalance(){
    var bc=balanceCounts(),g=["legs","push","pull"],vals=[bc.legs,bc.push,bc.pull];
    var min=Math.min.apply(null,vals),max=Math.max.apply(null,vals),due={};
    g.forEach(function(k){if(bc[k]===min&&(max>min||bc[k]===0))due[k]=true;});
    return {bc:bc,due:due,fresh:max===0,balanced:(max>0&&max===min)};
  }
  function isBalanceDue(opt,due){if(opt.muscle==="full")return Object.keys(due).length>0;return !!due[opt.muscle];}
  function recommend(opt,ph,B){
    if(opt.kind==="strength"){
      var ok=ph?PHASE[ph.name].rec.indexOf("strength")>=0:true;
      if(!ok)return false;
      if(B.fresh||B.balanced)return true;
      return isBalanceDue(opt,B.due);
    }
    if(!ph)return false;
    return PHASE[ph.name].rec.indexOf(opt.kind)>=0;
  }

  var LAB={legs:"Legs",push:"Push",pull:"Pull"};
  function renderBalance(B){
    var el=document.getElementById("balance"),g=["legs","push","pull"];
    var pills=g.map(function(k){return '<span class="bg'+(B.due[k]?" due":"")+'"><b>'+LAB[k]+'</b><span class="n">'+B.bc[k]+'</span></span>';}).join("");
    var note;
    if(B.fresh){note="No lifts logged yet — start anywhere and it balances from here.";}
    else if(B.balanced){note="Nicely balanced across legs, push and pull — pick by how you feel.";}
    else{
      var d=g.filter(function(k){return B.due[k];}).map(function(k){return LAB[k].toLowerCase();});
      var list=d.length===1?d[0]:(d.slice(0,-1).join(", ")+" & "+d[d.length-1]);
      list=list.charAt(0).toUpperCase()+list.slice(1);
      note="<b>"+list+"</b> "+(d.length===1?"is":"are")+" due — least-trained over the past 2 weeks.";
    }
    el.innerHTML='<div class="balance"><div class="bh">Muscle balance · past 2 weeks</div>'+
      '<div class="bgroups">'+pills+'</div><div class="bnote">'+note+'</div></div>';
  }
  function refreshBalance(){var B=computeBalance();renderBalance(B);updateRecent();renderHistory();renderActivity();}

  // ---- WEIGHT / PROGRESSIVE OVERLOAD ----
  function movementKey(name){return name.split("—")[0].trim();}
  function isLift(opt,it){return opt.kind==="strength" && !/rower/i.test(it.n);}
  function incFor(name){return /squat|deadlift|romanian/i.test(name)?10:5;}
  function parseTarget(name){
    var m=name.match(/(\d+)\s*[×x]\s*(\d+)(?:\s*[–-]\s*(\d+))?/);
    if(!m)return {sets:3,top:10};
    return {sets:parseInt(m[1],10),top:parseInt(m[3]||m[2],10)};
  }
  function entryHit(e,top){
    if(e.reps&&e.reps.length)return e.reps.every(function(r){return r>=top;});
    return !!e.hit;
  }
  function repsText(e){return (e.reps&&e.reps.length)?e.reps.join(", "):(e.hit?"✓ all reps":"logged");}
  function liftArr(key){return state.lifts[key]||[];}
  function logLift(key,w,reps){
    var arr=state.lifts[key]||(state.lifts[key]=[]),rec={d:today,w:w,reps:reps};
    if(arr.length&&arr[arr.length-1].d===today)arr[arr.length-1]=rec;else arr.push(rec);
    save();
  }
  function liftSuggestion(key,name){
    var arr=liftArr(key);if(!arr.length)return null;
    var last=arr[arr.length-1],top=parseTarget(name).top,inc=incFor(name);
    if(entryHit(last,top))return {up:true,text:"try "+(last.w+inc)+" lb next"};
    return {up:false,text:"repeat "+last.w+" lb, hit "+top+" reps"};
  }
  function drawLiftChart(canvas,arr){
    if(!arr.length)return;
    var dpr=window.devicePixelRatio||1,W=canvas.clientWidth||260,H=118;
    canvas.width=W*dpr;canvas.height=H*dpr;var x=canvas.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
    var accent=cssv("--accent"),line=cssv("--line"),ink3=cssv("--ink-3");
    var ws=arr.map(function(e){return e.w;}),lo=Math.min.apply(null,ws),hi=Math.max.apply(null,ws);
    if(hi===lo){hi=lo+10;lo=Math.max(0,lo-10);}else{var p=(hi-lo)*0.28;hi+=p;lo-=p;}
    var padL=8,padR=40,padT=13,padB=15,n=arr.length;
    function Y(v){return padT+(hi-v)/(hi-lo)*(H-padT-padB);}
    function X(i){return padL+(n===1?0.5:i/(n-1))*(W-padL-padR);}
    x.font="10px "+cssv("--font-ui").split(",")[0];x.textBaseline="middle";
    [hi,(hi+lo)/2,lo].forEach(function(g){var y=Y(g);x.strokeStyle=line;x.lineWidth=1;x.beginPath();x.moveTo(padL,y);x.lineTo(W-padR,y);x.stroke();
      x.fillStyle=ink3;x.textAlign="left";x.fillText(Math.round(g)+"",W-padR+5,y);});
    var grad=x.createLinearGradient(0,padT,0,H-padB);grad.addColorStop(0,hexA(accent,.25));grad.addColorStop(1,hexA(accent,0));
    x.beginPath();x.moveTo(X(0),Y(ws[0]));for(var i=1;i<n;i++)x.lineTo(X(i),Y(ws[i]));
    x.lineTo(X(n-1),H-padB);x.lineTo(X(0),H-padB);x.closePath();x.fillStyle=grad;x.fill();
    x.beginPath();x.moveTo(X(0),Y(ws[0]));for(var j=1;j<n;j++)x.lineTo(X(j),Y(ws[j]));
    x.strokeStyle=accent;x.lineWidth=2.5;x.lineJoin="round";x.stroke();
    for(var k=0;k<n;k++){x.beginPath();x.arc(X(k),Y(ws[k]),3,0,7);x.fillStyle=accent;x.fill();}
  }

  function renderMenu(){
    var menu=document.getElementById("menu"),ph=cyclePhase(),r=dayRec(),B=computeBalance();
    renderBalance(B);
    menu.innerHTML="";
    MENU.forEach(function(opt){
      var sel=r.pick===opt.id,recd=recommend(opt,ph,B);
      var el=document.createElement("div");el.className="opt"+(sel?" sel":"");
      el.setAttribute("tabindex","0");el.setAttribute("role","button");el.setAttribute("aria-pressed",sel?"true":"false");
      var tags="";
      if(recd){var t=(opt.kind==="strength"&&!B.fresh&&!B.balanced&&isBalanceDue(opt,B.due))?"Balances week":"Recommended";
        tags+='<span class="tag rec">'+t+'</span>';}
      if(STRENGTH[opt.muscle])tags+='<span class="tag mus">'+opt.muscle+'</span>';
      el.innerHTML='<div class="oh"><div><div class="onm">'+opt.name+'</div><div class="osub">'+opt.sub+'</div></div>'+
        '<div class="tags">'+tags+'</div></div>';
      if(sel){
        var clash=clashLabel();
        if(clash){
          var w=document.createElement("div");w.className="warn";
          w.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'+
            '<div class="wt">You trained <b>'+clash+'</b> yesterday. Muscles rebuild in the ~48h between sessions — back-to-back doesn\'t give them that. Consider a different group, cardio, the bag, or mobility today.</div>';
          el.appendChild(w);
        }
        var wrap=document.createElement("div");wrap.className="exwrap";
        wrap.addEventListener("click",function(e){e.stopPropagation();});
        var hint=document.createElement("div");hint.className="exhint";
        hint.innerHTML='Sets × reps — e.g. <b>3×10</b> means 3 sets of 10. Tap <i>i</i> on any move for how to do it.';
        wrap.appendChild(hint);
        opt.items.forEach(function(it,idx){
          var id=opt.id+"_"+idx,checked=!!r.done[id],lift=isLift(opt,it),key=movementKey(it.n);
          var item=document.createElement("div");item.className="exitem";
          var wtHTML="";
          if(lift){
            var arr=liftArr(key),last=arr.length?arr[arr.length-1]:null,sug=liftSuggestion(key,it.n),tgt=parseTarget(it.n);
            var hit=last?entryHit(last,tgt.top):false;
            var lastTxt=last?('Last: <b>'+last.w+' lb</b> — '+repsText(last)+(hit?' <span class="ok">✓</span>':'')):'No weight logged';
            var sugTxt=sug?('<span class="wt-sug'+(sug.up?' up':'')+'">'+(sug.up?'↑ ':'')+sug.text+'</span>'):'';
            var trendBtn=arr.length>=2?'<button class="wt-trend" type="button" aria-label="Show weight trend">📈</button>':'';
            var repInputs="";for(var s=0;s<tgt.sets;s++){var rv=(last&&last.reps&&last.reps[s]!=null)?last.reps[s]:tgt.top;
              repInputs+='<input type="number" class="rep" inputmode="numeric" value="'+rv+'" aria-label="Set '+(s+1)+' reps">';}
            wtHTML='<div class="wtline"><span class="wt-last">'+lastTxt+'</span>'+sugTxt+trendBtn+
              '<button class="wt-log">'+(last?'Update':'Log weight')+'</button></div>'+
              '<div class="wt-chart-wrap hide"><canvas class="wt-chart"></canvas></div>'+
              '<div class="wt-form hide">'+
                '<div class="wt-frow"><input type="number" class="wt-input" inputmode="decimal" step="0.5" placeholder="lbs"'+(last?' value="'+last.w+'"':'')+'><span class="wt-x">lb used</span></div>'+
                '<div class="wt-frow"><span class="wt-replbl">reps per set · target '+tgt.sets+'×'+tgt.top+'</span>'+repInputs+'</div>'+
                '<div class="wt-frow"><button class="btn wt-save" type="button">Save</button><button class="mini wt-cancel" type="button">cancel</button></div>'+
              '</div>';
          }
          item.innerHTML='<div class="ex">'+
            '<span class="box'+(checked?" on":"")+'" role="checkbox" tabindex="0" aria-checked="'+(checked?"true":"false")+'"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>'+
            '<span class="txt'+(checked?" done":"")+'">'+it.n+'</span>'+
            (it.d?'<button class="info" tabindex="0" aria-label="How to do this move">i</button>':'')+
            '</div>'+wtHTML+
            (it.d?'<div class="exdesc hide">'+it.d+'</div>':'');
          var box=item.querySelector(".box"),txt=item.querySelector(".txt");
          function tog(){var rr=dayRec(),now=!rr.done[id];if(now)rr.done[id]=1;else delete rr.done[id];save();
            box.classList[now?"add":"remove"]("on");box.setAttribute("aria-checked",now?"true":"false");txt.classList[now?"add":"remove"]("done");refreshBalance();}
          box.addEventListener("click",function(e){tog();});
          box.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();tog();}});
          txt.addEventListener("click",function(e){tog();});
          var info=item.querySelector(".info");
          if(info){var desc=item.querySelector(".exdesc");
            function tgl(){desc.classList.toggle("hide");info.classList.toggle("open");}
            info.addEventListener("click",tgl);
            info.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();tgl();}});
          }
          if(lift){
            var wform=item.querySelector(".wt-form"),wlog=item.querySelector(".wt-log"),
                winput=item.querySelector(".wt-input"),wsave=item.querySelector(".wt-save"),
                wcancel=item.querySelector(".wt-cancel"),repEls=item.querySelectorAll(".rep"),
                trend=item.querySelector(".wt-trend"),cwrap=item.querySelector(".wt-chart-wrap"),cvs=item.querySelector(".wt-chart");
            wlog.addEventListener("click",function(){wform.classList.toggle("hide");if(!wform.classList.contains("hide"))winput.focus();});
            wcancel.addEventListener("click",function(){wform.classList.add("hide");});
            function doSave(){var w=parseFloat(winput.value);if(!(w>0)){winput.focus();return;}
              var rr=[];Array.prototype.forEach.call(repEls,function(inp){var v=parseInt(inp.value,10);rr.push(v>=0?v:0);});
              logLift(key,w,rr);renderMenu();}
            wsave.addEventListener("click",doSave);
            winput.addEventListener("keydown",function(e){if(e.key==="Enter")doSave();});
            Array.prototype.forEach.call(repEls,function(inp){inp.addEventListener("keydown",function(e){if(e.key==="Enter")doSave();});});
            if(trend){trend.addEventListener("click",function(){cwrap.classList.toggle("hide");trend.classList.toggle("on");
              if(!cwrap.classList.contains("hide"))drawLiftChart(cvs,liftArr(key));});}
          }
          wrap.appendChild(item);
        });
        el.appendChild(wrap);
      }
      function pick(){var rr=dayRec();rr.pick=(rr.pick===opt.id)?null:opt.id;save();renderMenu();}
      el.addEventListener("click",pick);
      el.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();pick();}});
      menu.appendChild(el);
    });
    updateRecent();renderHistory();renderActivity();
  }
  function updateRecent(){
    var n=0;winKeys().forEach(function(k){if(dayDone(getDay(k)))n++;});
    document.getElementById("wkDone").innerHTML="<b>"+n+"</b> workout"+(n===1?"":"s")+" logged in the last 2 weeks";
  }

  // ---- HISTORY (weekly, Monday start) ----
  var WD=["M","T","W","T","F","S","S"],editKey=null;
  var TYPEINFO={
    legs:{c:"Legs",col:"#0E9D6B"},push:{c:"Push",col:"#3E77A8"},pull:{c:"Pull",col:"#6C6FBF"},
    full:{c:"Full",col:"#12A97A"},bag:{c:"Bag",col:"#C77F2A"},cardio:{c:"Cardio",col:"#2E93A3"},yoga:{c:"Yoga",col:"#8A7CB0"}
  };
  function histWeek(monday,title){
    var cells="",lifts=0,first,last;
    for(var i=0;i<7;i++){
      var d=new Date(monday);d.setDate(d.getDate()+i);var key=iso(d);
      if(i===0)first=d;last=d;
      var isFuture=d>TODAY_D,isToday=key===today,r=getDay(key),done=dayDone(r);
      var body;
      if(done&&r.pick&&TYPEINFO[r.pick]){var ti=TYPEINFO[r.pick];body='<span class="pill" style="background:'+ti.col+'">'+ti.c+'</span>';lifts++;}
      else body=isFuture?'<span class="rest">·</span>':'<span class="rest">–</span>';
      var edit=isFuture?"":" editable",attrs=isFuture?"":(' data-key="'+key+'" tabindex="0" role="button" aria-label="Edit '+key+'"');
      cells+='<div class="hd'+(isToday?" today":"")+(isFuture?" future":"")+edit+'"'+attrs+'><span class="wd">'+WD[i]+'</span><span class="dn">'+(d.getMonth()+1)+'/'+d.getDate()+'</span>'+body+'</div>';
    }
    var range=(first.getMonth()+1)+'/'+first.getDate()+' – '+(last.getMonth()+1)+'/'+last.getDate();
    return '<div class="histweek"><div class="hw-h">'+title+'<span>'+range+' · '+lifts+' session'+(lifts===1?'':'s')+'</span></div><div class="hw-days">'+cells+'</div></div>';
  }
  function renderHistory(){
    var host=document.getElementById("history"),tm=mondayOf(TODAY_D),lm=new Date(tm);lm.setDate(lm.getDate()-7);
    host.innerHTML='<div class="hist-h">History · 2 weeks (Mon start)</div>'+
      '<div class="hist-hint">Tap any day to log or change what you did.</div>'+
      histWeek(tm,"This week")+histWeek(lm,"Last week");
    Array.prototype.forEach.call(host.querySelectorAll(".hd.editable"),function(el){
      el.addEventListener("click",function(){openDayEdit(el.dataset.key);});
      el.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();openDayEdit(el.dataset.key);}});
    });
    renderDayEdit();
  }

  // ---- TAP-TO-EDIT A DAY ----
  function openDayEdit(key){editKey=(editKey===key)?null:key;renderDayEdit();
    if(editKey){var h=document.getElementById("dayEdit");if(h)h.scrollIntoView({behavior:"smooth",block:"nearest"});}}
  function renderDayEdit(){
    var host=document.getElementById("dayEdit");
    if(!editKey){host.innerHTML="";return;}
    var d=new Date(editKey+"T00:00:00");
    var title=d.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"});
    var r=getDay(editKey),cur=(r&&dayDone(r))?r.pick:null;
    var btns=MENU.map(function(o){var ti=TYPEINFO[o.id];
      return '<button data-opt="'+o.id+'" class="'+(cur===o.id?"on":"")+'"><span class="cd" style="background:'+ti.col+'"></span>'+o.name+'</button>';}).join("");
    host.innerHTML='<div class="dayedit"><h5>Log workout</h5><div class="de-sub">'+title+(editKey===today?" · today":"")+'</div>'+
      '<div class="opts">'+btns+'</div>'+
      '<div class="row"><button class="mini" id="deClear">mark as rest / clear</button><button class="mini" id="deCancel">cancel</button></div></div>';
    Array.prototype.forEach.call(host.querySelectorAll(".opts button"),function(b){b.addEventListener("click",function(){setDay(editKey,b.dataset.opt);});});
    document.getElementById("deClear").addEventListener("click",function(){clearDay(editKey);});
    document.getElementById("deCancel").addEventListener("click",function(){editKey=null;renderDayEdit();});
  }
  function setDay(key,optId){var o=optById(optId);if(!o)return;var r=dayRec(key);r.pick=optId;r.done={};
    o.items.forEach(function(it,idx){r.done[optId+"_"+idx]=1;});save();editKey=null;renderMenu();}
  function clearDay(key){if(state.days[key]){state.days[key].pick=null;state.days[key].done={};}save();editKey=null;renderMenu();}

  // ---- REFERENCE ----
  var srcList=document.getElementById("srcList");
  SOURCES.forEach(function(s){var row=document.createElement("div");row.className="src";row.innerHTML="<b>"+s.n+"</b><span class='g'>"+s.g+" g</span>";srcList.appendChild(row);});
  var phaseRef=document.getElementById("phaseRef");
  ["menstrual","follicular","ovulation","luteal"].forEach(function(k){var p=PHASE[k];
    var row=document.createElement("div");row.className="prow";
    row.innerHTML='<span class="pn" style="color:'+p.color+'">'+p.label+'</span><span class="pd">'+p.tip+'</span>';phaseRef.appendChild(row);});
  var foodRef=document.getElementById("foodRef");
  ["menstrual","follicular","ovulation","luteal"].forEach(function(k){var p=PHASE[k];
    var row=document.createElement("div");row.className="prow";
    row.innerHTML='<span class="pn" style="color:'+p.color+'">'+p.label+'</span><span class="pd">'+p.foodLong+'</span>';foodRef.appendChild(row);});

  // ---- THEME ----
  var tBtn=document.getElementById("themeBtn");
  function currentDark(){var a=document.documentElement.getAttribute("data-theme");if(a)return a==="dark";return window.matchMedia("(prefers-color-scheme: dark)").matches;}
  tBtn.addEventListener("click",function(){document.documentElement.setAttribute("data-theme",currentDark()?"light":"dark");drawChart();});
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(){if(!document.documentElement.getAttribute("data-theme"))drawChart();});

  // ---- PLATE CALCULATOR ----
  function calcPlates(){
    var t=parseFloat(document.getElementById("plTarget").value),bar=parseFloat(document.getElementById("plBar").value),out=document.getElementById("plOut");
    if(!(t>0)){out.innerHTML="Enter a weight above.";return;}
    if(bar>0){
      var per=(t-bar)/2;
      if(per<0){out.innerHTML="That's below the bar itself ("+bar+" lb).";return;}
      if(per===0){out.innerHTML="Just the empty <b>"+bar+" lb</b> bar — no plates.";return;}
      var plates=[45,35,25,10,5,2.5],rem=per,used=[];
      plates.forEach(function(p){while(rem>=p-1e-9){used.push(p);rem=Math.round((rem-p)*10)/10;}});
      var chips=used.map(function(p){return '<span class="pchip">'+p+'</span>';}).join("");
      var note=rem>0?'<span class="prem">Can\'t make it exactly with standard plates — closest is '+(t-2*rem)+' lb.</span>':'';
      out.innerHTML='<div class="pperside">Each side · '+bar+' lb bar</div><div class="pchips">'+chips+'</div>'+note;
    }else{out.innerHTML="Set each dumbbell to <b>"+t+" lb</b>.";}
  }
  document.getElementById("plTarget").addEventListener("input",calcPlates);
  document.getElementById("plBar").addEventListener("change",calcPlates);

  // ---- BACKUP & RESTORE ----
  function renderAll(){renderHero();drawChart();renderProtein();renderSteps();renderFoods();renderCycle();renderMenu();}
  document.getElementById("bkExport").addEventListener("click",function(){
    document.getElementById("bkExportText").value=JSON.stringify(state);
    document.getElementById("bkExportBox").classList.remove("hide");
    document.getElementById("bkImportBox").classList.add("hide");
    document.getElementById("bkExportText").focus();document.getElementById("bkExportText").select();
  });
  document.getElementById("bkImportBtn").addEventListener("click",function(){
    document.getElementById("bkImportBox").classList.toggle("hide");
    document.getElementById("bkExportBox").classList.add("hide");
  });
  document.getElementById("bkImportCancel").addEventListener("click",function(){document.getElementById("bkImportBox").classList.add("hide");});
  document.getElementById("bkCopy").addEventListener("click",function(){
    var t=document.getElementById("bkExportText");t.select();
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t.value).catch(function(){});}
    else{try{document.execCommand("copy");}catch(e){}}
    this.textContent="Copied ✓";var b=this;setTimeout(function(){b.textContent="Copy to clipboard";},1500);
  });
  document.getElementById("bkDownload").addEventListener("click",function(){
    try{
      var blob=new Blob([JSON.stringify(state)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
      a.href=url;a.download="reforge-backup-"+today+".json";document.body.appendChild(a);a.click();
      setTimeout(function(){URL.revokeObjectURL(url);a.remove();},120);
    }catch(e){document.getElementById("bkExport").click();}
  });
  document.getElementById("bkRestore").addEventListener("click",function(){
    var msg=document.getElementById("bkMsg");
    try{
      var data=JSON.parse(document.getElementById("bkImportText").value);
      if(!data||typeof data!=="object"||!data.days)throw new Error("bad");
      state=data;
      if(!state.days)state.days={};if(!state.lifts)state.lifts={};if(!state.weights)state.weights=seedWeights();
      if(!state.cycle)state.cycle={mode:null,phase:null,start:null,length:28};
      if(!state.nutri)state.nutri={start:today,tgt:{veg:5,fruit:2,fish:2,beans:3}};
      if(!state.nutri.tgt)state.nutri.tgt={veg:5,fruit:2,fish:2,beans:3};
      if(state.pTarget==null)state.pTarget=150;if(state.sTarget==null)state.sTarget=8000;
      save();renderAll();
      msg.className="bk-msg ok";msg.textContent="Restored ✓";
    }catch(e){msg.className="bk-msg err";msg.textContent="That doesn't look like a valid backup.";}
  });

  // ---- INIT ----
  function setStatus(){
    var el=document.getElementById("storeStatus");
    if(sync)el.innerHTML="☁ Cloud sync on — saved to your account and synced across your devices.";
    else if(cacheOK)el.innerHTML="✓ Saving on this device. Add your Supabase keys (see setup) to sync across devices.";
    else el.innerHTML="⚠ Storage is blocked here, so entries last only this session — open the app in its own tab, or use Export backup.";
  }
  setStatus();
  document.getElementById("todayLbl").textContent=new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
  renderHero();drawChart();renderProtein();renderSteps();renderFoods();renderCycle();renderMenu();

  // Cloud: pull the latest doc, then apply live updates from other devices.
  if(sync){
    var applyRemote=function(doc){
      if(!doc)return;
      if(JSON.stringify(doc)===lastSaved)return;   // ignore our own echo
      state=normalize(doc);cacheSave();renderAll();setStatus();
    };
    sync.load().then(function(doc){if(doc)applyRemote(doc);}).catch(function(){});
    sync.subscribe(applyRemote);
  }

  var rt;window.addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(drawChart,120);});
})();
