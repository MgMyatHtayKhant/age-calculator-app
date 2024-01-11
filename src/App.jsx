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

  function handleDateDiff() {
    // Credit to https://github.com/GragertVD/age-calculator-app-main

    let day = state.day;
    let month = state.month;
    let year = state.year;

    let date = new Date(year, month - 1, day);
    let currentData = new Date();
    
    let age_year = currentData.getFullYear() - date.getFullYear();
    let age_mounth = 0;
    let age_day = 0;
    if (currentData < new Date(currentData.getFullYear(), month - 1, day)) {
      age_year = age_year - 1;
      age_mounth = currentData.getMonth() + 1;
      age_day = currentData.getDate();
    } else {
      if (currentData.getMonth() + 1 === month) {
        age_mounth = 0;
        age_day = currentData.getDate() - day;
      } else {
        age_mounth = currentData.getMonth() + 1 - month;
        if (currentData.getDate() < day) {
          age_mounth = age_mounth - 1;
          age_day = currentData.getDate() + new Date(currentData.getFullYear(), currentData.getMonth(), 0).getDate() - day;
        } else {
          age_day = currentData.getDate() - day;
        }
      } }
    
    return {
      years: age_year,
      months: age_mounth,
      days: age_day
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

    action = is_wrong_date ? action : { ...action, dateDiff: handleDateDiff() };

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
