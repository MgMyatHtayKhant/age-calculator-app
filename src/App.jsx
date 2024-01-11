import {useReducer } from "react";
import "./App.scss";
import moment from "moment";


function App() {
  const [state, dispatch] = useReducer(
    (state, action) => ({
      ...state,
      ...action,
    }),
    {
      is_wrong_date: false,
      error_wrong_date: "",
      day: "",
      month: "",
      year: "",
      error_day: "",
      error_month: "",
      error_year: "",
      dateDiff: {
        days: "--",
        months: "--",
        years: "--"
      }
    }
  );

  const daysInFebruary = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;  

  const getMonthDays = (month, year) => {
    let numberOfDays = 0
    if (month === 2) {
        numberOfDays = daysInFebruary(year);
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
        numberOfDays = 30;
    } else {
        numberOfDays = 31;
    }
    return numberOfDays
}


  function handleDateDiff(bDay, bMonth, bYear) {
    // Credit to https://github.com/paulina-kottlewska/age-calculator-app
    
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();

    //Years
    let years = currentYear - bYear;
    // Decrease a year if the current month is less than the birth month
    // Or if the current month is equal to the birth month and current day is less than the birth day, decrease a year
    if(currentMonth < bMonth || (currentMonth === bMonth && currentDay < bDay)) {
        years--;
    }
 
    // Months 
    let months = currentMonth - bMonth;

    if(currentDay < bDay) {
        months--;
    }
    // If months are negative, add 12
    if(months < 0) {
        months+= 12;
    }

    //Days 
    let days = currentDay - bDay;
    // If days are negative, find the number of days in the previous month and add to the negative days
    if(days < 0) {
        let daysInPreviousMonth = getMonthDays(currentMonth - 1 === 0 ? 12 : currentMonth - 1, currentYear)
        days += daysInPreviousMonth;
    }
    
    return {
      years,
      months,
      days
    };
  }

  function isValidDate(date, number) {
    return date === "" || date < 0 || date > number;
  }

  function handleSubmit(e) {
    e.preventDefault();

    let validDay = isValidDate(state.day, 31);
    let validMonth = isValidDate(state.month, 12);
    let validYear = isValidDate(state.year, new Date().getFullYear());

    const isSomethingWrong = validDay || validMonth || validYear;


    let space = "This field is required";

    let error_day = "";
    if (validDay)
      error_day = state.day === "" ? space : "Must be a valid day";

    let error_month = "";
    if (validMonth)
      error_month = state.month === "" ? space : "Must be a valid month";

    let error_year = "";
    if (validYear)
      error_year = state.year === "" ? space : "Must be in the past";

   


    // Somethng is wrong in one of three input
    let temp = isSomethingWrong ? "--" : `${state.year}-${state.month}-${state.day}`;
    let date = moment(temp, "YYYY-MM-DD");
    let is_wrong_date = !date.isValid();

    const error_wrong_date = isSomethingWrong ? false : !is_wrong_date ? false : <p>Must be a valid date</p>;

    let action = {
      error_day,
      error_month,
      error_year,
      error_wrong_date,
      is_wrong_date
    };

    action = is_wrong_date ? action : { ...action, dateDiff: handleDateDiff(state.day, state.month, state.year) };

    dispatch(action);
  }

  return (
    <main>
      <div className="container">
        <form onSubmit={handleSubmit} className="form">
          <div className={state.is_wrong_date ? "input-date wrong" : "input-date"}>
            <label htmlFor="input-day">DAY</label>
            <label htmlFor="input-month">MONTH</label>
            <label htmlFor="input-year">YEAR</label>
          </div>
          <div className={state.is_wrong_date ? "user-input wrong" : "user-input"}>
            <input
              id="input-day"
              type="text"
              placeholder="DD"
              value={state.day}
              onChange={(e) => dispatch({ day: e.target.value })}
              autoComplete="off"
            />
            <input
              id="input-month"
              type="text"
              placeholder="MM"
              value={state.month}
              onChange={(e) => dispatch({ month: e.target.value })}
              autoComplete="off"
            />
            <input
              id="input-year"
              type="text"
              placeholder="YYYY"
              value={state.year}
              onChange={(e) => dispatch({ year: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div className="input-error">
            {state.error_wrong_date}
            <p>{state.error_day}</p>
            <p>{state.error_month}</p>
            <p>{state.error_year}</p>
          </div>
          <div className="line">
            <button aria-label="Submit button" title="Submit btutton" className="submit-btn"></button>
          </div>
        </form>
        <div className="display-date">
          <p className="year">
            <span className="number">{!state.is_wrong_date ? state.dateDiff.years : "--"}</span> years
          </p>
          <p className="month">
            <span className="number">{!state.is_wrong_date ? state.dateDiff.months : "--"}</span> months
          </p>
          <p className="day">
            <span className="number">{!state.is_wrong_date ? state.dateDiff.days : "--"}</span> days
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;
