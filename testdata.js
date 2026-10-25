(function() {
  'use strict';

  function localStr(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function daysAgo(n) { var d=new Date(); d.setDate(d.getDate()-n); return localStr(d); }
  function daysFromNow(n) { var d=new Date(); d.setDate(d.getDate()+n); return localStr(d); }
  function monthsFromNow(n) { var d=new Date(); d.setMonth(d.getMonth()+n); return localStr(d); }

  function seedTestData() {
    var todayStr = localStr(new Date());
    var now = new Date();
    var dow = now.getDay();
    var daysFromMon = dow === 0 ? 6 : dow - 1;

    function weekDatesArr() {
      var arr = [];
      for (var wi = 0; wi < 7; wi++) {
        var wd = new Date(now); wd.setDate(now.getDate() - daysFromMon + wi);
        arr.push(localStr(wd));
      }
      return arr;
    }
    var weekDates = weekDatesArr();

    function mondayISO(offsetWeeks) {
      var d = new Date(now);
      d.setDate(now.getDate() - daysFromMon + offsetWeeks * 7);
      return localStr(d);
    }

    // ── Weight log ──────────────────────────────────────────────────────────
    var baseWeights = [73.2, 73.0, 72.9, 72.8, 72.8, 72.7, 72.6];
    var weightLog = baseWeights.map(function(kg, i) {
      return { date: daysAgo(6 - i), kg: kg, timeOfDay: 'morning' };
    });

    // ── Recipes ─────────────────────────────────────────────────────────────
    var recipes = [
      {
        id: 1, name: 'Protein Smoothie', servings: 2,
        ingredients: [
          {name:'Whey protein powder', grams:60,  macros:{calories:240, protein:48, carbs:6,  fat:4,  fiber:0}},
          {name:'Banana (frozen)',     grams:200, macros:{calories:178, protein:2,  carbs:46, fat:0,  fiber:5}},
          {name:'Almond milk',         grams:400, macros:{calories:56,  protein:2,  carbs:4,  fat:5,  fiber:0}},
          {name:'Peanut butter',       grams:30,  macros:{calories:180, protein:8,  carbs:4,  fat:16, fiber:2}},
        ],
        macros:{calories:654, protein:60, carbs:60, fat:25, fiber:7},
        tags:['High protein','Quick meal'],
      },
      {
        id: 2, name: 'Chicken & Rice Bowl', servings: 2,
        ingredients: [
          {name:'Chicken breast (cooked)', grams:280, macros:{calories:336, protein:62, carbs:0,  fat:7,  fiber:0}},
          {name:'Brown rice (cooked)',     grams:320, macros:{calories:416, protein:9,  carbs:86, fat:3,  fiber:5}},
          {name:'Edamame',                 grams:100, macros:{calories:122, protein:11, carbs:10, fat:5,  fiber:5}},
          {name:'Sesame oil',              grams:10,  macros:{calories:88,  protein:0,  carbs:0,  fat:10, fiber:0}},
        ],
        macros:{calories:962, protein:82, carbs:96, fat:25, fiber:10},
        tags:['High protein','Gluten free'],
      },
      {
        id: 3, name: 'Bolognese', servings: 4,
        ingredients: [
          {name:'Lean beef mince',       grams:500, macros:{calories:740, protein:100, carbs:0,   fat:30, fiber:0}},
          {name:'Penne pasta (cooked)',  grams:400, macros:{calories:560, protein:20,  carbs:112, fat:3,  fiber:6}},
          {name:'Tomato passata',        grams:400, macros:{calories:120, protein:4,   carbs:20,  fat:1,  fiber:4}},
          {name:'Onion',                 grams:150, macros:{calories:60,  protein:2,   carbs:14,  fat:0,  fiber:2}},
        ],
        macros:{calories:1480, protein:126, carbs:146, fat:34, fiber:12},
        tags:['High protein','High fibre'],
      },
      {
        id: 4, name: 'Avocado Toast', servings: 2,
        ingredients: [
          {name:'Wholegrain bread',    grams:140, macros:{calories:350, protein:14, carbs:58, fat:6,  fiber:8}},
          {name:'Avocado',             grams:160, macros:{calories:256, protein:3,  carbs:14, fat:23, fiber:7}},
          {name:'Eggs (scrambled)',    grams:120, macros:{calories:186, protein:14, carbs:0,  fat:14, fiber:0}},
          {name:'Cherry tomatoes',     grams:100, macros:{calories:18,  protein:1,  carbs:4,  fat:0,  fiber:1}},
        ],
        macros:{calories:810, protein:32, carbs:76, fat:43, fiber:16},
        tags:['Vegetarian','Quick meal'],
      },
    ];

    function perServe(r) {
      var s = r.servings || 1;
      return {
        calories: Math.round(r.macros.calories / s),
        protein:  Math.round(r.macros.protein  / s * 10) / 10,
        carbs:    Math.round(r.macros.carbs    / s * 10) / 10,
        fat:      Math.round(r.macros.fat      / s * 10) / 10,
        fiber:    Math.round(r.macros.fiber    / s * 10) / 10,
      };
    }
    var smoothieServe    = perServe(recipes[0]);
    var chickenRiceServe = perServe(recipes[1]);
    var bologneseServe   = perServe(recipes[2]);
    var avocadoServe     = perServe(recipes[3]);

    // ── Diary ────────────────────────────────────────────────────────────────
    var logs = {};
    logs[todayStr] = {
      water: 1500,
      meals: [
        {name:'Rolled Oats with Honey', meal:'Breakfast',       serving:90,  calories:330, protein:12, carbs:66, fat:6,  fiber:9, time:todayStr+'T07:30:00.000Z'},
        {name:'Banana, medium',         meal:'Morning Snack',   serving:118, calories:105, protein:1,  carbs:27, fat:0,  fiber:3, time:todayStr+'T10:00:00.000Z'},
        Object.assign({name:'Chicken & Rice Bowl', meal:'Lunch',  serving:chickenRiceServe.calories, recipeId:2, time:todayStr+'T12:30:00.000Z'}, chickenRiceServe),
        {name:'Trim Flat White',        meal:'Afternoon Snack', serving:250, calories:120, protein:9,  carbs:11, fat:2,  source:'Custom', fiber:0, time:todayStr+'T15:00:00.000Z'},
        {name:'Seared Salmon Fillet',   meal:'Dinner',          serving:130, calories:204, protein:30, carbs:0,  fat:9,  fiber:0, time:todayStr+'T18:30:00.000Z'},
      ]
    };
    var yesterday = daysAgo(1);
    logs[yesterday] = {
      water: 1800,
      meals: [
        Object.assign({name:'Protein Smoothie',  meal:'Breakfast',       serving:smoothieServe.calories,    recipeId:1, time:yesterday+'T07:00:00.000Z'}, smoothieServe),
        {name:'Blueberries',                     meal:'Morning Snack',   serving:150, calories:86,  protein:1,  carbs:21, fat:1,  fiber:4, time:yesterday+'T10:30:00.000Z'},
        Object.assign({name:'Avocado Toast',     meal:'Lunch',           serving:avocadoServe.calories,     recipeId:4, time:yesterday+'T13:00:00.000Z'}, avocadoServe),
        {name:'Vogels Crispbread & Almond Butter', meal:'Afternoon Snack', serving:60, calories:200, protein:6, carbs:20, fat:11, source:'Custom', fiber:3, time:yesterday+'T15:30:00.000Z'},
        {name:'Countdown Butter Chicken',        meal:'Dinner',          serving:350, calories:455, protein:32, carbs:42, fat:18, fiber:4, time:yesterday+'T18:30:00.000Z'},
      ]
    };
    var fiveDaysAgo = daysAgo(5);
    logs[fiveDaysAgo] = {
      water: 2000,
      meals: [
        {name:'Greek Yogurt with Mixed Berries', meal:'Breakfast',       serving:300, calories:214, protein:19, carbs:26, fat:4,  fiber:4, time:fiveDaysAgo+'T07:30:00.000Z'},
        {name:'Apple, medium',                   meal:'Morning Snack',   serving:182, calories:95,  protein:0,  carbs:25, fat:0,  fiber:4, time:fiveDaysAgo+'T10:00:00.000Z'},
        {name:"Mum's Frittata",                  meal:'Lunch',           serving:200, calories:280, protein:16, carbs:8,  fat:20, source:'Custom', fiber:1, time:fiveDaysAgo+'T12:30:00.000Z'},
        {name:'Walnuts',                         meal:'Afternoon Snack', serving:30,  calories:196, protein:5,  carbs:4,  fat:19, fiber:2, time:fiveDaysAgo+'T15:00:00.000Z'},
        Object.assign({name:'Bolognese',         meal:'Dinner',          serving:bologneseServe.calories, recipeId:3, time:fiveDaysAgo+'T18:30:00.000Z'}, bologneseServe),
        {name:'Whittakers Dark Chocolate',       meal:'Evening Snack',   serving:30,  calories:160, protein:2,  carbs:17, fat:10, fiber:1, time:fiveDaysAgo+'T21:00:00.000Z'},
      ]
    };

    // ── Custom foods ─────────────────────────────────────────────────────────
    var customFoods = [
      {id:'CF_001', name:'Trim Flat White',                    brand:'Café',     source:'Custom', per100g:{calories:48,  protein:3.6, carbs:4.4, fat:0.8, fibre:0},   createdAt:daysAgo(10)+'T09:00:00.000Z'},
      {id:'CF_002', name:'Vogels Crispbread & Almond Butter',  brand:'Homemade', source:'Custom', per100g:{calories:333, protein:10,  carbs:33,  fat:18,  fibre:5},   createdAt:daysAgo(7)+'T12:00:00.000Z'},
      {id:'CF_003', name:"Mum's Frittata",                     brand:'Homemade', source:'Custom', per100g:{calories:140, protein:8,   carbs:4,   fat:10,  fibre:0.5}, createdAt:daysAgo(14)+'T18:00:00.000Z'},
    ];

    // ── Meal plan ────────────────────────────────────────────────────────────
    var mealPlan = {};
    mealPlan[weekDates[0]] = {Breakfast:'Protein Smoothie',   Lunch:'Chicken & Rice Bowl', Dinner:'Bolognese'};
    mealPlan[weekDates[1]] = {Breakfast:'Avocado Toast',      Lunch:'Bolognese',           Dinner:'Chicken & Rice Bowl'};
    mealPlan[weekDates[2]] = {Breakfast:'Protein Smoothie',   Lunch:'Avocado Toast',       Dinner:'Bolognese'};
    mealPlan[weekDates[3]] = {Breakfast:'Avocado Toast',      Lunch:'Chicken & Rice Bowl', Dinner:'Protein Smoothie'};
    mealPlan[weekDates[4]] = {Breakfast:'Protein Smoothie',   Lunch:'Bolognese'};
    mealPlan[weekDates[5]] = {Lunch:'Chicken & Rice Bowl',    Dinner:'Avocado Toast'};

    // ── Fast log ─────────────────────────────────────────────────────────────
    var fastLog = [
      {id:'F001', start:daysAgo(7)+'T19:00:00.000', end:daysAgo(6)+'T11:00:00.000', protocol:'16:8', hours:16, lengthHours:16},
      {id:'F002', start:daysAgo(4)+'T19:30:00.000', end:daysAgo(3)+'T11:30:00.000', protocol:'16:8', hours:16, lengthHours:16},
      {id:'F003', start:daysAgo(2)+'T20:00:00.000', end:daysAgo(1)+'T12:00:00.000', protocol:'16:8', hours:16, lengthHours:16},
    ];

    // ── Cycle log ────────────────────────────────────────────────────────────
    var cycleLog = [
      {start: daysAgo(33), end: daysAgo(28)},
      {start: daysAgo(9),  end: daysAgo(4)},
    ];

    // ── Saved workouts ───────────────────────────────────────────────────────
    var swUpperA = 'sw-upper-a';
    var swLowerA = 'sw-lower-a';
    var swAbs    = 'sw-abs-thighs';
    var swCardio = 'sw-cardio';

    var savedWorkouts = [
      {
        id: swUpperA, name: 'Upper A',
        exercises: [
          {name:'Bench Press',     type:'lift',       target:'4 × 6–10'},
          {name:'Barbell Row',     type:'lift',       target:'4 × 8–10'},
          {name:'Overhead Press',  type:'lift',       target:'3 × 10'},
          {name:'Lateral Raise',   type:'bodyweight', metric:'reps', target:'3 × 15'},
          {name:'Tricep Pushdown', type:'lift',       target:'3 × 12'},
        ],
      },
      {
        id: swLowerA, name: 'Lower A',
        exercises: [
          {name:'Squat',              type:'lift',       target:'4 × 6–8'},
          {name:'Romanian Deadlift',  type:'lift',       target:'3 × 10'},
          {name:'Leg Press',          type:'lift',       target:'3 × 12'},
          {name:'Side Plank',         type:'timed-hold', target:'3 × 30s'},
          {name:'Single Calf Raise L',type:'rehab'},
          {name:'Single Calf Raise R',type:'rehab'},
        ],
      },
      {
        id: swAbs, name: 'Abs & Thighs',
        exercises: [
          {name:'Sit Ups',     type:'bodyweight', metric:'reps', target:'3 × AMRAP'},
          {name:'Leg Raise',   type:'bodyweight', metric:'reps', target:'3 × 15'},
          {name:'Crunches',    type:'bodyweight', metric:'reps', target:'3 × 20'},
          {name:'Side Plank',  type:'timed-hold', target:'30s each side'},
        ],
      },
      {
        id: swCardio, name: 'Morning Cardio',
        exercises: [
          {name:'Morning Run',  type:'cardio-distance'},
          {name:'Groove',       type:'cardio-duration'},
        ],
      },
    ];

    // ── Workout schedule ─────────────────────────────────────────────────────
    var thisWeekISO = mondayISO(0);
    var nextWeekISO = mondayISO(1);
    var workoutSchedule = {};
    workoutSchedule[thisWeekISO] = {0:swUpperA, 1:'rest', 2:swLowerA, 3:swAbs, 4:swUpperA, 5:swCardio, 6:'rest'};
    workoutSchedule[nextWeekISO] = {0:swLowerA, 1:'rest', 2:swUpperA, 3:swAbs, 4:swLowerA, 5:swCardio, 6:'rest'};

    // ── Workout templates ────────────────────────────────────────────────────
    var workoutTemplates = [
      {
        id: 'tmpl-q4', name: 'Q4 Programme', savedAt: daysAgo(7),
        week: {0:swUpperA, 1:'rest', 2:swLowerA, 3:swAbs, 4:swUpperA, 5:swCardio, 6:'rest'},
      },
    ];

    // ── Workout log ──────────────────────────────────────────────────────────
    var workoutLog = {};
    function liftSession(date, workoutName, benchKg, sqKg, ohpKg) {
      return {
        name: workoutName,
        startTime: new Date(date+'T07:30:00').getTime(),
        endTime:   new Date(date+'T08:25:00').getTime(),
        exercises: [
          {name:'Bench Press', type:'lift', sets:[
            {kg:benchKg,     reps:8, done:true},
            {kg:benchKg,     reps:8, done:true},
            {kg:benchKg+2.5, reps:7, done:true},
            {kg:benchKg+2.5, reps:6, done:true},
          ]},
          {name:'Barbell Row', type:'lift', sets:[
            {kg:benchKg-5,   reps:10, done:true},
            {kg:benchKg-5,   reps:9,  done:true},
            {kg:benchKg-2.5, reps:8,  done:true},
            {kg:benchKg-2.5, reps:8,  done:true},
          ]},
          {name:'Overhead Press', type:'lift', sets:[
            {kg:ohpKg,     reps:10, done:true},
            {kg:ohpKg,     reps:10, done:true},
            {kg:ohpKg+2.5, reps:8,  done:true},
          ]},
          {name:'Lateral Raise', type:'bodyweight', metric:'reps', sets:[
            {value:15, done:true},
            {value:15, done:true},
            {value:12, done:true},
          ]},
        ],
      };
    }
    function lowerSession(date, sqKg) {
      return {
        name: 'Lower A',
        startTime: new Date(date+'T07:30:00').getTime(),
        endTime:   new Date(date+'T08:30:00').getTime(),
        exercises: [
          {name:'Squat', type:'lift', sets:[
            {kg:sqKg,     reps:8, done:true},
            {kg:sqKg,     reps:8, done:true},
            {kg:sqKg+2.5, reps:7, done:true},
            {kg:sqKg+2.5, reps:6, done:true},
          ]},
          {name:'Romanian Deadlift', type:'lift', sets:[
            {kg:sqKg-10,  reps:10, done:true},
            {kg:sqKg-10,  reps:10, done:true},
            {kg:sqKg-7.5, reps:9,  done:true},
          ]},
          {name:'Side Plank', type:'timed-hold', sets:[
            {seconds:30, done:true},
            {seconds:30, done:true},
            {seconds:25, done:true},
          ]},
          {name:'Single Calf Raise L', type:'rehab', rounds:3},
          {name:'Single Calf Raise R', type:'rehab', rounds:3},
        ],
      };
    }
    var benchStart = 52.5, sqStart = 67.5, ohpStart = 32.5;
    for (var wk = 5; wk >= 0; wk--) {
      var monOff = daysFromMon + wk * 7;
      var monDate = daysAgo(monOff);
      var wedDate = daysAgo(monOff - 2);
      var friDate = daysAgo(monOff - 4);
      var prog = (5 - wk);
      var benchKg = benchStart + prog * 2.5;
      var sqKg    = sqStart    + prog * 2.5;
      var ohpKg   = ohpStart   + prog * 1.25;
      if (monOff > 0)  workoutLog[monDate] = liftSession(monDate,  'Upper A', benchKg, sqKg, ohpKg);
      if (monOff > -2) workoutLog[wedDate] = lowerSession(wedDate, sqKg);
      if (monOff > -4) workoutLog[friDate] = liftSession(friDate,  'Upper A', benchKg + 1.25, sqKg, ohpKg);
    }
    workoutLog[daysAgo(1)] = lowerSession(daysAgo(1), sqStart + 5 * 2.5 + 2.5);
    workoutLog[daysAgo(3)] = {
      name: 'Morning Cardio',
      startTime: new Date(daysAgo(3)+'T06:45:00').getTime(),
      endTime:   new Date(daysAgo(3)+'T07:35:00').getTime(),
      exercises: [
        {name:'Morning Run', type:'cardio-distance', distanceKm:4.2, timeSeconds:1470, paceSecPerKm:350},
        {name:'Groove',      type:'cardio-duration', timeSeconds:1800, notes:'7:00–7:30am'},
      ],
    };

    // ── Goals ────────────────────────────────────────────────────────────────
    var goals = [
      {id:1, type:'weight', target:65, unit:'kg', date:monthsFromNow(6), note:'Slow and steady',
       milestones:[
         {id:1,label:'Hit 72kg',done:true},
         {id:2,label:'Hit 70kg',done:false},
         {id:3,label:'Hit 67kg',done:false},
       ]},
      {id:2, type:'workouts', target:3, unit:'sessions/wk', date:monthsFromNow(3), note:'',
       milestones:[
         {id:1,label:'First month consistent',done:true},
         {id:2,label:'Increase bench to 80kg',done:false},
       ]},
      {id:3, type:'nutrition', target:1800, unit:'kcal/day', date:'', note:'Focus on protein',
       milestones:[{id:1,label:'Hit target 5 days/week for a month',done:false}]},
      {id:4, type:'water', target:2.0, unit:'L/day', date:'', note:'',
       milestones:[{id:1,label:'Hit goal 7 days straight',done:false},{id:2,label:'Make it a habit for 30 days',done:false}]},
      {id:5, type:'fasting', target:16, unit:'h/day', date:monthsFromNow(2), note:'16:8 protocol',
       milestones:[{id:1,label:'30-day streak',done:false},{id:2,label:'Hit 18h on 3 days',done:false}]},
    ];

    // ── Weekly reviews ───────────────────────────────────────────────────────
    var weeklyReviews = [
      {
        id:1, type:'weekly', date:daysAgo(21),
        wentWell:'Hit protein goal 5/7 days. Good energy in workouts.',
        wentBadly:'Missed one workout on Thursday.',
        nsv:'Lifted 5kg more on squats — new PB!',
        workoutSessions:3, workoutFeeling:'strong',
        avgCals:1740, avgProtein:132, nutritionFeeling:'good',
        waterDays:5, fastCount:4, focus:'Keep the workout streak going, aim for 4 sessions next week.',
      },
      {
        id:2, type:'weekly', date:daysAgo(42),
        wentWell:'Consistent meal prep. Hit water goal 6/7 days.',
        wentBadly:'Weekend nutrition slipped a bit.',
        nsv:'Clothes feeling looser.',
        workoutSessions:3, workoutFeeling:'good',
        avgCals:1820, avgProtein:128, nutritionFeeling:'okay',
        waterDays:6, fastCount:5, focus:'Stay disciplined on weekends.',
      },
      {
        id:3, type:'weekly', date:daysAgo(63),
        wentWell:'Overall consistency improving. Hit gym 4 times.',
        wentBadly:'Protein still below goal some days.',
        nsv:'Down 1.8kg over the month.',
        workoutSessions:4, workoutFeeling:'okay',
        avgCals:1760, avgProtein:130, nutritionFeeling:'good',
        waterDays:5, fastCount:4, focus:'Hit 140g protein daily and add one extra workout per week.',
      },
    ];

    // ── Active fast ──────────────────────────────────────────────────────────
    var tenHoursAgo = new Date(Date.now() - 10*3600000).toISOString();
    var activeFast = { start: tenHoursAgo, protocol: '16:8', lengthHours: 16 };

    // ── Build and persist state ──────────────────────────────────────────────
    var state = {
      onboardingComplete: true,
      profile: { name:'Alix', height:168, dob:'1990-03-15' },
      goalWeight: 65,
      goalDate: monthsFromNow(3),
      targets: { calories:1800, protein:135, carbs:185, fat:60, fibre:25, water:2000, macroMode:'auto', macroSplit:'balanced', nutritionDaysPerWeek:5 },
      weightLog: weightLog,
      logs: logs,
      customFoods: customFoods,
      savedWorkouts: savedWorkouts,
      workoutLog: workoutLog,
      workoutSchedule: workoutSchedule,
      workoutTemplates: workoutTemplates,
      activeSession: null,
      fastLog: fastLog,
      activeFast: activeFast,
      fastingProtocol: '16:8',
      lastFastProtocol: '16:8',
      cycleLog: cycleLog,
      recipes: recipes,
      mealPlan: mealPlan,
      goals: goals,
      weeklyReviews: weeklyReviews,
      reviews: weeklyReviews,
      streak: 6,
      fastStreak: 3,
      macroMode: 'auto',
      planRows: { workout:true, food:true, water:false, fast:false },
      currentDate: todayStr,
      activeDate: todayStr,
      nutritionDate: todayStr,
      reviewStep: 1,
      trendPeriod: 30,
      diaryShowSnacks: false,
      planShowSnacks: false,
      planTemplates: [],
    };

    try {
      localStorage.setItem('fitsol_v2', JSON.stringify(state));
      return true;
    } catch(e) {
      console.error('seedTestData: failed to write localStorage', e);
      return false;
    }
  }

  window.seedTestData = seedTestData;

  // Auto-seed when loaded without data-manual attribute
  var script = document.currentScript;
  if (!script || !script.dataset.manual) {
    seedTestData();
  }
})();
